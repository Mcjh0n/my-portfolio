# John Mark Fuentes — Portfolio

A responsive personal portfolio built with plain HTML, CSS, and JavaScript. It uses a separate page for each section and needs no package installation or build step for local preview.

## Features

- Home page with a toolkit strip and portfolio highlights
- Separate pages for projects, services, tools, free resources, about, and contact
- Responsive layout, dark theme, and accessibility settings
- Optional Cloudflare Worker API for a visit counter and verified contact form

## Project structure

```text
.
├── index.html                 # Home page (GitHub Pages entry point)
├── pages/                     # Projects, services, tools, resources, about, contact
├── assets/
│   ├── css/styles.css          # Shared styles and responsive layouts
│   ├── js/script.js            # Shared interactions and preferences
│   └── images/                 # Profile image and other site imagery
└── worker/                     # Optional Cloudflare Worker API
```

## Run locally

Open the project folder in VS Code, open `index.html`, and select **Go Live** if the Live Server extension is installed. You can also serve the folder with any local static file server.

## Publish with GitHub Pages

In the repository settings, open **Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save. The root `index.html` is the site entry point.

The repository's documented public URL is <https://mcjh0n.github.io/my-portfolio/>.

## Optional Worker features

The contact verification flow and shared visit counter require the Cloudflare Worker, a KV namespace, and Resend configuration. Setup steps and required variables are documented in [`worker/README.md`](worker/README.md). Keep the Resend API key in Worker secrets; it must not be added to public site code.

Until the Worker URL is configured in `assets/js/script.js`, the visit counter shows that setup is pending and the contact form directs visitors to the email fallback.

## Content status

The projects, services, tools, and free resources pages currently contain placeholder content. Update the relevant files in `pages/` as those sections are ready to publish.
