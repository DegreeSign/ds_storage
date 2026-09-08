# Agent Notes

## Build / test convention
- Typecheck: `npx tsc --noEmit`
- Build: `yarn build` (emits to `dist/`)
- If you run `yarn build` only to test/verify, clean up the build output diff afterward so `dist/` changes don't leak into the commit. Restore with: `git checkout -- dist/`

## Version / release
- When bumping the version, update it in ALL of these places:
  - `package.json` (`version`)
  - `README.md` (the CDN `@degreesign/storage@<version>` URL)
