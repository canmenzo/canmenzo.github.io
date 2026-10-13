# Project domains

The portfolio links to working `/projects/threatintel/`, `/projects/detkit/`, and `/projects/logibar/` pages until the custom domains are connected. Nothing here changes production hosting or DNS.

Build the standalone sites:

```sh
node scripts/build-project-sites.mjs
```

Each output contains its own HTML, stylesheet, fonts, theme toggle, images, and sitemap. No framework, server, or runtime dependencies.

| Domain | Output directory |
| --- | --- |
| threatintel.canmenzo.com | dist-projects/threatintel |
| detkit.canmenzo.com | dist-projects/detkit |
| logibar.canmenzo.com | dist-projects/logibar |

For a local standalone preview, run `python -m http.server 8788 --directory dist-projects/threatintel` and open `http://127.0.0.1:8788/`.

## Connect after review

Create one Cloudflare Pages project per output from this repository. Use `node scripts/build-project-sites.mjs` as the build command, the matching output directory above, and the repository's production branch (`master`). Each project can provide a branch preview for this PR before production deployment.

Add the matching custom domain in each Pages project's **Custom domains** panel, then complete the DNS records it provides. Preserve the existing apex domain and GitHub Pages hosting. Once all three domains return the correct pages over HTTPS, change the portfolio and homepage links from the local project paths to the subdomains.

Cloudflare's setup instructions: https://developers.cloudflare.com/pages/configuration/custom-domains/

The PR workflow builds the three standalone sites and attaches them as `project-subdomain-sites`. It does not deploy or modify DNS.

## Images

ThreatIntelSearch's context-menu screenshot and Logibar's release graphic come from their project repositories. Detkit's dashboard is rendered from its public source; the coverage image is the project's own chart. JobScope uses its public dashboard screenshot. Moviepickr and Cheff.fit use screenshots of their live homepages. Other cards use original SVG project covers, not product screenshots.
