# Project domains

The project cards target `detkit.menzo.dev`, `threatintel.menzo.dev`, `logibar.menzo.dev`, and `numbers.menzo.dev`. On localhost, the gallery uses the matching `/projects/<name>/` pages for review. The numbers solver uses `/numbers/` in local preview.

Build all four standalone sites:

```sh
node scripts/build-project-sites.mjs
```

| Domain | Output directory |
| --- | --- |
| detkit.menzo.dev | dist-projects/detkit |
| threatintel.menzo.dev | dist-projects/threatintel |
| logibar.menzo.dev | dist-projects/logibar |
| numbers.menzo.dev | dist-projects/numbers |

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
| detkit.menzo.dev | canmenzo/detkit | push to `main`, manual |
| threatintel.menzo.dev | canmenzo/ThreatIntelSearch | manual |
| logibar.menzo.dev | canmenzo/logibar | manual |
| numbers.menzo.dev | canmenzo/numbers | manual |

Changes here do not redeploy the subdomains. After editing a project page, shared CSS, fonts, or the build script, run:

```sh
for r in detkit ThreatIntelSearch logibar numbers; do gh workflow run pages.yml -R canmenzo/$r; done
```

Cloudflare DNS has a proxied `CNAME <name> -> canmenzo.github.io` per subdomain; each repository's Pages custom domain selects the site. Every record, apex included, is proxied and Cloudflare terminates HTTPS (SSL mode Full), because `.dev` is HSTS-preloaded and a site whose GitHub certificate is late does not load at all. Because those repositories are project sites of `canmenzo.github.io`, `menzo.dev/numbers/` and `menzo.dev/detkit/` redirect to their subdomains.

## Old domain

The site moved from canmenzo.com on 2026-10-19. A single redirect rule on the canmenzo.com zone sends `canmenzo.com`, `www` and every subdomain to the same host and path on menzo.dev with a 301. canmenzo.com expires 2026-11-15 and is not renewed, so the redirect stops then.

## Project images

Martek Marble, Moviepickr, Cheff.fit, the numbers solver, and menzo.dev use screenshots of their actual pages. Detkit uses its dashboard and coverage chart; ThreatIntelSearch, Logibar, Handy, and JobScope use screenshots from their public repositories. The remaining tools and private projects use text cards, without generated logos or simulated interfaces.

Jarvis uses the Iron Man helmet image supplied by the owner, optimized as WebP for the project card.

## blogspot.menzo.dev

`/blogspot/` is the 2006 Blogger page, kept as an unlinked easter egg and left out of the sitemap. The posts and photos are AES-256-GCM ciphertext (PBKDF2-SHA256, 600k iterations) inside `blogspot/index.html`; the photos themselves are never committed. To change the password or rebuild:

```sh
BLOGSPOT_PASSWORD='...' node scripts/encrypt-blogspot.mjs <folder with Image(374).jpg, Image(375).jpg, DSC00091.0.jpg>
```

The page is self-contained. To give it its own subdomain, host it the same way as the project subdomains: a `canmenzo/blogspot` repository whose `pages.yml` checks out this repository and publishes `blogspot/`, its Pages custom domain set to `blogspot.menzo.dev`, and a proxied `CNAME blogspot -> canmenzo.github.io`. Until then it is live at `menzo.dev/blogspot/`.
