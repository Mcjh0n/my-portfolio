# John Mark Fuentes — Portfolio

A personal portfolio made with plain HTML, CSS, and JavaScript. It does not need a framework or package installation to preview.

## Preview in VS Code

1. Open this project folder in VS Code.
2. Open the root `index.html` file.
3. Click **Go Live** in the lower-right status bar (with the Live Server extension installed).
4. View the page in the browser tab that opens.

The portfolio files are `index.html`, `styles.css`, `script.js`, and the `images` folder.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then choose branch `main` and folder `/(root)`, and save. GitHub will serve the root `index.html` file. The site is available at `https://mcjh0n.github.io/my-portfolio/` after publishing finishes.

## Content to add later

- Project cards and previews
- Tools and technologies
- Social profile URLs
- Free resources

The contact verification and visit counter need the separate Cloudflare Worker and Resend setup described in [worker/README.md](worker/README.md). Until the API URL is added to the `data-api-base` attribute in `index.html`, the form will explain that verification is not connected and the visitor count will show setup pending.
