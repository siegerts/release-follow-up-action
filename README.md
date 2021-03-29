# Release follow up

Follow up on issues and PRs, open or closed/merged, after a release is published. The `pending-release` label will also be removed if it's present. :rocket:

The relevant issues are parsed from the release Changelog and only recognized if present in the current repo (i.e. where the release is published).

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
      - uses: siegerts/github-release-commenter@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

See the [actions tab](https://github.com/siegerts/github-release-commenter-action/actions) for runs of this action! :rocket:
