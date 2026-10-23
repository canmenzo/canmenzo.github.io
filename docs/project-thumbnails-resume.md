# Thumbnail refresh — 2026-10-23

Applied 25 covers: eight Pargus-style product covers and 17 monochrome editorial illustrations. The approved Pargus cover remains unchanged. All 26 gallery cards use 1536 × 864 assets; nine product sharing exports use 1200 × 630 PNG. Cheff.fit uses “Meals, macros, and a plan.” Detkit uses the revised security-scanner scene.

Exact prompts, sources, styles, social assets and measured display sizes are recorded in `project-thumbnail-prompts.json`. Rebuild with `python scripts/build-project-thumbnails.py` on the Mac mini. Product link previews are updated in their owning sites.

The previous generation notes below are historical.

# Project thumbnails - completed 2026-10-13

Sixteen parent project cards use final 1536 x 864 WebP covers in
`assets/projects/thumbnails/`. ThreatIntelSearch, Logibar, and Cheff.fit use
their previous complete project images. Moviepickr and Martek Marble use fresh
1440 x 810 homepage captures taken after fonts and imagery loaded. All five
source previews fit the existing 16:9 card boxes without cropping; their
`gallery_asset` overrides are recorded in the prompt manifest.

Nine remaining images were generated with the
approved built-in generator. Eleven real-source covers preserve the original
UI/photo content through recorded crops and source overlays. Original assets
and generated PNG layers remain available.

`docs/project-thumbnail-prompts.json` records the exact prompts, generation
paths, final assets, insets, and source crop coordinates. Rebuild the final
WebP covers with `python scripts/build-project-thumbnails.py` (Pillow required).
Real Estate AI Ops remains nested under Project X.

The notes below record the earlier paused state and are historical.

Workspace: C:\Users\mehme\orca\workspaces\canmenzo.github.io\sealion
Branch at save: canmenzo/project-showcase

Use subagents for image generation. Use the built-in GPT Image 2 generator with the included plan allowance, no API key and no separate API billing. Do not switch to a lower model. If capacity is unavailable, stop and preserve progress.

The owner approved assets/projects/thumbnails/watchlistrr-test.png. Follow its charcoal #191a1b, green #6fcf6f, large white editorial serif headline, muted subtitle, small monospaced project name and green underline. Artwork must be specific to each project. Read exact prompts in docs/project-thumbnail-prompts.json and the three thumbnail-prompts-*.json worker files. The original GPT Image 2.5 request was replaced by approval of the built-in GPT Image 2 test.

## Saved progress

12 image files: seven complete artwork covers (including the approved test) and five background/typography layers. These are saved in assets/projects/thumbnails/.

Complete artwork: Watchlistrr, WSL Disk Bridge, PythonCS, Kanal, Project X, NAS Server, Buckshot Roulette MP.
Background layers: Detkit, ThreatIntelSearch, Logibar, JobScope, Moviepickr. These still need their true UI screenshots composed into the reserved areas; they are not finished thumbnails yet.

## Remaining work

Generate nine images: Cheff.fit, Handy, Martek Marble, Numbers Solver, canmenzo.com, Jarvis, Secret Santa, Python Brute Force, Turkish Voice.

For UI projects and Jarvis, generate the background/type layer only and preserve the actual screenshot/photo pixels in the final composition. Use composition coordinates and framing from the manifest. Do not invent or redraw UI text, metrics, controls, or the Jarvis face. Moviepickr headline green period reaches about 47% x; keep its inset start at least 48%. JobScope text ends around 41%, planned inset begins 42%; check spacing carefully. Detkit, ThreatIntelSearch and Logibar were inspected with clear insets. All current generations are 1672 x 941.

Then compose the UI thumbnails, optimize final assets, update all 21 parent cards in projects/index.html, and verify desktop/mobile layout and filtering. Real Estate AI Ops must remain nested under Project X. Watchlistrr's approved test is the final style reference and can be used as its final cover.

No new thumbnail has been connected to the gallery yet. Do not remove originals. No commits, pushes or deployments were made for generation. Keep all work local and open the test build for review.

## Other requested changes already implemented

Projects footer now contains only right-aligned social icons; old contact sentence, email text and divider are removed. Project subpages have social icons and centered attribution. Writings heading matches Projects position, its list starts in the same main column with 24px top padding, and there are no filters/search. Help/unlock remains bottom-left. Nav is centered consistently with hover/focus-only underline and dot separators.

Background preview servers: workspace at http://127.0.0.1:8765/, Detkit standalone at http://127.0.0.1:8788/, Numbers standalone at http://127.0.0.1:8789/. Verify listeners before restarting; run commands hidden in the background. Do not close agent terminals.
