# Projects experience improvement plan

## Audience and direction

Visitors are evaluating menzo's security work and practical software. The archive's job is to help them find relevant work; a project page should explain the tool, show real evidence, and make the next action clear.

Keep the established DM Mono typography, charcoal `#191a1b`, surface `#202324`, green `#6fcf6f`, text `#f1f1f1`, and secondary `#b0b6b1` tokens, with the existing light theme. Use the existing 400/500 weights, 12/14/16/18/24/36/48px type steps, and 8/12/16/24/32/48/64px spacing. The signature is the work itself: intact product previews with useful category and destination labels. Avoid decorative marketing sections, invented proof, new dependencies, or a site-wide rebrand.

## Findings and implementation

1. **High: archive hierarchy and discovery.** The 820px shell leaves screenshots too small, and there is no introduction, result count, or clear recovery from combined filters. Widen the project archive, align heading and content, add concise context and project metadata, improve readable type and filter hit areas, and announce result counts. Make empty results easy to reset. Preserve all 21 parent cards and Real Estate AI Ops under Project X. Link the three hosted project notes directly to their on-site pages so navigation works without JavaScript and on preview hosts.
2. **High: project detail pages.** Detkit, ThreatIntelSearch, and Logibar currently have large undifferentiated screenshots and long vertical text sections. Add a consistent path back, concise tool/platform context, section navigation, clearer action labels, useful feature grouping, and readable full-size image links. Keep installation commands, privacy explanations, version distinctions, and evidence limits accurate. Preserve the existing real UI assets.
3. **Medium: image delivery and thumbnails.** Audit dimensions and weight; optimize the large original PNG previews to WebP where useful without changing content or cropping. Keep the five original previews restored in earlier work, retain all source files, and make framing, intrinsic dimensions, loading priorities, captions, and dark/light outlines consistent. Record asset choices and size savings.
4. **Medium: Detkit dashboard continuity.** Inspect both nested dashboard pages for mobile overflow, keyboard access, current-page indicators, and navigation back to Detkit. Preserve authored versus third-party attribution and generated scientific content.
5. **High: integration and verification.** Build all four standalone project sites. Check archive search, category combinations, reset, keyboard focus, no-JavaScript navigation, light/dark themes, reduced motion, image loading, anchors, and desktop/mobile overflow. Review rendered screenshots of the archive, all three detail pages, and both dashboard pages. Confirm the homepage and Numbers page are not regressed by shared styles.

## Delegation

- GPT-6.1 Sol, high effort: archive markup, archive-specific CSS, and filtering behavior.
- GPT-6.1 Sol, high effort: Detkit, ThreatIntelSearch, and Logibar detail pages plus their shared stylesheet.
- GPT-6.1 Sol, medium effort: source-image audit and optimized assets, plus independent verification recommendations.
- Coordinator: nested dashboard polish, build integration, browser verification, final review, commit, and PR from the existing work branch.

## Acceptance evidence

Keep automated behavioral/rendering checks and screenshots outside the published site. Record the exact checks and observed results below after integration. The PR must contain the implementation and verification results; do not merge or deploy it.

## Verification results

Completed 2026-10-20:

- Two GPT-6.1 Sol high-effort workers implemented the archive and detail pages; one medium-effort worker audited images and independently reviewed integration. The coordinator fixed the two dashboard review findings: persistent search labelling and first-tap tooltip behavior.
- `node scripts/build-project-sites.mjs` builds Detkit, ThreatIntelSearch, Logibar, and Numbers successfully. Each output was served separately and checked for working assets, local links, section targets, and retained PNG social previews. Both nested Detkit pages return to the standalone root correctly.
- The temporary Playwright verification script (`%TEMP%/menzo-projects-qa/verify.cjs`) passed 73 checks. Its 64 rendering combinations cover eight pages (archive, three detail pages, both dashboard pages, homepage, Numbers) at 360, 390, 768, and 1440px in both themes with reduced motion. All images decoded and no page overflow or JavaScript exceptions occurred.
- Behavioral checks cover all category counts (4 security, 5 automation, 4 systems, 8 apps), trimmed/case-insensitive search, combined filters, empty recovery, both reset buttons, keyboard focus, the nested Real Estate project, and direct archive-to-Detkit-to-dashboard navigation. JavaScript-disabled archive and detail navigation also passed.
- Dashboard checks cover tactic/search combinations, announced counts, reset/focus, tooltip association, Escape dismissal, and light-theme readability. A separate touch check (`visual-final.cjs`) confirms the first tap keeps the explanation open, an outside tap closes it, and the theme toggle works.
- Detail section headings remain below the sticky header after native anchor navigation. Full-resolution image links resolve. Rendered screenshots of all six affected pages were inspected on mobile and desktop; archive light/dark and empty states were also inspected. Artifacts and JSON results remain in `%TEMP%/menzo-projects-qa/` and `%TEMP%/project-detail-checks/`, outside the published site.
- All 21 parent cards and the original preview choices remain. Four new lossless WebPs save 208,970 bytes (49.3%) against their PNG sources; decoded RGBA equality passed for every image. See [the image audit](project-image-audit.md) for source paths, dimensions, and byte counts.
- `node --check js/projects.js` and `git diff --check` passed. No dependencies, production deployment, or changes to the homepage/Numbers source were needed.
