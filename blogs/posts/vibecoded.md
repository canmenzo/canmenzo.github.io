I did not write most of my own code. I work in a SOC, I read software for a living, but the
apps on my GitHub were built with an AI doing the typing. So before I started sharing them
around, I audited seven of them properly. Secret sweeps across every repo and its git history,
then a real read of the code in the ones that touch money, keys or other people.

I expected to find the usual disasters. I did not.

No SQL injection. No secrets committed. Escaping was in place. Auth was checked on the server,
not just hidden in the UI. My meal app has row level security on every table, and the paid
tier is pinned by a database trigger so you cannot promote yourself from the browser console.
That is better than plenty of production code I have seen at work.

The problems were somewhere else, and they were the same problems in every project.

## It writes safe lines. It does not count.

My movie app takes Letterboxd usernames and scrapes the watchlists. The username goes through
a strict filter, so you cannot make my server fetch something it should not. Textbook. But
nobody ever asked **how many** usernames you could send. Comma separated, no limit. One request
with a hundred names became four hundred requests to Letterboxd, from my server, from my IP.

Same app, same shape of bug: the endpoint that deals films calls a paid API and nothing capped
how often you could call it. Ten seconds with curl and my quota is gone for the day.

Every single input was valid. That is the point. AI validates the *shape* of a thing and never
the *amount* of it. Look at your own projects for the missing number: requests per minute, items
per request, bytes per upload, retries per failure. It is always missing.

## Nothing to steal is not nothing to lose

The other blind spot is that AI reasons about data theft, and hobby projects usually have no
data worth stealing. So everything looks fine.

But serverless bills per request, APIs meter per call, and scrapers get *your* address blocked,
not the attacker's. The damage is your bill and your reputation with a third party. Ask what an
attacker can *spend*, not only what they can take.

## What I would actually do

Ask for the limit explicitly. AI will write it correctly if you ask; it just never volunteers.

Write down what you decided not to fix. This is your risk appetite. An accepted risk you wrote down is a decision. The same risk you never noticed is a vulnerability.
