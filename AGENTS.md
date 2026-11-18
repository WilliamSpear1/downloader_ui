# Project Context

This file is a quick orientation for future work in this repository. Treat it as a
map, not a substitute for checking the current implementation in the files relevant
to a change.

## What this project is

A single-page React frontend for submitting video download jobs. The frontend is
packaged as a static Vite build and can be served by Nginx in Docker. The downloader
backend is not implemented in this repository.

## Stack and conventions

- React 19, TypeScript (strict mode), Vite, and React Router.
- Tailwind CSS v4 with shadcn-style UI primitives; `src/index.css` defines the
  theme variables.
- Forms use React Hook Form and Zod. Use the `@/*` alias for imports from `src/*`.
- `src/lib/utils.ts` exports `cn()` for combining and merging Tailwind classes.
- Follow the existing TypeScript formatting and component patterns. Keep changes
  focused and preserve the accessible field labels and validation feedback.

## Development Notes

- Prefer the smallest clear change that fully addresses the request; avoid
  unnecessary abstractions, dependencies, and unrelated cleanup.
- Keep explanations and final responses concise. State what changed and only the
  relevant validation results.
- Inspect the relevant implementation before editing, and run the narrowest
  applicable validation command.

## Main flow and files

- `src/main.tsx` mounts the app and defines the browser router. The only route is
  `/`, which renders the download form.
- `src/pages/form_page.tsx` renders the form, default values, reset/submit buttons,
  loading overlay, and success alert.
- `src/schemas/formSchema.ts` validates the URL, positive integer page count, and
  parent directory. Its `Schema` type is the request form type.
- `src/hooks/downloader_hook.ts` handles submission, loading state, and the timed
  success message. On success it resets the form; request failures are currently
  written to the console.
- `src/api/axiosInstance.ts` creates the shared Axios client.
- `src/pages/alert_page.tsx` contains the submission-success alert.
- `src/components/ui/` contains reusable UI primitives (button, field, input,
  alert, spinner, label, separator, and textarea).
- `src/types/spinner_props.ts` contains the spinner prop type.

The form submits `url`, `number_of_pages`, and `parent_directory` as JSON with
`POST /download`.

## Development and validation

- `npm run dev` starts Vite on port 3000 (`strictPort` is enabled).
- `npm run build` runs the TypeScript project build and creates the production
  bundle in `dist/`.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production bundle locally.
- `package-lock.json` is present; use `npm ci` for a clean dependency install.
- No automated test files were present during the initial inventory.

## Container and deployment

- `dockerfile` builds the Vite app, then copies `dist/` into an Nginx image.
- `nginx.conf` serves the SPA on port 8086 and proxies `/download` to
  `http://downloader:5000`.
- `docker-compose.yaml` defines only the UI service; the `downloader` backend must
  be reachable separately (for example, on a shared Docker network).
- `src/env/env.sh` is intended to substitute prefixed environment variables into
  built assets at container startup.

Configuration worth checking before changing deployment behavior:

- The Axios client reads `import.meta.env.VITE_API_URL`, while Compose supplies
  `PREFIX_API_URL`; the Docker build does not visibly pass a `VITE_API_URL` build
  argument. Trace the intended build-time/runtime substitution path before
  changing either side.
- `src/env/.env` is tracked. Do not copy its contents into documentation, logs, or
  responses; treat any values there as potentially sensitive.
- The form hook currently starts in a loading state and clears it after a 3-second
  timeout on mount, independently of network activity. Preserve or deliberately
  change this behavior with care.

## Documentation note

The current `README.md` is the generic Vite starter text, not project-specific
setup documentation. Update it if a task changes user-facing setup or operations
and that documentation is in scope.
