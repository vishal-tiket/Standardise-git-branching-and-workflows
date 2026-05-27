# Standardise-git-branching-and-workflows

This repository is a **working demo** of a standard Git flow + GitHub Actions automation using Changesets.

## Branch naming
- **feature**: `feat/{Board}-{ticket}-{short-description}`
- **hotfix**: `fix/{Board}-{ticket}-{short-description}`

## Branch roles
- **`main`**: production history (merge `release` or `release/*` into `main` with a normal merge commit, not squash)
- **`release` / `release/*`**: combine multiple approved features for a production release
- **`develop`**: auto-updated integration branch; every commit generates a prerelease tag

## Required: Changeset on PRs targeting `release` or `release/*`
When opening a PR into `release` or `release/*`, you must include a `.changeset/*.md` file.

Create one with:

```bash
npm install
npx changeset
```

## GitHub Actions in this repo

**Prerequisite:** merge `.github/workflows/` into **`main`** so workflows appear in the Actions tab and `workflow_run` uses the latest definitions.

- **Changeset gate**: `.github/workflows/changeset-required.yml` — blocks PRs targeting `release` or `release/**` if there is no `.changeset/*.md`.
- **Auto-sync to develop**: `.github/workflows/handle-develop-pr-sync.yml` — on those PRs, merges the PR head SHA into `develop` and pushes; creates/updates a draft `develop` → `main` PR; comments on conflict with manual steps.
- **Prerelease tag on develop**: `.github/workflows/alpha-prerelease.yml` — runs after **Handle Develop PR Sync** succeeds (`workflow_run`), on manual `workflow_dispatch`, or on direct pushes to `develop`; creates and pushes git tag `alpha-<runNumber>` and updates a bot comment on the draft **develop → main** PR with tag, commit, and workflow link.
- **Release → main PR**: `.github/workflows/release-to-main-pr.yml` — on every push to `release` or `release/**`, creates or updates a ready-for-review PR into `main` showing the release diff.
- **Stable release tag + version bump**: `.github/workflows/release-tag.yml` — when that **release → main** PR is labeled **`release`**, runs `npx changeset version`, commits the bump, and creates/pushes stable tag `vX.Y.Z`.

## End-to-end demo script (manual)
1. **Create a feature branch**

```bash
git checkout main
git pull --ff-only
git checkout -b feat/ABC-123-add-demo
```

2. **Make a changeset and push**

```bash
npx changeset
git add -A
git commit -m "feat: add demo changeset"
git push -u origin HEAD
```

3. **Open a PR to `release` or `release/<something>`**
- the PR must include `.changeset/*.md` (workflow enforces this)
- the develop sync workflow will try to merge your PR head commit into `develop`

4. **Observe prerelease tags and PR comment**
- after sync succeeds, **Generate Alpha Prerelease Tag** runs via `workflow_run`, creates `alpha-<runNumber>` on `develop`, and updates the **develop → main** PR with prerelease details

5. **QA sign-off → squash merge feature into `release` or `release/*`**

6. **Review the auto-created `release` → `main` PR, then add label `release` after QA**
- created/updated when features merge into `release`; labeling runs stable version bump and `vX.Y.Z` tag

7. **Deploy using the new tag**
- use `alpha-*` tags for Gatotkaca prerelease deploys
- use `v*` tags for Pre-Prod/Prod deploys

8. **After prod deploy, merge (not squash) `release` or `release/*` into `main`**

9. **Delete feature branch**
