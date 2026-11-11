# soumikshah.com

Soumik Shah's portfolio: a single static page, no build step, no framework.

```
index.html        the whole site (content lives here)
css/tokens.css    design tokens, generated from the design system's tokens.json
css/site.css      component and layout styles (mobile first; breakpoints at 768px and 1024px)
js/site.js        progressive enhancement: mobile menu, nav shadow, section highlight, live GitHub counts
assets/           favicon
CNAME             tells GitHub Pages the custom domain
```

The design source of truth is the "Soumik Shah Portfolio" design system artifact: colours, type, spacing, the brand book and the page anatomy. Change tokens there, regenerate `css/tokens.css`, keep `site.css` reading only `var(--…)` values.

## Run locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080/. Any static server works; the page also opens straight from the file system (the GitHub counts just stay at their baked-in values).

## Deploy to GitHub Pages and point soumikshah.com at it

1. Create a public repository named `soumikshah.github.io` under the `soumikshah` account and push these files to its default branch.
2. In the repository, Settings → Pages: source "Deploy from a branch", branch `main`, folder `/ (root)`. The `CNAME` file sets the custom domain to `soumikshah.com`.
3. At the domain registrar, replace the Carrd records with GitHub's:
   - `A` records for the apex `soumikshah.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `soumikshah.github.io`
4. Back in Settings → Pages, wait for the DNS check to pass, then tick "Enforce HTTPS".

Netlify, Cloudflare Pages or Vercel work the same way: deploy the folder as-is, add the custom domain, follow their DNS instructions.

## Before going live

- The email address is never written in the HTML. `index.html` holds it as three `data-` parts on the "Email me" button and `js/site.js` assembles the `mailto:` on the first real interaction (pointer, key, touch or scroll), with a `[at] [dot]` fallback for readers without JavaScript. To change it, edit the `data-u`, `data-d` and `data-t` attributes.
- The Résumé button is commented out in the hero. Drop the PDF into `assets/` and uncomment that block.
- Star and fork counts are refreshed from the GitHub API on load; the numbers in the HTML are the fallback and were correct on 10 Nov 2026.
