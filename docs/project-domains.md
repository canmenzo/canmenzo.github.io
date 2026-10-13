# Project domains

The project cards target `detkit.canmenzo.com`, `threatintel.canmenzo.com`, `logibar.canmenzo.com`, and `numbers.canmenzo.com`. On localhost, the gallery uses the matching `/projects/<name>/` pages for review. The numbers solver uses `/numbers/` in local preview.

Build all four standalone sites:

```sh
node scripts/build-project-sites.mjs
```

| Domain | Output directory |
| --- | --- |
| detkit.canmenzo.com | dist-projects/detkit |
| threatintel.canmenzo.com | dist-projects/threatintel |
| logibar.canmenzo.com | dist-projects/logibar |
| numbers.canmenzo.com | dist-projects/numbers |

Each output includes its own HTML, CSS, fonts, images, theme toggle, shared navigation, and sitemap. Navigation links point back to the main portfolio.

## Detkit dashboard

The Detkit build includes the working dashboard at `/dashboard/` and its method page at `/dashboard/about.html`. Both include the shared navbar. The landing page links to these local routes, so the dashboard remains on the same subdomain.

The checked-in dashboard files come from `canmenzo/detkit/site` at commit `d109137ea376b9ff793dc7ca120c26ac64949e27`. They preserve the published rule data, filters, tooltips, and coverage chart. Refresh them from the project when its generated results change.

For a complete standalone preview:

```sh
python -m http.server 8788 --directory dist-projects/detkit
```

Open `http://127.0.0.1:8788/`, then follow **Open the dashboard**.

## Hosting

Each subdomain is the GitHub Pages site of its own repository, deployed by that repository's `.github/workflows/pages.yml`. The workflow checks out this repository, runs the build script, and publishes the matching output directory. Project source code is untouched.

| Domain | Repository | Workflow trigger |
| --- | --- | --- |
| detkit.canmenzo.com | canmenzo/detkit | push to `main`, manual |
| threatintel.canmenzo.com | canmenzo/ThreatIntelSearch | manual |
| logibar.canmenzo.com | canmenzo/logibar | manual |
| numbers.canmenzo.com | canmenzo/numbers | manual |

Changes here do not redeploy the subdomains. After editing a project page, shared CSS, fonts, or the build script, run:

```sh
for r in detkit ThreatIntelSearch logibar numbers; do gh workflow run pages.yml -R canmenzo/$r; done
```

Cloudflare DNS has a DNS-only `CNAME <name> -> canmenzo.github.io` per subdomain; each repository's Pages custom domain selects the site, and Enforce HTTPS is on. Because those repositories are project sites of `canmenzo.github.io`, `canmenzo.com/numbers/` and `canmenzo.com/detkit/` redirect to their subdomains. The apex, `www`, mail and `matrix` records are unchanged.

## Project images

Martek Marble, Moviepickr, Cheff.fit, the numbers solver, and Canmenzo.com use screenshots of their actual pages. Detkit uses its dashboard and coverage chart; ThreatIntelSearch, Logibar, Handy, and JobScope use screenshots from their public repositories. The remaining tools and private projects use text cards, without generated logos or simulated interfaces.

Jarvis uses the Iron Man helmet image supplied by the owner, optimized as WebP for the project card.
