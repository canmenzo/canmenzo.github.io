# blogs

Static blog at https://canmenzo.com/blogs/ - no database, no build step.

- `posts/index.json` - list of notes (metadata only, newest sorted at render time)
- `posts/<slug>.md` - the body of each note
- `index.html` - reader + editor in one file

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

Shortcuts: `e` opens the editor on a note, ctrl/cmd+s publishes.

Revoke the token at any time from GitHub settings; the page falls back to read-only.
