# blogs

Static blog at https://canmenzo.com/blogs/ - no database, no build step.

- `posts/index.json` - list of notes (metadata only, sorted at render time)
- `posts/<slug>.md` - the body of each note
- `index.html` - reader + editor in one file

## a note entry

Only `slug`, `title`, `date` and `updated` are always written. The rest are
dropped from `index.json` when empty:

| field     | what it does                                                        |
|-----------|---------------------------------------------------------------------|
| `slug`    | the url (`/blogs/#/<slug>`) and the `.md` filename                   |
| `summary` | the one-line summary under the title on the index                    |
| `folder`  | groups the note in the sidebar and the index; `a/b` nests            |
| `tags`    | clickable, filters the index at `/blogs/#tag/<tag>`                  |
| `pinned`  | floats the note to the top of its group                              |
| `draft`   | hidden from the index, the sidebar and direct urls unless unlocked   |
| `aliases` | old slugs kept alive after a rename; they redirect to the new one    |

Drafts are only hidden, not private - `posts/<slug>.md` is still a public file
on Pages for anyone who guesses the name. Don't put anything sensitive in one.

## editing

Visitors get a read-only page. Editing unlocks only in a browser holding a GitHub
token with write access to this repo:

1. GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens
2. Repository access: only `canmenzo/canmenzo.github.io`
3. Permissions > Repository permissions > Contents: **Read and write**
4. Open /blogs/, click `unlock`, paste the token

The token is kept in this browser's localStorage and sent only to api.github.com.
Publishing commits `posts/<slug>.md` and `posts/index.json` straight to `master`;
GitHub Pages redeploys within a minute.

Renaming a note in the `url` field writes the new `.md`, deletes the old one and
records the old slug in `aliases`, so links already out in the world keep working.

Shortcuts: `e` opens the editor on a note, ctrl/cmd+s publishes, `s` shows or
hides the summaries, `?` lists the rest.

Revoke the token at any time from GitHub settings; the page falls back to read-only.

## the editor commits from the browser

Because publishing pushes straight to `master`, a local checkout goes stale the
moment a note is saved from the site. Always `git pull --rebase` before editing
`index.html` here.
