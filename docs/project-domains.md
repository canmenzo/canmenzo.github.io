# Project domains

The project cards target `detkit.canmenzo.com`, `threatintel.canmenzo.com`, `logibar.canmenzo.com`, and `numbers.canmenzo.com`. On localhost, the gallery uses the matching `/projects/<name>/` pages for review. The numbers solver uses `/numbers/` in local preview. The custom domains do not resolve yet; these changes do not deploy anything or modify DNS.

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

## Connect after review

After this PR is merged, create four Cloudflare Pages projects connected to `canmenzo/canmenzo.github.io`. For each project, use:

- Production branch: `master`
- Framework preset: None
- Build command: `node scripts/build-project-sites.mjs`
- Build output directory: the matching directory in the table above

In each Pages project's **Custom domains** tab, select **Set up a domain** and add its full subdomain (`detkit.canmenzo.com`, `threatintel.canmenzo.com`, `logibar.canmenzo.com`, or `numbers.canmenzo.com`).

The domain already uses Cloudflare DNS (`jobs.ns.cloudflare.com` and `piper.ns.cloudflare.com`, checked October 13, 2026). When the Pages projects and domain are in the same Cloudflare account, the custom-domain setup can create the matching CNAME records automatically. Each record points to the actual `*.pages.dev` hostname assigned to that Pages project. Complete Custom domains setup before adding a record manually; a CNAME alone does not register the hostname with Pages.

Keep the existing apex and `www` records for the main GitHub Pages site. The project subdomains are separate records, and Detkit's `/dashboard/` and `/dashboard/about.html` use the same Detkit host.

Setup reference: https://developers.cloudflare.com/pages/configuration/custom-domains/

The preview workflow builds and attaches `project-subdomain-sites`. It does not deploy or modify DNS.

## Project images

Martek Marble, Moviepickr, Cheff.fit, the numbers solver, and Canmenzo.com use screenshots of their actual pages. Detkit uses its dashboard and coverage chart; ThreatIntelSearch, Logibar, Handy, and JobScope use screenshots from their public repositories. The remaining tools and private projects use text cards, without generated logos or simulated interfaces.

Jarvis uses the Iron Man helmet image supplied by the owner, optimized as WebP for the project card.
