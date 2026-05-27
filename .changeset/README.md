# Changesets (required for PRs to `release/*`)

Every feature/hotfix branch **must** include a Changeset describing the change.

## Create a changeset

```bash
npm install
npx changeset
```

Commit the generated file under `.changeset/*.md` together with your code changes.

## What happens later

- When a `release/* -> main` PR is labeled `release`, automation runs `npx changeset version` to bump `package.json` and create a stable `vX.Y.Z` tag.
