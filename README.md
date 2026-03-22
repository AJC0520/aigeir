# Aigeir

A personal collection of AI-powered tools built with Vue 3 and Vite.

Current featured tool:
- Chefgeir: a kitchen assistant that suggests recipes from your ingredients and generates detailed cooking steps.

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Vue Router
- lucide-vue-next (icons)
- Ollama local API 

## Prerequisites

- Node.js: `^20.19.0 || >=22.12.0`
- npm
- Ollama running locally on `http://localhost:11434`
- Model pulled in Ollama: `qwen3.5:4b`

## Quick Start

1. Install dependencies:

```sh
npm install
```

2. Start Ollama and make sure the model is available:

```sh
ollama serve
ollama pull qwen3.5:4b
```

3. Run the app:

```sh
npm run dev
```

4. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Start development server.
- `npm run type-check`: Run TypeScript checks for Vue files.
- `npm run build`: Type-check and create a production build.
- `npm run build-only`: Build without the type-check step.
- `npm run preview`: Preview the production build locally.

## App Routes

- `/`: Home view with tool showcase.
- `/chefgeir`: Chefgeir recipe assistant.


## Project Structure

```text
src/
  components/         Reusable UI components
  router/             Route definitions
  utils/              API and utility helpers
  views/              Page-level views
```

## Troubleshooting

- If recipes do not load:
  - Confirm Ollama is running on port `11434`.
  - Confirm `qwen3.5:4b` is installed.
  - Check browser console and network request failures.
- If TypeScript errors appear in `.vue` files:
  - Use VS Code with the Vue - Official extension (Volar).
  - Run `npm run type-check` to validate the project.

## Notes

- The app currently uses direct calls to a local Ollama endpoint from the frontend.
