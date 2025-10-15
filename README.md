## SvelteKit 60-Minute Candidate Task

### What you'll build

Implement a "Saved Prompts" panel for a generation page.

Run:

```bash
pnpm i
pnpm dev
```

### Requirements

1) CRUD with optimistic updates
- Add, rename, delete prompts via `src/lib/api/prompts.ts`
- Show immediate UI changes; reconcile on server success/failure
- Handle the API's intentional 1-in-5 failure without losing user input

2) URL state + store integration
- Selected prompt id in the URL query (`?prompt=…`)
- Sync with a Svelte store so reload/back/forward keep selection

3) Basic accessibility
- Use provided `Modal.svelte` for add/edit operations
- Ensure keyboard navigation works (Tab, Enter, Esc)
- Add ARIA labels for key interactions

### Known issue to handle

- `prompts.ts` occasionally returns out-of-order responses; guard against stale data overwriting newer state

### Acceptance criteria

- State persists via URL + store; back/forward works
- Optimistic UX: immediate UI feedback, rollback on failure with toast/message
- No stale API response clobbers newer local state
- Basic a11y: modal works with keyboard, ARIA labels present
- Code quality: readable components, well-named stores

### Deliverables

- Working repo
- `DECISIONS.md` (≤300 words):
  - How you handled out-of-order API responses
  - One trade-off you made
  - One improvement you'd do with more time

### Scoring rubric (100 pts)

- Correctness & state sync (35)
- Optimistic updates & error handling (25)
- Race condition handling (20)
- Code quality & organization (15)
- Basic a11y (5)

### Notes

- All APIs are in-memory; no external services
- You may use web search for documentation; avoid external UI libraries
