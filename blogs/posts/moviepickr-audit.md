I made a small site called [moviepickr](https://moviepickr.site). It fixes the fight that
happens every movie night. Everyone opens it on their phone, you all swipe through the same
films, and when one film gets a yes from everybody, that is what you are watching. No signup,
no app to install.

It was finished and running. The next step was posting the link somewhere people would click
it, and making the code public on GitHub.

I stopped before doing either.

I work in a SOC. My whole job is looking at what software does when somebody pokes it. It felt
wrong to skip that on my own thing just because I was excited to share it. So I sat down and
went through it properly, the same way I would go through anything else.

Here is what I found, in the order I found it.

## First I asked what I could actually lose

Every review starts here, and it is easy to get it wrong.

My first thought was that there is nothing to steal. That is true. There are no accounts, no
passwords, no database. Nobody's personal data sits anywhere. If someone broke in completely,
there is no table full of emails to walk away with.

But "nothing to steal" and "nothing to lose" are not the same sentence, and mixing them up is
how people end up with a surprise bill.

I have three things that can be taken from me:

The film data comes from an API called TMDB. I have a free key with a request limit. Burn
through it and the site stops working for everyone.

The site runs on Vercel, where you pay per request. There is no ceiling by default.

And there is the game itself. Somebody who can push messages into a room can ruin the night
without stealing a single byte.

Once I wrote that down, everything else I found came out of it.

## The endpoint anyone could put in a loop

The part of my code that hands out films makes several requests to TMDB every time it runs.
Nothing was stopping anyone from calling it over and over.

You do not need a hacker for this. `curl` in a while loop, ten seconds of typing, and my API
key is done for the day.

So I added a rate limit, which just means a ceiling on how many times the same visitor can
call something in a given period. Mine is 60 requests per minute per IP address. A room full
of people on the same wifi does not come close to that, and a loop hits it immediately.

I want to be honest about what this does not do. The site runs serverless, meaning my code
does not sit on one machine but gets spun up fresh whenever a request arrives. My counter
lives in memory on whichever machine answered, so somebody spread across many connections can
get around it. Doing it properly needs shared storage, which means a database, which is the
one thing this app is built to not have.

It stops one person with one loop. That is the realistic case for a hobby project, so I took
it and moved on.

The real answer for the bigger version of that problem is not in my code at all. It is a
firewall rule at the edge plus a spending limit on the account, both of which are settings, not
programming.

## The bit that made me put my coffee down

This is the finding I am actually proud of, because the feature is good and the problem was
sitting right next to it the whole time.

moviepickr can build your deck out of Letterboxd watchlists. Everyone types their username,
and my server goes and reads those public watchlists and turns them into cards.

I had already checked the obvious thing. The username goes through a filter that only allows
letters, numbers and underscore, so you cannot sneak a different address in there and make my
server go somewhere it should not. That class of bug is called SSRF, server side request
forgery, where you trick a server into fetching something on your behalf. That door was
closed.

What I never asked was how many usernames someone could send.

The answer was as many as they liked. The names are separated by commas and my code read all
of them. Each name costs up to four page reads. So one request to my site with a hundred names
in it becomes four hundred requests to Letterboxd, sent from my server, from my IP address,
followed by a pile of TMDB lookups on my key.

Nobody is breaking into anything there. It is worse in a boring way. My app becomes the tool
somebody else uses, and when Letterboxd gets annoyed, it is my address that gets blocked.

The fix took one line. A room is a few people in a living room, so it now takes the first
eight names and ignores the rest.

What stuck with me is that every single input was valid. I checked the shape of each name and
never thought about the count. Validation is not only about dangerous characters.

## The headers I never set

By default my site was sending nothing to protect itself, so I added the standard set.

`X-Frame-Options: DENY` stops anyone loading my site inside a frame on their own page and
dressing it up as something else.

`Referrer-Policy` controls how much of my address gets passed along when you click a link out.
Without it, the room code sitting in the URL was travelling to Netflix and Amazon with every
click.

A permissions policy turns off camera, microphone and location, none of which this site has
any reason to ask for.

Ten minutes of work. Invisible until it is not.

## CSP, and why I turned it on switched off

This one is worth explaining slowly, because it is the header people get wrong and it is the
one that closes a real hole in my app.

CSP stands for Content Security Policy, and it is basically a guest list you hand the browser.
Images may only come from TMDB. Video frames only from YouTube. Live connections only to my
Supabase project. Anything not on the list simply does not load.

Why I needed it comes from how rooms work. There is no login, on purpose, because a thing you
use for ten minutes on a Friday should not ask you to make an account. So anyone with the room
code can join, and anyone in the room can send messages. One of those messages carries the
deck of films, and each film carries a link to its poster, which every phone in the room then
loads.

Which means a person in your room could send a "poster" hosted on their own server, and
collect the IP address of everyone at your movie night. Not the end of the world. Not nothing.

With a CSP in place, the poster comes from TMDB or it does not appear at all.

Now the part I think is the actual lesson: I put the policy live in report only mode first.

A wrong CSP does not fail gently. Forget one address and that thing just stops working, with
no error on the screen. Miss the connection to Supabase and rooms quietly die. Miss YouTube
and every trailer goes black. You would find out from the first person who tried it, which in
my case would have been whoever clicked the link I posted.

Report only tells the browser to block nothing and log everything it would have blocked. Real
visitors, real traffic, zero risk, and a list of exactly what you got wrong.

So I walked the site with the console open. Opened a room, swiped, played a trailer, turned
the sound on, got to the match screen. Then I searched the console for "Content Security" and
got nothing back.

The console was not empty, mind you. It was full of red. All of it was uBlock Origin cutting
YouTube's tracking requests, which it does on every site, plus a Chrome warning about graphics
settings. That is worth knowing before you try this: your own extensions will make a mess of
the console, and you have to be able to tell their noise apart from your policy's.

Nothing from the policy. So I switched it to enforcing, and now it is a rule instead of a
suggestion.

One thing I added on the way in. The speed monitoring on the site sends its data as the page
closes, which is late enough that my walk through the site probably never triggered it. It
would have been blocked, silently, and I would have wondered in a week why the numbers were
empty. Easy thing to miss.

## The risk I decided to keep

Room codes are four characters. That is 923,521 combinations, and nothing stops someone
guessing until they land in a live room and start trolling.

I looked at it and left it, and I think writing down why matters more than the decision.

There is nothing behind that door. No account to take over, no data, nothing that survives the
night. The cost of a lucky guess is one ruined movie night. The cost of fixing it properly is
a login system, which means accounts and a database, which turns the app into a heavier thing
than it is meant to be.

If it ever bothers me, six characters instead of four takes it to 887 million, and nobody
types the code anyway because you join by scanning a QR.

An accepted risk you wrote down is a decision. The same risk you never noticed is just a hole.

## Not every CVE is your CVE

Running `pnpm audit` gave me five vulnerabilities, three marked high. It is very tempting to
treat that number as a score you drive to zero.

Four of them were in a tool that compiles my stylesheet during the build. It does not exist
while the site is running. The fifth was in an image library that this site never calls,
because it uses plain image tags instead of the framework's optimizer.

Every one of those advisories needs an attacker to feed in their own stylesheet. There is no
path in my app where anyone can do that.

I did try to upgrade them anyway. The framework pins its own copy and the override would not
take. At that point I was looking at breaking a working build so that a report would print a
nicer number.

I left it and wrote down why. The word for this is reachability: can an attacker actually get
to the vulnerable code. A high rating on something that never runs is noise, and the skill is
not patching everything, it is knowing what you skipped and being able to say why.

## What I would tell myself before the next one

Write down what you can lose before you look for bugs. It took me three lines and it pointed
at every real finding I had. Without it I would have spent the evening hunting for the kind of
bug this app cannot have.

Check the count, not just the value. The watchlist thing passed every check I had, because
each name was fine on its own.

If a control can break your site quietly, run it in listening mode first. CSP has that mode
built in for exactly this reason and I would not deploy one without it again.

And write down what you accepted. The room code is the weakest thing in this app. I know, on
purpose, with the alternative priced out. That is a very different position from not having
looked.

The code is public now. If you find something I missed, tell me.
