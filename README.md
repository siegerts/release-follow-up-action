# Release follow up

Follow up on issues and PRs, open or closed/merged, after a release is published. The corresponding `pending-release` label will be removed if it's present `referenced-in-release` label added. :rocket:

![](https://github.com/siegerts/release-follow-up-action/raw/main/assets/release-follow-up.png)

The relevant issues are parsed from the release body (i.e. changelog/notes) and only recognized if present in the current repo (i.e. where the release is published).

- **Any** issue linked in the release body with the pattern `/<current-repo>/issues/<issue-number>` will be matched.

- Issues and PRs **are not** closed, only commented on.

## Inputs

| Input                         | Default                 | Description                                                                  |
| ----------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| `github-token`                |                         | The GitHub token used to create an authenticated client                      |
| `pending-release-label`       | `pending-release`       | Label to remove from referenced issues, if exists                            |
| `referenced-in-release-label` | `referenced-in-release` | Label to add to referenced issues                                            |
| `dry-run`                     | `false`                 | Log proposed updates against referenced items instead of modifying resources |

## Usage

You can use the action by referencing the v1 branch:

```yaml
name: release-follow-up
on:
  release:
    types: [published]

jobs:
  follow-up:
    steps:
      - uses: siegerts/release-follow-up@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Using `dry-run`

```yaml
name: release-follow-up
on:
  release:
    types: [published]

jobs:
  follow-up:
    steps:
      - uses: siegerts/release-follow-up@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          dry-run: true
```

#### Using different labels

```yaml
name: release-follow-up
on:
  release:
    types: [published]

jobs:
  follow-up:
    steps:
      - uses: siegerts/release-follow-up@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-release-label: to-be-released
          referenced-in-release-label: already-released
```

See the [actions tab](https://github.com/siegerts/github-release-commenter-action/actions) for runs of this action! :rocket:
