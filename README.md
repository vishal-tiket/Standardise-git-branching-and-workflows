# Standardise-git-branching-and-workflows

This repository is a **working demo** of a standard Git flow + GitHub Actions automation using Changesets.

## Branch naming
- **feature**: `feat/{Board}-{ticket}-{short-description}`
- **hotfix**: `fix/{Board}-{ticket}-{short-description}`

## Branch roles
- **`main`**: production history (merge `release/*` into `main` with a normal merge commit, not squash)
- **`release/*`**: combine multiple approved features for a production release
- **`develop`**: auto-updated integration branch; every commit generates a prerelease tag

## Required: Changeset on PRs targeting `release/*`
When opening a PR into `release/*`, you must include a `.changeset/*.md` file.

Create one with:

```bash
npm install
npx changeset
```

## GitHub Actions in this repo
- **Changeset gate**: `.github/workflows/changeset-required.yml`  \n  Blocks PRs targeting `release/**` if there is no `.changeset/*.md`.
- **Auto-sync to develop**: `.github/workflows/handle-develop-pr-sync.yml`  \n  On PRs targeting `release/**`, attempts to merge the PR head SHA into `develop` and push. If there’s a conflict, it comments on the PR with manual steps.
- **Prerelease tag on develop**: `.github/workflows/alpha-prerelease.yml`  \n  On every push to `develop`, creates and pushes git tag `alpha-<runNumber>` pointing at that commit.
- **Stable release tag + version bump**: `.github/workflows/release-tag.yml`  \n  When a `release/* -> main` PR is labeled **`release`**, runs `npx changeset version`, commits the bump back to the `release/*` branch, and creates/pushes stable tag `vX.Y.Z`.

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

3. **Open a PR to `release/<something>`**
- the PR must include `.changeset/*.md` (workflow enforces this)
- the develop sync workflow will try to merge your PR head commit into `develop`

4. **Observe prerelease tags**
- each push to `develop` should create a new `alpha-<runNumber>` tag

5. **QA sign-off → squash merge feature into `release/*`**

6. **Open `release/* -> main` PR, then add label `release`**
- workflow bumps `package.json` and creates stable `vX.Y.Z` tag

7. **Deploy using the new tag**
- use `alpha-*` tags for Gatotkaca prerelease deploys
- use `v*` tags for Pre-Prod/Prod deploys

8. **After prod deploy, merge (not squash) `release/*` into `main`**

9. **Delete feature branch**

# Standardise-git-branching-and-workflows

This repository is a **working demo** of the team Git flow + GitHub Actions automation described in the plan:

## Branch naming
- **feature**: `feat/{Board}-{ticket}-{short-description}`
- **hotfix**: `fix/{Board}-{ticket}-{short-description}`

## Branch roles
- **`main`**: production history (merge release branches into `main` with a normal merge commit, not squash)\n+- **`release/*`**: combine multiple approved features for a production release\n+- **`develop`**: auto-updated integration branch; every commit generates a prerelease tag\n+
## Required: Changeset on feature/hotfix PRs to release
When opening a PR into `release/*`, you must include a `.changeset/*.md` file.

Create one with:

```bash
npm install
npx changeset
```

## GitHub Actions in this repo
- **Changeset gate**: `.github/workflows/changeset-required.yml`\n  - blocks PRs targeting `release/**` if there is no `.changeset/*.md`\n-\n+- **Auto-sync to develop**: `.github/workflows/handle-develop-pr-sync.yml`\n  - triggered on PRs targeting `release/**`\n  - attempts to merge the PR head commit into `develop` and push\n  - if there’s a conflict, it comments on the PR with manual resolution steps\n+\n+- **Prerelease tag on develop**: `.github/workflows/alpha-prerelease.yml`\n  - runs on every push to `develop`\n  - creates/pushes git tag `alpha-<runNumber>` pointing at that `develop` commit\n+\n+- **Stable release tag + version bump**: `.github/workflows/release-tag.yml`\n  - runs when a `release/* -> main` PR is labeled **`release`**\n  - runs `npx changeset version` to bump `package.json`\n  - commits the bump back to the `release/*` branch\n  - creates/pushes stable tag `vX.Y.Z`\n+\n+## End-to-end demo script (manual)\n+1. **Create a feature branch**\n+\n+```bash\n+git checkout main\n+git pull --ff-only\n+git checkout -b feat/ABC-123-add-demo\n+```\n+\n+2. **Make a changeset**\n+\n+```bash\n+npx changeset\n+git add -A\n+git commit -m \"feat: add demo changeset\"\n+git push -u origin HEAD\n+```\n+\n+3. **Open PR to `release/<something>`**\n+   - the PR must include `.changeset/*.md` (workflow enforces this)\n+   - the develop sync workflow will try to merge your PR commit into `develop`\n+\n+4. **Observe prerelease tags**\n+   - each push to `develop` should create a new `alpha-<runNumber>` tag\n+\n+5. **QA sign-off → squash merge feature into `release/*`**\n+\n+6. **Open `release/* -> main` PR, then add label `release`**\n+   - workflow bumps `package.json` and creates stable `vX.Y.Z` tag\n+\n+7. **Deploy using the new tag**\n+   - use `alpha-*` tags for Gatotkaca prerelease deploys\n+   - use `v*` tags for Pre-Prod/Prod deploys\n+\n+8. **After prod deploy, merge (not squash) `release/*` into `main`**\n+\n+9. **Delete feature branch**\n*** End Patch"}Oops tool expects freeform patch; need redo. We'll apply proper patch without JSON. 
