# Agent Notes

## Build / test convention
- Typecheck: `npx tsc --noEmit`
- Build: `yarn build` (emits to `dist/`)
- If you run `yarn build` only to test/verify, clean up the build output diff afterward so `dist/` changes don't leak into the commit. Restore with: `git checkout -- dist/`
