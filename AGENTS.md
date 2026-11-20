# AGENTS

Guidance for AI/code agents working in this repository.

## Project context

- Static marketing site for Bell Driver Education
- Core stack: plain HTML/CSS/JavaScript
- Hosting: Firebase Hosting (`bell-driver-site`)
- Site files live in `public/`, the only folder Firebase publishes. Never put keys, credentials or notes there.
- Course dates: edit `public/js/courses.js` only (feeds the Schedule page and the registration date picker).

## Expected workflow

1. Keep changes minimal and scoped to the request.
2. Prefer editing existing files over introducing new abstractions.
3. Maintain visual consistency with existing design tokens and section patterns.
4. Verify no HTML/CSS/JS syntax issues after edits.

## Conventions

- Keep copy customer-friendly and simple.
- Reuse existing classes/components where possible.
- Avoid adding dependencies unless explicitly requested.
