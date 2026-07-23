import { useParams } from "react-router";

import { site } from "~/site";

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------
export type Lang = "en" | "hu";
export const LANGS: Lang[] = ["en", "hu"];
export const DEFAULT_LANG: Lang = "en";

/** Validate a route `:lang` param, falling back to English. */
export function getLang(param: string | undefined): Lang {
  return param === "hu" ? "hu" : "en";
}

/** Build an internal path with the current language prefix, e.g. lp("hu", "/services"). */
export function lp(lang: Lang, path = ""): string {
  return `/${lang}${path}`;
}

/** Hook: current language from the route param. */
export function useLang(): Lang {
  return getLang(useParams().lang);
}

/** Hook: the translation dictionary for the current language. */
export function useT() {
  return dict[useLang()];
}

// ---------------------------------------------------------------------------
// SEO meta: title, description, canonical, and hreflang alternates.
// Spread into a route's `meta` export.
// ---------------------------------------------------------------------------
export function localizedMeta(
  lang: Lang,
  pathname: string,
  title: string,
  description: string,
) {
  // Strip the leading /en or /hu to get the shared suffix (e.g. "/services").
  const suffix = pathname.replace(/^\/(en|hu)/, "");
  const url = (l: Lang) => `${site.url}/${l}${suffix}`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url(lang) },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: url("en") },
    { tagName: "link", rel: "alternate", hrefLang: "hu", href: url("hu") },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url("en") },
  ];
}

// ---------------------------------------------------------------------------
// Locale-aware money formatting. Guards against an invalid currency code
// arriving from a query param (Intl throws a RangeError on unknown codes).
// ---------------------------------------------------------------------------
export function formatMoney(lang: Lang, currency: string, amount: number): string {
  const locale = lang === "hu" ? "hu-HU" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      amount,
    );
    return `${n} ${currency}`;
  }
}

// ---------------------------------------------------------------------------
// Translations. `dict.hu` is a draft for Simon (native speaker) to review.
// ---------------------------------------------------------------------------
type Item = { title: string; body: string };
type Project = { tag: string; title: string; body: string };

type Dict = {
  nav: { services: string; portfolio: string; about: string; contact: string };
  footer: { rights: string };
  a11y: { home: string; language: string };
  home: {
    tagline: string;
    description: string;
    ctaStart: string;
    ctaWork: string;
    highlights: Item[];
    metaDesc: string;
  };
  services: {
    title: string;
    intro: string;
    items: Item[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    metaDesc: string;
  };
  portfolio: {
    title: string;
    intro: string;
    projects: Project[];
    metaDesc: string;
  };
  about: {
    title: string;
    portraitAlt: string;
    paragraphs: string[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    metaDesc: string;
  };
  contact: {
    title: string;
    intro: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
    networkError: string;
    captchaRequired: string;
    otherChannelPre: string;
    otherChannelPost: string;
    subject: string;
    metaDesc: string;
  };
  calculator: {
    title: string;
    intro: string;
    daysLabel: string;
    daysHint: string;
    presetLabel: string;
    presets: { days: number; label: string }[];
    commitmentLabel: string;
    tiers: {
      annual: string;
      halfYear: string;
      quarter: string;
      month: string;
      daily: string;
    };
    rateLabel: string;
    perDay: string;
    perYear: string;
    totalLabel: string;
    employeeTitle: string;
    employeeLoadedLabel: string;
    employeeDeltaLabel: string;
    employeeNote: string;
    metaDesc: string;
  };
};

const en: Dict = {
  nav: {
    services: "Services",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
  },
  footer: { rights: "All rights reserved." },
  a11y: { home: "BitBuilder home", language: "Language" },
  home: {
    tagline: "Senior AI, cloud, and full-stack engineering for teams that ship.",
    description:
      "BitBuilder is an independent software studio designing and shipping production AI, cloud, and full-stack systems for startups and growing teams.",
    ctaStart: "Start a project",
    ctaWork: "See recent work",
    highlights: [
      {
        title: "End-to-end ownership",
        body: "Sole technical owner on projects from business requirements to a production system — architecture, backend, frontend, and infrastructure.",
      },
      {
        title: "AI that reaches production",
        body: "Not demos: monitored, validated LLM and ML pipelines — RAG, agents, document intelligence — built for accuracy and reliability.",
      },
      {
        title: "Cloud-native by default",
        body: "Serverless AWS architectures automated with Terraform, designed to scale and to hand off cleanly to your team.",
      },
    ],
    metaDesc:
      "BitBuilder is an independent software studio designing and shipping production AI, cloud, and full-stack systems for startups and growing teams.",
  },
  services: {
    title: "Services",
    intro:
      "Flexible engagements sized to your problem — whether that's shipping a new product, unblocking an existing team, or keeping something running.",
    items: [
      {
        title: "AI & LLM engineering",
        body: "Production-grade RAG, agents, and LLM pipelines (LangChain / LangGraph), plus document intelligence — turning unstructured PDFs, images, and text into structured, validated data.",
      },
      {
        title: "Cloud architecture (AWS)",
        body: "Serverless architectures on Lambda, Step Functions, Aurora, and more — automated end-to-end with Terraform. AWS migrations and Well-Architected reviews.",
      },
      {
        title: "Data engineering",
        body: "Ingestion and ETL pipelines, streaming, and analytics across BigQuery, Spark, Kafka, and the wider data stack — from source systems to dashboards.",
      },
      {
        title: "Machine learning & optimization",
        body: "Model training and deployment (SageMaker, scikit-learn) and custom optimization engines with Google OR-Tools for complex scheduling and planning problems.",
      },
      {
        title: "Full-stack product development",
        body: "End-to-end web applications in React / TypeScript with Python (Flask, FastAPI) backends — shipped, monitored, and built to be maintained.",
      },
      {
        title: "Technical leadership & consulting",
        body: "Architecture reviews, migration strategy, and sole technical ownership — translating business requirements into systems your team can run.",
      },
    ],
    ctaTitle: "Not sure what you need?",
    ctaBody:
      "Tell me about the problem and I'll suggest the smallest engagement that moves it forward.",
    ctaButton: "Get in touch",
    metaDesc:
      "AI & LLM engineering, AWS cloud architecture, data engineering, ML & optimization, and full-stack development from BitBuilder.",
  },
  portfolio: {
    title: "Selected work",
    intro:
      "A selection of recent engagements across AI, cloud, and optimization. Client names are withheld — the work speaks for the kind of problems I take on.",
    projects: [
      {
        tag: "AI · Data engineering",
        title: "CRM taxonomy from unstructured feedback",
        body: "Designed and built a cloud-native tool that turns raw customer feedback into a dynamic taxonomy tree. Engineered end-to-end pipelines to ingest HubSpot CRM data, then applied embedding-vector clustering and dimensionality reduction to classify it — full-stack Python and React, with infrastructure automated in Terraform.",
      },
      {
        tag: "Optimization · Serverless AWS",
        title: "Logistics scheduling optimization platform",
        body: "Sole technical owner of an end-to-end platform optimizing pickup and delivery schedules. Designed a serverless AWS architecture (Amplify, Lambda, RDS Aurora) and a custom optimization engine on Google OR-Tools running via AWS Batch to handle complex scheduling constraints — React, Flask, Python, Terraform.",
      },
      {
        tag: "AI · Document intelligence",
        title: "Multi-modal insurance document extraction",
        body: "Engineered an AI pipeline that ingests thousands of pages of unstructured insurance data (PDFs, images, OCR) into clean structured records. Built on AWS Step Functions and Textract with a LangGraph orchestration pipeline, validation scoring, and CloudWatch monitoring — delivered with source-highlighting in the PDF UI and an SSR-React frontend backed by Valkey and DynamoDB.",
      },
      {
        tag: "Cloud consultancy",
        title: "Legacy SQL → AWS migration & secure analytics",
        body: "Provided architectural oversight for a large-scale cloud migration: technical risk assessment and mapping to move legacy MS SQL workloads to AWS Babelfish, plus secure Amazon QuickSight dashboards with row-level security for multi-tenant data isolation.",
      },
    ],
    metaDesc:
      "Recent AI, cloud, and optimization engagements delivered by BitBuilder.",
  },
  about: {
    title: "About",
    portraitAlt: "Simon Urbanovics, founder of BitBuilder",
    paragraphs: [
      "I'm Simon Urbanovics, founder and lead engineer of BitBuilder — an independent software studio based in Hungary, working remotely with teams anywhere. Over more than a decade I've designed, built, and shipped production software across insurance, logistics, aviation, automotive, retail, and fintech.",
      "My work sits where AI, cloud, and full-stack engineering meet: LLM and machine-learning pipelines that reach production, serverless AWS architectures automated with Terraform, data-engineering pipelines, and the web applications that put it all in front of users. I'm an AWS Certified Machine Learning – Specialty engineer, and I've often been the sole technical owner turning a business problem into a running system.",
      "I care about meticulous, dependable work — systems that are accurate, monitored, and maintainable long after I'm gone. I scope honestly, communicate in plain language, and hand things off cleanly so you're never left stranded. I do my best work on problems that reward deep focus and a real understanding of the domain.",
    ],
    ctaTitle: "Let's work together",
    ctaBody: "Have a project in mind or just want to talk through an idea?",
    ctaButton: "Contact me",
    metaDesc:
      "Simon Urbanovics — founder of BitBuilder and an AWS-certified senior AI, cloud, and full-stack engineer with over a decade of experience.",
  },
  contact: {
    title: "Get in touch",
    intro: "Tell me a little about your project and I'll get back to you.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Thanks — message sent!",
    successBody:
      "I'll reply to the email address you provided as soon as I can.",
    errorGeneric: "Something went wrong. Please try again.",
    networkError:
      "Network error. Please try again, or reach out on LinkedIn.",
    captchaRequired: "Please confirm you're human before sending.",
    otherChannelPre: "Prefer another channel? Find me on ",
    otherChannelPost: ".",
    subject: "New enquiry via BitBuilder website",
    metaDesc: "Get in touch with BitBuilder about your project.",
  },
  calculator: {
    title: "Rate calculator",
    intro:
      "Estimate the daily rate for an engagement. The more workdays you commit, the lower the rate — long, stable commitments earn the deepest discount.",
    daysLabel: "Workdays reserved",
    daysHint: "How many billable days you plan to commit over the engagement.",
    presetLabel: "Quick select",
    presets: [
      { days: 1, label: "1 day" },
      { days: 22, label: "1 month" },
      { days: 65, label: "3 months" },
      { days: 110, label: "6 months" },
      { days: 220, label: "1 year" },
    ],
    commitmentLabel: "Commitment",
    tiers: {
      annual: "Annual",
      halfYear: "Half-year",
      quarter: "Quarterly",
      month: "Monthly",
      daily: "Short / daily",
    },
    rateLabel: "Daily rate",
    perDay: "/ day",
    perYear: "/ year",
    totalLabel: "Contract total",
    employeeTitle: "Compared to hiring in-house",
    employeeLoadedLabel: "Equivalent employee, fully loaded",
    employeeDeltaLabel: "Difference over {days} workdays",
    employeeNote:
      "Loaded cost = gross × 12 × 1.13 (employer contribution) ÷ 220 worked days — before paid leave, notice period, equipment, and hiring risk.",
    metaDesc: "BitBuilder engagement rate calculator.",
  },
};

const hu: Dict = {
  nav: {
    services: "Szolgáltatások",
    portfolio: "Referenciák",
    about: "Rólam",
    contact: "Kapcsolat",
  },
  footer: { rights: "Minden jog fenntartva." },
  a11y: { home: "BitBuilder kezdőlap", language: "Nyelv" },
  home: {
    tagline:
      "Senior AI-, felhő- és full-stack fejlesztés olyan csapatoknak, akik szállítanak.",
    description:
      "A BitBuilder független szoftverstúdió, amely éles környezetben futó AI-, felhő- és full-stack rendszereket tervez és szállít startupoknak és növekvő csapatoknak.",
    ctaStart: "Projekt indítása",
    ctaWork: "Referenciák megtekintése",
    highlights: [
      {
        title: "Teljes körű felelősség",
        body: "Egyetlen technikai felelősként az üzleti igényektől az éles rendszerig — architektúra, backend, frontend és infrastruktúra.",
      },
      {
        title: "AI, ami eljut az élesig",
        body: "Nem demók: monitorozott, validált LLM- és ML-pipeline-ok — RAG, ágensek, dokumentum-intelligencia —, a pontosságra és a megbízhatóságra építve.",
      },
      {
        title: "Alapból felhőnatív",
        body: "Serverless AWS-architektúrák Terraformmal automatizálva, skálázhatóra és a csapatnak tisztán átadhatóra tervezve.",
      },
    ],
    metaDesc:
      "A BitBuilder független szoftverstúdió, amely éles környezetben futó AI-, felhő- és full-stack rendszereket tervez és szállít startupoknak és növekvő csapatoknak.",
  },
  services: {
    title: "Szolgáltatások",
    intro:
      "Rugalmas együttműködések a feladathoz méretezve — legyen szó új termék elindításáról, egy meglévő csapat kisegítéséről vagy egy rendszer folyamatos üzemeltetéséről.",
    items: [
      {
        title: "AI- és LLM-fejlesztés",
        body: "Éles környezetbe szánt RAG-, ágens- és LLM-pipeline-ok (LangChain / LangGraph), valamint dokumentum-intelligencia — strukturálatlan PDF-ekből, képekből és szövegből strukturált, validált adat.",
      },
      {
        title: "Felhőarchitektúra (AWS)",
        body: "Serverless architektúrák Lambda, Step Functions, Aurora és társai felett — végponttól végpontig Terraformmal automatizálva. AWS-migrációk és Well-Architected átvizsgálások.",
      },
      {
        title: "Adatmérnökség",
        body: "Adatbetöltő és ETL-pipeline-ok, streaming és analitika BigQuery, Spark, Kafka és a tágabb adatstack felett — a forrásrendszerektől a dashboardokig.",
      },
      {
        title: "Gépi tanulás és optimalizáció",
        body: "Modellek tanítása és üzembe helyezése (SageMaker, scikit-learn), valamint egyedi optimalizációs motorok Google OR-Tools-szal összetett ütemezési és tervezési feladatokra.",
      },
      {
        title: "Full-stack termékfejlesztés",
        body: "Végponttól végpontig webalkalmazások React / TypeScript frontenddel és Python (Flask, FastAPI) backenddel — leszállítva, monitorozva, karbantarthatóra építve.",
      },
      {
        title: "Technikai vezetés és tanácsadás",
        body: "Architektúra-átvizsgálások, migrációs stratégia és teljes technikai felelősségvállalás — az üzleti igényeket a csapat által üzemeltethető rendszerekké fordítva.",
      },
    ],
    ctaTitle: "Nem biztos benne, mire van szüksége?",
    ctaBody:
      "Meséljen a problémáról, és javaslom a legkisebb együttműködést, amely előreviszi.",
    ctaButton: "Kapcsolatfelvétel",
    metaDesc:
      "AI- és LLM-fejlesztés, AWS-felhőarchitektúra, adatmérnökség, gépi tanulás és optimalizáció, valamint full-stack fejlesztés a BitBuildertől.",
  },
  portfolio: {
    title: "Válogatott munkáim",
    intro:
      "Válogatás a legutóbbi AI-, felhő- és optimalizációs munkáimból. Az ügyfelek nevét nem tüntetem fel — a munka önmagáért beszél.",
    projects: [
      {
        tag: "AI · Adatmérnökség",
        title: "CRM-taxonómia strukturálatlan visszajelzésekből",
        body: "Egy felhőnatív eszközt terveztem és építettem, amely a nyers ügyfél-visszajelzéseket dinamikus taxonómiafává alakítja. Végpontok közötti pipeline-okat építettem a HubSpot CRM-adatok betöltésére, majd embedding-vektor-klaszterezéssel és dimenziócsökkentéssel osztályoztam azokat — full-stack Python és React, Terraformmal automatizált infrastruktúrával.",
      },
      {
        tag: "Optimalizáció · Serverless AWS",
        title: "Logisztikai ütemezés-optimalizáló platform",
        body: "Egyetlen technikai felelősként egy végpontok közötti platformot készítettem a felvételi és kiszállítási ütemtervek optimalizálására. Serverless AWS-architektúrát (Amplify, Lambda, RDS Aurora) és egy egyedi, Google OR-Tools-ra épülő, AWS Batchen futó optimalizációs motort terveztem az összetett ütemezési feltételek kezelésére — React, Flask, Python, Terraform.",
      },
      {
        tag: "AI · Dokumentum-intelligencia",
        title: "Multimodális biztosítási dokumentumfeldolgozás",
        body: "Olyan AI-pipeline-t építettem, amely több ezer oldalnyi strukturálatlan biztosítási adatot (PDF, kép, OCR) alakít tiszta, strukturált rekordokká. AWS Step Functionsre és Textractre épül, LangGraph-orchesztrációval, validációs pontozással és CloudWatch-monitorozással — a PDF-felületen forráskiemeléssel és SSR-React frontenddel, Valkey és DynamoDB háttérrel.",
      },
      {
        tag: "Felhőtanácsadás",
        title: "Legacy SQL → AWS migráció és biztonságos analitika",
        body: "Architekturális felügyeletet biztosítottam egy nagyméretű felhőmigrációhoz: technikai kockázatelemzés és feltérképezés a legacy MS SQL terhelések AWS Babelfishre költöztetéséhez, valamint biztonságos Amazon QuickSight dashboardok sorszintű biztonsággal (RLS) a több-bérlős adatszeparációhoz.",
      },
    ],
    metaDesc:
      "A BitBuilder legutóbbi AI-, felhő- és optimalizációs munkái.",
  },
  about: {
    title: "Rólam",
    portraitAlt: "Urbanovics Simon, a BitBuilder alapítója",
    paragraphs: [
      "Urbanovics Simon vagyok, a BitBuilder alapítója és vezető mérnöke — egy magyarországi független szoftverstúdióé, amely távolról dolgozik bárhol lévő csapatokkal. Több mint egy évtizede tervezek, építek és szállítok éles szoftvereket a biztosítás, a logisztika, a légi közlekedés, az autóipar, a kiskereskedelem és a fintech területén.",
      "A munkám ott van, ahol az AI, a felhő és a full-stack fejlesztés találkozik: éles környezetig eljutó LLM- és gépitanulás-pipeline-ok, Terraformmal automatizált serverless AWS-architektúrák, adatmérnöki pipeline-ok, és a webalkalmazások, amelyek mindezt a felhasználók elé teszik. AWS Certified Machine Learning – Specialty mérnök vagyok, és gyakran egyedüli technikai felelősként alakítottam egy üzleti problémát működő rendszerré.",
      "Fontos számomra az alapos, megbízható munka — olyan rendszerek, amelyek pontosak, monitorozottak, és jóval a távozásom után is karbantarthatók. Őszintén becslök, közérthetően kommunikálok, és tisztán adom át a munkát, hogy soha ne maradjon magára. Akkor dolgozom a legjobban, amikor a feladat mély elmélyülést és a terület valódi megértését igényli.",
    ],
    ctaTitle: "Dolgozzunk együtt",
    ctaBody: "Van egy projektötlete, vagy csak átbeszélne egy elképzelést?",
    ctaButton: "Írjon nekem",
    metaDesc:
      "Urbanovics Simon — a BitBuilder alapítója, AWS-tanúsított senior AI-, felhő- és full-stack mérnök, több mint egy évtized tapasztalattal.",
  },
  contact: {
    title: "Lépjünk kapcsolatba",
    intro: "Meséljen röviden a projektjéről, és hamarosan jelentkezem.",
    name: "Név",
    email: "E-mail",
    message: "Üzenet",
    send: "Üzenet küldése",
    sending: "Küldés…",
    successTitle: "Köszönöm — az üzenet elment!",
    successBody: "A megadott e-mail-címre hamarosan válaszolok.",
    errorGeneric: "Valami hiba történt. Kérjük, próbálja újra.",
    networkError:
      "Hálózati hiba. Kérjük, próbálja újra, vagy keressen a LinkedInen.",
    captchaRequired: "Kérem, erősítse meg, hogy nem robot.",
    otherChannelPre: "Inkább más csatornán? Megtalál a ",
    otherChannelPost: " oldalon.",
    subject: "Új megkeresés a BitBuilder weboldaláról",
    metaDesc: "Vegye fel a kapcsolatot a BitBuilderrel a projektjéről.",
  },
  calculator: {
    title: "Díjkalkulátor",
    intro:
      "Becsülje meg egy együttműködés napidíját. Minél több munkanapot köt le, annál alacsonyabb a díj — a hosszú, stabil elköteleződés kapja a legnagyobb kedvezményt.",
    daysLabel: "Lefoglalt munkanapok",
    daysHint: "Hány számlázható napot tervez lekötni az együttműködés során.",
    presetLabel: "Gyorsválasztás",
    presets: [
      { days: 1, label: "1 nap" },
      { days: 22, label: "1 hónap" },
      { days: 65, label: "3 hónap" },
      { days: 110, label: "6 hónap" },
      { days: 220, label: "1 év" },
    ],
    commitmentLabel: "Elköteleződés",
    tiers: {
      annual: "Éves",
      halfYear: "Féléves",
      quarter: "Negyedéves",
      month: "Havi",
      daily: "Rövid / napi",
    },
    rateLabel: "Napidíj",
    perDay: "/ nap",
    perYear: "/ év",
    totalLabel: "Szerződés összesen",
    employeeTitle: "Összevetve a saját alkalmazottal",
    employeeLoadedLabel: "Egyenértékű alkalmazott, teljes költséggel",
    employeeDeltaLabel: "Különbség {days} munkanapra",
    employeeNote:
      "Teljes költség = bruttó × 12 × 1,13 (munkáltatói járulék) ÷ 220 munkanap — a fizetett szabadság, felmondási idő, eszközök és a felvétel kockázata nélkül.",
    metaDesc: "BitBuilder napidíj-kalkulátor.",
  },
};

export const dict: Record<Lang, Dict> = { en, hu };
