today i shipped a release of pargus, my desktop app. right after, github flagged a high-severity dependabot alert: `braces` <= 3.0.3, `CVE-2026-93687` (`GHSA-vfj7-8cjw-p6xm`), stack exhaustion through deeply nested patterns, `CWE-674`. patched version: none.

i asked my agent "is there no patch yet? has it been 4 days?" it had been about five weeks. the advisory was published on september 18. `braces` has not had a release since 3.0.3 in may 2024.

### the fix that took minutes
first question: why do i even have `braces`. it only came in through next's eslint plugin, which pulls `fast-glob`, which pulls `micromatch`, which pulls `braces`. dev-only. the plugin uses fast-glob for exactly one call: `globSync(pattern, { onlyDirectories: true })`.

one pnpm override swapped `fast-glob` for `tinyglobby` there. `braces` left the tree. lint output was identical before and after.

that should have been the end of it. but i wondered if i could write the actual patch, with a few agents in parallel. before starting, my agent looked at what was already upstream.

### the wall
issue #70 on micromatch/braces was opened on september 17. most of it is "any updates?", "+1" and "++++++". then on october 5 the maintainer, jonschlinkert, replied:

> Was this created by AI? This is complete nonsense.

his argument: "To hit a nesting depth of 5,000 would require at least 10,001 characters. Setting `maxLength` to a value less than that is all that's needed, and is already supported." and more broadly, "you should not let users define regular expressions", for the same reason you don't let users pass raw sql over http. he also asked people to "stop playing whack-a-mole with the unsolved generalized star height problem", and closed with "The CVE is functionally equivalent to saying `while (true)` is a javascript vulnerability. It's not."

then i looked at the pull requests. #72 to #89. twelve fix prs in about two weeks, most of them reading like ai output, nearly identical: "bound nesting depth", "add maxDepth". seven closed, five still open, none merged.

mine would have been number 13. my agent was ready to write it. i would have been one more person handing a patch nobody asked for to a maintainer who had already called it nonsense. that is the open-source cost of ai: writing a fix is free now, and reading twelve of them is not.

so i changed the question. not "how do i patch this" but "who is right". verify, don't patch.

### measuring it
i had a single fable 5.1 subagent, on medium effort, build a measurement repo: pin `braces` 3.0.3, `micromatch` 4.0.8 and `fast-glob` 3.3.1, then drive every entry point with growing nesting in three shapes:

- comma: `{a,{a,{a,...}}}`, about 4 characters per level. this is the maintainer's math.
- brace: `{{{...a...}}}`, 2 characters per level.
- range: `{1..2,{1..2,...}}`, about 7 per level.

two facts matter. the default `maxLength` is 10000 (lowered from 65536 in upstream pr #40, may 2024), and `maxLength` can only lower the cap, never raise it. also, `parse` is iterative and never overflows. the recursion lives in `expand` and `compile`.

it wrote the scripts, ran them on my mac mini and wrote up the results in about fifteen minutes. one agent, medium effort. frontier models are that good now.

### the agent measured the wrong thing
the first report said the maintainer was mostly right. at the cap, the brace shape sat "at the knife edge": it crashed at depth 4700 but not at 4900 or 4999. "a coin toss". the same report claimed a 256 kb stack was about a worker thread's default. that part was just wrong. node's docs say 4 mb.

i reviewed it and had it re-run differently: one fresh node process per call. crash 5 out of 5 at 8001 characters. every time.

the coin toss was the jit. the agent measured everything inside one long-running process. after warm-up, v8 optimizes the code, each recursion frame gets smaller, and it goes deeper before running out of stack. a real server is not warmed up on nested braces first. it meets the malicious request cold.

this is the same thing i wrote about [last time](/writings/#/vibecoded). ai checks the shape of a thing, not the amount. here it did run the benchmark. it just ran it under conditions that don't match the case that matters. the number was real. the setup was wrong.

### the numbers
node v26.8.1, mac mini arm64, default stack, default options, fresh process:

- `braces()` crashes from about 7000 characters. it crashed at 7001 in 2 of 3 runs, every run from 7201, never at 6801.
- `braces.expand()` crashes from 7965.
- both are well under the 10000 default cap.
- comma and range shapes stay safe. the cap stops them at depth 2500 and 1429 first. the maintainer's math is correct for the shape he assumed.
- `micromatch` never stack-overflows. it has its own 65536 guard, and v8 throws "regex too large" first.
- a real `fast-glob` glob call errors out early and harmlessly.

the overflow is a catchable `RangeError`. no data exposure, no code execution. it is a denial of service, and only if untrusted input reaches a glob api. a safe `maxLength` on that machine is about 6800, and 4096 is verified safe. everything is in [the repo](https://github.com/canmenzo/cve-2026-93687-braces).

### who was right
both, partly.

the reporter is right that the recursion really is unbounded and reachable at the default.

the maintainer is right about the root cause: don't hand untrusted globs to a glob library. he is right about the lever too: a lower `maxLength`. he is wrong that the default already covers it, because his 10,001 math assumes the comma shape, and the brace shape gets there in half the characters per level.

and none of the twelve prs was needed to fix pargus. deleting the dependency was.

### lessons learned
the cheapest fix is often removing a dependency you barely use. one directory lookup did not need a whole glob stack.

check the conditions of a measurement, not just the number. warm vs cold turned "a coin toss" into "every time".

read the thread before you write the fix. if a dozen prs are already sitting there, yours is not the missing piece. a measurement might be.

i used ai for all of this too. the point is not to stop. it is to review what it hands you.

write down what you decided. mine: `braces` is out of pargus, i am not opening pr number 13, and the numbers are in a repo instead of a "+1".
