# Project image audit

Audited 2026-10-20. Scope: delivery encoding only. Existing images were inspected with `view_image`; no new artwork, resizing, cropping, retouching, or screenshot replacement was performed. All original files remain. The 16 generated covers used by the archive remain unchanged.

## Lossless delivery assets

Paths below are relative to `/assets/projects/`. Width and height are intrinsic pixel dimensions and should also be supplied on the HTML image elements.

| Original source | Dimensions | Original bytes | Recommended delivery file | Delivery bytes | Saved |
| --- | --- | ---: | --- | ---: | ---: |
| `detkit-dashboard.png` | 1440 × 1080 | 131,928 | `detkit-dashboard.webp` | 60,774 | 71,154 / 53.9% |
| `detkit-coverage.png` | 1698 × 755 | 89,484 | `detkit-coverage.webp` | 36,184 | 53,300 / 59.6% |
| `threatintel-screenshot.png` | 1280 × 800 | 115,786 | `threatintel-screenshot.webp` | 77,264 | 38,522 / 33.3% |
| `logibar.png` | 1600 × 760 | 86,810 | `logibar.webp` | 40,816 | 45,994 / 53.0% |
| **Total** | | **424,008** | | **215,038** | **208,970 / 49.3%** |

Encoding used the existing Python/Pillow installation with WebP `lossless=True`, `method=6`, `exact=True`. Each encoded image was decoded again and its RGBA pixels compared byte-for-byte with the source. All four comparisons passed, including the coverage chart's alpha channel. No project dependencies were installed.

Use the delivery paths for displayed images and full-size screenshot links. Existing PNG social preview metadata may remain because it is separate from page-image delivery. Actual transfer savings require updating the corresponding HTML references.

## Preserved archive preview choices

These are the five real previews restored before this work. Retain their content and source choice; only ThreatIntelSearch and Logibar receive pixel-identical encodings.

| Project | Recommended HTML path | Width | Height | Bytes | Action |
| --- | --- | ---: | ---: | ---: | --- |
| ThreatIntelSearch | `/assets/projects/threatintel-screenshot.webp` | 1280 | 800 | 77,264 | New lossless encoding of the existing PNG |
| Logibar | `/assets/projects/logibar.webp` | 1600 | 760 | 40,816 | New lossless encoding of the existing PNG |
| Cheff.fit | `/assets/projects/cheff.webp` | 1166 | 879 | 44,734 | Keep existing asset |
| Moviepickr | `/assets/projects/moviepickr-homepage-v2.webp` | 1440 | 810 | 37,154 | Keep existing asset |
| Martek Marble | `/assets/projects/martek-homepage-v2.webp` | 1440 | 810 | 143,816 | Keep existing asset |

The five previews fall from 528,300 to 443,784 bytes, saving 84,516 bytes (16.0%). Cheff, Moviepickr, and Martek already have compact WebP delivery files; re-encoding these existing WebPs would add no source fidelity. Older assets such as `moviepickr.webp` and `martek.webp` are different captures and are not recommended replacements.

## Integration and verification recommendations

- Preserve the archive's `object-fit: contain` framing. The 16:9 frame needs letterboxing for Cheff, ThreatIntelSearch, and Logibar to keep the entire image visible. Do not crop away menus, tray icons, or text.
- Set intrinsic dimensions on all screenshot elements, especially the Detkit coverage chart, which lacked them when audited. Keep displayed dimensions responsive with automatic height.
- Keep first-viewport imagery eager; use lazy loading for images farther down the archive and coverage content. `decoding="async"` is appropriate for archive previews.
- Link detail-page screenshots to their full-resolution files. The 1698-pixel coverage diagram and context-menu text need this on narrow screens. Captions should explain authored versus vendored coverage and distinguish the Logibar release preview from a live app session.
- Check image outlines and letterbox backgrounds in both themes. The preserved previews contain dark artwork; keep their pixels intact while making image boundaries legible against the page.
- After integration, verify each new URL on every standalone build, check decoded natural dimensions, inspect mobile containment, and ensure all 21 archive cards still use their intended source. Source PNGs must remain available for metadata and provenance.

This audit verifies encoding and source preservation. Browser rendering, loading priorities, and standalone build inclusion require the integrated page checks recorded in the improvement plan.
