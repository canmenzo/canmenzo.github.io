i don't code anymore. nobody does manually. at least, they shouldn't unless they are writing software that is mission critical, although it's still good at things like lexicographic optimization logic. at the end of the day, it's a machine that answers to zeros or ones.

i read malicious scripts for a living, but all the post-ai apps on my github were built with an ai doing all the coding. so before i started sharing them around, i audit them for security. secret sweeps across every repo and its git history, then a real read of the code in the ones that touch money, keys or other people.
i expected to find the usual disasters. i did not.

no sql injection. no secrets committed. escaping was in place. auth was checked on the server, not just hidden in the ui. my meal app has row-level security on every table, and the paid tier is pinned by a database trigger so you cannot promote yourself from the browser console. that is better than plenty of production code i have seen professionally.

the problems were somewhere else, and they were the same problems in every project.
it writes safe lines. it does not count. in my watchlistrr app, it takes letterboxd usernames and scrapes the watchlists. the username goes through a strict filter, so you cannot make my server fetch something it should not. textbook. but nobody ever asked how many usernames you could send. comma-separated, no limit. one request with a hundred names became four hundred requests to letterboxd, from my server, from my ip.
same app, same shape of bug: the endpoint that fetches films calls a paid api and nothing capped how often you could call it. ten seconds with curl and my quota is gone for the day.

every single input was valid. that is the point. ai validates the shape of a thing and never the amount of it. look at your own projects for the missing number: requests per minute, items per request, bytes per upload, retries per failure. it is always missing.

### nothing to steal is not nothing to lose
the other blind spot is that ai reasons about data theft, and hobby projects usually have no data worth stealing. so everything looks fine.
but serverless bills per request, apis meter per call, and scrapers get your address blocked, not the attacker's. the damage is your bill and your reputation with a third party. ask what an attacker can spend, not only what they can take.

### lessons learned
ask for the limit explicitly. ai will write it correctly if you ask; it just never volunteers to think about edge cases like these. these probably aren't the last ones you'll run into either.
write down what you decided not to fix. that is your risk appetite. an accepted risk you wrote down is a decision. the same risk you never noticed is a vulnerability.