# Downloader UI

A React single-page application for submitting video download jobs to a separate
backend service. The UI collects a source URL, page count, and parent directory;
the backend implementation is not part of this repository.

## Tech stack

- React 19 and TypeScript 5 (strict mode)
- Vite 7 with the React plugin
- React Router for client-side routing
- React Hook Form and Zod for form state and validation
- Tailwind CSS 4 and shadcn-style UI primitives, with Radix UI
- Axios for HTTP requests and Lucide icons
- Nginx and Docker for static production hosting

## Getting started

Requirements: Node.js and npm.

```bash
npm ci
VITE_API_URL=http://localhost:5000 npm run dev
```

Vite starts on port `3000`. Set `VITE_API_URL` to the backend's origin when
developing against a backend on another host or port. The backend must allow
requests from the UI's origin if they are cross-origin. `VITE_API_URL` is bundled
into browser code; do not put secrets in it.

If `VITE_API_URL` is omitted, Axios sends requests to the same origin. In
production, Nginx is configured to proxy the `/download` path to the backend.
Vite's development server has no `/download` proxy configured, so local
development generally needs the backend origin in `VITE_API_URL`.

## Form and API

The only page is `/`. It submits a JSON request to `POST {VITE_API_URL}/download`
(or same-origin `/download` when no base URL is configured):

```json
{
  "url": "https://example.com/collection",
  "number_of_pages": 1,
  "parent_directory": "/downloads"
}
```

Validation rules:

- `url` must be a valid URL.
- `number_of_pages` is converted to a number and must be a positive integer.
- `parent_directory` is a string; the UI schema does not restrict its format.

The frontend does not define or depend on a response-body schema. Any successful
HTTP response resets the form and displays a submission confirmation. Request
failures are currently logged to the browser console.

## Project layout

- `src/main.tsx` — React entry point and router.
- `src/pages/form_page.tsx` — download form and page layout.
- `src/pages/alert_page.tsx` — success alert.
- `src/hooks/downloader_hook.ts` — request and submission state.
- `src/schemas/formSchema.ts` — form validation and request type.
- `src/api/axiosInstance.ts` — Axios client and API base URL.
- `src/components/ui/` — reusable UI primitives.
- `src/index.css` — Tailwind imports and theme variables.

The `@/` import alias points to `src/`.

## Scripts

```bash
npm run dev      # Start the Vite development server (port 3000)
npm run build    # Type-check and create the production bundle in dist/
npm run lint     # Run ESLint
npm run preview  # Serve the production bundle locally
```

There are currently no automated test files in the repository.

## Docker and deployment

The `dockerfile` builds the static app and serves it with Nginx on port `8086`.
`nginx.conf` serves the SPA and proxies `/download` to
`http://downloader:5000`. The backend must be reachable under the hostname
`downloader` on the container's Docker network.

`docker-compose.yaml` defines only the UI service, so it does not start the
backend. It supplies `PREFIX_API_URL` at container runtime, while the Axios client
reads `VITE_API_URL` during the Vite build. The startup script
(`src/env/env.sh`) performs prefixed substitution in built assets; verify that
the chosen build/runtime configuration provides the value the bundle needs when
changing deployment settings.

The Jenkins pipeline builds the Docker image and pushes versioned and `prod`
tags to the configured registry.
