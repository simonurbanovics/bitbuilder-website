# Branding assets

Brand source files for BitBuilder. **Not part of the website build** — this
folder lives outside `app/` and `public/`, so nothing here is deployed.

## LinkedIn banner

- `linkedin-banner.html` — the editable source (uses the site's cyan + JetBrains
  Mono brand). Edit copy/layout here.
- `linkedin-banner.png` — **not committed** (git-ignored). Render it yourself
  from the HTML with the command below, then upload the result to LinkedIn →
  profile → edit cover photo. The export is **3168 × 792** (2× LinkedIn's
  1584 × 396 spec).

The bottom-left is intentionally left empty for the profile photo. Note that the
LinkedIn *mobile* app crops the cover tighter and centered.

### Render / re-render from the HTML

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1584,396 \
  --virtual-time-budget=4000 \
  --screenshot=branding/linkedin-banner.png \
  "file://$PWD/branding/linkedin-banner.html"
```
