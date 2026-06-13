# Deploy to GitHub Pages (free)

This repo is wired to build itself and publish to GitHub Pages on every push to `main`,
via `.github/workflows/deploy.yml` (Astro's official Action). No local build needed — GitHub builds it.

You'll get a free site at **https://jamesbelanger.github.io/** and can attach `jamesbelanger.io` later.

---

## ⚠️ Before you publish
The site is **public and Google-indexable the moment it's live.** First finish `CONTENT-TODO.md` —
especially **verifying every publication's author list / venue / DOI**. Once it's cached/indexed, the claims are out there.

---

## One-time setup (≈5 min)

The local repo is already initialized and committed. To go live:

```bash
# 1. Create the GitHub user-site repo (must be named exactly this) and push.
#    --public is required for free Pages.
gh repo create JamesBelanger.github.io --public --source=. --remote=origin --push

# 2. Tell Pages to deploy from the GitHub Action (not from a branch).
gh api -X POST repos/JamesBelanger/JamesBelanger.github.io/pages -f build_type=workflow
```

Then watch the build: **GitHub → repo → Actions tab.** When it's green, your site is at
**https://jamesbelanger.github.io/** (first build takes ~1–2 min).

> Note: a repo named `JamesBelanger.github.io` is the *Pages site* — separate from a repo named
> `JamesBelanger` (which would be your profile README). They don't conflict.

Every future change is just: edit → `git commit` → `git push`. The Action rebuilds and redeploys.

---

## Later: attach your custom domain (jamesbelanger.io)

1. Buy `jamesbelanger.io` (Cloudflare Registrar or Namecheap, ~$12–15/yr).
2. In **repo → Settings → Pages → Custom domain**, enter `jamesbelanger.io` and save (this provisions free HTTPS).
3. At your registrar, add DNS records pointing to GitHub Pages:
   - Apex `jamesbelanger.io` → four **A** records: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153` (and the AAAA equivalents if you want IPv6).
   - `www` → **CNAME** `jamesbelanger.github.io`.
4. In this repo, make the site canonical to the new domain:
   - `astro.config.mjs` → `site: 'https://jamesbelanger.io'`
   - `public/robots.txt` → `Sitemap: https://jamesbelanger.io/sitemap-index.xml`
   - add `public/CNAME` containing one line: `jamesbelanger.io`
   - commit + push (the Action redeploys; GitHub auto-redirects the github.io URL to the domain).

---

## Get it found on Google
- Submit the sitemap in **Google Search Console** (free): add the property, then submit
  `https://jamesbelanger.io/sitemap-index.xml` (or the github.io one until the domain is live).
- Add the site URL to your **Google Scholar** and **ORCID** profiles, and your email signature.
- Indexing takes a few days to a couple of weeks; Search Console speeds it up.
