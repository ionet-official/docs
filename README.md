# io

## Run locally

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use --lts && mintlify dev
```

## “On this page” track bar (why it’s not out of the box)

Mintlify shows the right-hand table of contents and highlights the active section, but the **mint** theme (and the open-source CLI build) doesn’t include the **track bar**—the vertical rail with a moving thumb that animates to the current section. That behavior is common on some themes or on Mintlify’s hosted product; it’s not in the default mint theme you get with `mintlify dev`.

This repo adds it via:

- **CSS** (`styles.css`): track rail + thumb styles and active-section left border.
- **JS** (`scripts/toc-track.js`): wraps the TOC in a track, adds a thumb, and moves it to the active item with a short animation.

Mintlify (Growth plan) can load custom script files from your repo. After you push, the script should be picked up in production. For **local dev**, if the track bar doesn’t appear, load it once from the browser console on any doc page:

```js
var s = document.createElement('script'); s.src = '/scripts/toc-track.js'; document.body.appendChild(s);
```

If that path 404s, the CLI isn’t serving repo files; the moving thumb will still work when deployed to Mintlify. The active-section left border (CSS) works either way.