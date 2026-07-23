import { useEffect, useState } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { Link } from "react-router";
import type { MLCEngine, InitProgressReport } from "@mlc-ai/web-llm";

import { Thread } from "~/components/assistant-ui/thread";
import { Logo } from "~/components/logo";
import { getLang, lp } from "~/i18n";
import { site } from "~/site";
import type { Route } from "./+types/assistant";

export function meta({ params }: Route.MetaArgs) {
  getLang(params.lang);
  return [
    { title: `Local AI demo — ${site.name}` },
    {
      name: "description",
      content:
        "A chat assistant that runs entirely in your browser via WebGPU — no server, no API keys, nothing leaves your device.",
    },
    // Hidden demo — keep it out of the index.
    { name: "robots", content: "noindex" },
  ];
}

// A small instruct model — a few hundred MB, cached in the browser after the
// first load. Big enough to be coherent, small enough to download live.
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const SYSTEM_PROMPT = `You are the assistant for BitBuilder, running entirely in the visitor's browser via WebGPU — no server, no API, nothing they type leaves their device. You are a small model running locally, so keep answers short, friendly, and honest; if you are unsure, say so and point them to the contact page.

## About BitBuilder
BitBuilder (BitBuilder Kft.) is an independent, one-person software studio founded in 2025, based in Hungary and working fully remote with startups and growing teams. Website: bitbuilder.tech. It delivers senior AI, cloud, and full-stack engineering. Its trademark is end-to-end ownership: taking business requirements all the way to a production system — architecture, backend, frontend, and infrastructure — then handing it off cleanly. The focus is AI that reaches production (monitored, validated pipelines, not demos) on cloud-native, serverless AWS foundations.

## Services
- AI & LLM engineering: production RAG, agents, and LLM pipelines (LangChain / LangGraph), and document intelligence that turns unstructured PDFs, images, and text into structured, validated data.
- Cloud architecture on AWS: serverless (Lambda, Step Functions, Aurora) automated end-to-end with Terraform; migrations and Well-Architected reviews.
- Data engineering: ingestion, ETL, and streaming across BigQuery, Spark, and Kafka.
- Machine learning & optimization: model training and deployment (SageMaker, scikit-learn) and custom optimization engines with Google OR-Tools.
- Full-stack product development: React / TypeScript front ends with Python (Flask, FastAPI) back ends.
- Technical leadership & consulting: architecture reviews, migration strategy, and sole technical ownership.

## About Simon Urbanovics — founder & lead engineer
Simon is a senior software engineer with more than a decade of experience spanning AI/ML, cloud, data engineering, and full-stack development. He holds an MSc in Computer Engineering from the Budapest University of Technology and Economics (BME) and is AWS Certified Machine Learning – Specialty. Recent work (anonymized) includes a logistics optimization platform (Google OR-Tools on serverless AWS, as sole technical owner), an insurance document-intelligence pipeline (AWS Textract + LangGraph), and AWS cloud-migration consultancy. Core stack: Python, TypeScript, Java, Rust; React / Next.js; Flask / FastAPI; Terraform, AWS, Kubernetes; PyTorch, LangChain / LangGraph. He works in English and Hungarian, and is building toward a product for self-hosted AI inference — which this in-browser chat demo previews.

## Working with BitBuilder
For project enquiries, quotes, or availability, direct people to the contact page at bitbuilder.tech/en/contact, or to Simon on LinkedIn. Do not invent specific prices, timelines, client names, or metrics; if asked for those, point them to the contact page.`;

// Lazily created singleton engine, plus the latest load-progress text. WebLLM
// is dynamic-imported so its (large) bundle and WebGPU calls only load in the
// browser when someone actually starts a chat — never at build time.
let enginePromise: Promise<MLCEngine> | null = null;
let progressText = "";

function loadEngine(): Promise<MLCEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      if (typeof navigator === "undefined" || !("gpu" in navigator)) {
        throw new Error("WEBGPU_UNAVAILABLE");
      }
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      return CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (r: InitProgressReport) => {
          progressText = r.text;
        },
      });
    })();
  }
  return enginePromise;
}

// WebLLM persists weights + compiled kernels in Cache Storage (buckets named
// `webllm/*`), which survives reloads and browser restarts. These helpers let a
// visitor detect and reclaim that ~0.9 GB without loading the WebLLM library.
async function hasCachedModel(): Promise<boolean> {
  try {
    if (typeof caches === "undefined") return false;
    const names = await caches.keys();
    return names.some((n) => n.toLowerCase().includes("webllm"));
  } catch {
    return false;
  }
}

async function clearDownloadedModel(): Promise<void> {
  // Free GPU memory first if an engine is live in this session.
  if (enginePromise) {
    try {
      const engine = await enginePromise;
      await engine.unload();
    } catch {
      /* engine may have failed to load; nothing to unload */
    }
    enginePromise = null;
    progressText = "";
  }
  // Delete the persisted weights/kernels (default Cache API backend).
  if (typeof caches !== "undefined") {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((n) => n.toLowerCase().includes("webllm"))
        .map((n) => caches.delete(n)),
    );
  }
  // Belt-and-suspenders: WebLLM can be configured to use IndexedDB instead.
  if (typeof indexedDB !== "undefined" && "databases" in indexedDB) {
    try {
      const dbs = await indexedDB.databases();
      await Promise.all(
        dbs
          .filter((d) => d.name && /webllm|tvmjs/i.test(d.name))
          .map(
            (d) =>
              new Promise<void>((resolve) => {
                const req = indexedDB.deleteDatabase(d.name!);
                req.onsuccess = req.onerror = req.onblocked = () => resolve();
              }),
          ),
      );
    } catch {
      /* best effort */
    }
  }
}

const adapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    let engine: MLCEngine;
    try {
      // Surface download/compile progress inside the reply bubble until ready.
      const pending = loadEngine();
      let ready = false;
      pending.then(
        () => {
          ready = true;
        },
        () => {
          ready = true;
        },
      );
      while (!ready) {
        yield {
          content: [
            {
              type: "text",
              text: progressText || "Loading the model into your browser…",
            },
          ],
        };
        await new Promise((r) => setTimeout(r, 200));
      }
      engine = await pending;
    } catch {
      yield {
        content: [
          {
            type: "text",
            text:
              "This demo needs a WebGPU-capable browser — Chrome or Edge on " +
              "desktop, or Safari 18+. Your browser doesn't expose WebGPU, so " +
              "the model can't run locally here.",
          },
        ],
      };
      return;
    }

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content
          .map((p) => (p.type === "text" ? p.text : ""))
          .join(""),
      })),
    ];

    const stream = await engine.chat.completions.create({
      messages: chatMessages,
      stream: true,
      temperature: 0.7,
    });

    let text = "";
    for await (const chunk of stream) {
      if (abortSignal.aborted) break;
      text += chunk.choices[0]?.delta?.content ?? "";
      yield { content: [{ type: "text", text }] };
    }
  },
};

export default function AssistantRoute({ params }: Route.ComponentProps) {
  const lang = getLang(params.lang);
  const runtime = useLocalRuntime(adapter);
  const [cached, setCached] = useState(false);
  const [clearState, setClearState] = useState<"idle" | "clearing" | "cleared">(
    "idle",
  );

  useEffect(() => {
    hasCachedModel().then(setCached);
  }, []);

  async function handleClear() {
    setClearState("clearing");
    await clearDownloadedModel();
    setCached(false);
    setClearState("cleared");
  }

  const showClear = cached || clearState !== "idle";

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-slate-950">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <Link to={lp(lang, "/")} aria-label={site.name}>
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-slate-500 sm:inline dark:text-slate-400">
            runs locally in your browser · no server
          </span>
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              disabled={clearState === "clearing"}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-500 hover:text-brand-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:text-brand-300"
            >
              {clearState === "clearing"
                ? "Clearing…"
                : clearState === "cleared"
                  ? "Model cleared"
                  : "Clear downloaded model"}
            </button>
          )}
        </div>
      </header>
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="min-h-0 flex-1">
          <Thread />
        </div>
      </AssistantRuntimeProvider>
    </div>
  );
}
