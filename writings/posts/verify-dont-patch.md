today i shipped a release of my desktop app, pargus. a few minutes later dependabot flagged a high-severity alert on an npm package called braces: CVE-2026-93687 (GHSA-vfj7-8cjw-p6xm), "stack exhaustion through deeply nested patterns". patched version: none.

braces is a small library that expands patterns like `{a,b,c}` into lists. you have probably never installed it on purpose, but it sits under micromatch, which sits under fast-glob, which sits under a huge chunk of the javascript ecosystem.

i asked my agent when a patch was coming, assuming the advisory was a few days old. it was published september 18, five weeks earlier. braces hasn't had a release since 3.0.3 in may 2024.

### the fix that took minutes

braces wasn't mine. it came in through next.js's lint setup:

`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`

the plugin only uses fast-glob for one folder lookup. tinyglobby does the same job without braces, so one pnpm override swapped it in. braces and micromatch left the lockfile, lint output didn't change, and github closed the alert.

that should have been the end of it.

### the issue

i wondered if i could write the real fix and send it upstream. before starting, i read the issue on micromatch/braces, #70: "Security Advisory: Uncontrolled Recursion Depth in Tree Walkers Leads to Stack-Overflow DoS", opened september 17.

most of the thread is people asking "Any updates?", "+1", "++++++".

then on october 5, jon schlinkert (jonschlinkert), who maintains braces and micromatch, replied:

> "Was this created by AI? This is complete nonsense."

his reasons, in his words:

> "To hit a nesting depth of 5,000 would require at least 10,001 characters. Setting `maxLength` to a value less than that is all that's needed, and is already supported."

> "For the same reason that you should not allow users to pass raw sql over http requests, you should not let users define regular expressions. If you are not letting users define regular expressions, then this CVE describes how you would attack yourself."

> "The `maxDepth` option might be a useful addition, but it will not solve this problem."

he explained that glob patterns are regular expressions, and no glob library can predict how much work the regex engine will do on a nasty enough pattern. then:

> "Please stop playing whack-a-mole with the unsolved generalized star height problem."

> "the researchers will pivot to some other contrived nonsense pattern no one would ever actually use, and if you're allowing users to pass globs, you have bigger issues."

> "The CVE is functionally equivalent to saying `while (true)` is a javascript vulnerability. It's not."

### the prs

then i opened the pull requests. #72 through #89, twelve fixes in about two weeks. a few titles:

- #89 "fix: prevent stack-exhaustion DoS from deeply nested brace patterns (CVE-2026-93687)"
- #87 "fix: prevent stack exhaustion from deeply nested brace patterns"
- #86 "fix: add maxDepth to stop deeply nested patterns overflowing the stack (CVE-2026-93687)"
- #79 "fix: stop deeply nested patterns from overflowing the stack"

most of them reading like ai output, nearly all the same idea, the exact maxDepth he had just said wouldn't solve it. none merged.

my agent was ready to write number thirteen. so i didn't send a patch. i checked who was right.

### the test

i ran this with claude. one fable 5.1 subagent on medium effort, not a swarm, not max effort, built [a small repo](https://github.com/canmenzo/cve-2026-93687-braces) pinning braces 3.0.3, micromatch 4.0.8 and fast-glob 3.3.1, then fed them deeper and deeper nesting until something broke. it wrote the scripts, ran them on my mac mini over ssh, wrote tests and a readme with the results, in about fifteen minutes. one agent, medium effort, a small security research project end to end. frontier models are that good now.

the maintainer's math is about the pattern shape. `{a,{a,{a,...}}}` costs about 4 characters per level, so depth 5,000 really does need over 10,000 characters, and braces rejects anything over 10,000 by default. but `{{{...a...}}}` costs 2 characters per level. same depth, half the length.

its first report agreed with the maintainer: the crash only happened sometimes, right at the edge of the limit. my main session on opus 5.5 didn't buy it on review, reran a few tests itself in fresh node processes, and the crash showed up every time. so the subagent redid the whole run that way.

the first run had measured in a process that was already warmed up. node optimizes code it runs often, which lets the recursion go deeper before running out of stack. a server meets a malicious request cold.

### the result

in a fresh process, with default settings, a plain string of about 7,000 characters crashes braces, well under its own 10,000 limit. the `{a,{a,...}}` shape the maintainer had in mind stays safe. micromatch and a normal fast-glob search don't crash at all.

the crash is a catchable error. no data leaks, no code runs. it's a denial of service, and only if you pass untrusted input to a glob library. setting maxLength to 4096 fixes every case i tested.

### who was right

both, partly.

the reporter is right that the recursion is unbounded and reachable with default settings.

jon is right about the root cause and the fix: don't hand users' globs to a glob library, and lower maxLength if you have to. his 10,001 number just assumes one pattern shape.

and none of the twelve prs was needed to fix pargus. removing the dependency was.

### what i'm taking from it

removing a dependency you barely use is often the whole fix.

when a number looks off, check how it was measured. warm vs cold turned "sometimes" into "every time".

read the thread before you write the patch. a thirteenth fix doesn't help anyone. a measurement might.

i used ai for all of it. my part was checking what it handed me.

---

the test repo is public, with every script and number: [github.com/canmenzo/cve-2026-93687-braces](https://github.com/canmenzo/cve-2026-93687-braces). if it's useful to you, a star helps.

i also posted this on x. follow [@canmenzo](https://x.com/canmenzo) for the next one, and the rest of what i build is on [projects](/projects/).
