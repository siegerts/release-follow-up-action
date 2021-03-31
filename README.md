# Release follow up

Follow up on issues and PRs after a release is published. The corresponding `pending-release` label will be removed if it's present and the`referenced-in-release` label added. :rocket:

![](https://github.com/siegerts/release-follow-up-action/raw/main/assets/release-follow-up.png)

The relevant issues are parsed from the release body (i.e. changelog/notes) and only recognized if present in the current repo (i.e. where the release is published).

- **Any** issue linked in the release body with the pattern `/<current-repo>/issues/<issue-number>` will be matched. If the issue exists in the current repo, a comment will be added referencing the release link.

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
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/release-follow-up-action@v1
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
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/release-follow-up-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          dry-run: true
```

**Output in the workflow run log**

```
Run mode: dry-run
Issues referenced in the v1.0 release: 5
Updating issue #5...
--removing label <pending-release>
--adding label <referenced-in-release>
--adding comment of type issue for **v1.0** release
```

#### Using different labels

```yaml
name: release-follow-up
on:
  release:
    types: [published]

jobs:
  follow-up:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/release-follow-up-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-release-label: to-be-released
          referenced-in-release-label: already-released
```
