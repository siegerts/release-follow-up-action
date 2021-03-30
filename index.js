const github = require("@actions/github");
const core = require("@actions/core");

const findIssues = require("./findIssues");

/**
 * Follow up on issues and PRs, open or closed/merged,
 * after a release is published. The `pending-release`
 * label will also be removed if it's present.
 *
 * The relevant issues are parsed from the release
 * changelog and only recognized if present in the
 * current repo (i.e. where the release is published).
 *
 */
async function run() {
  const token = core.getInput("github-token", { required: true });

  // https://github.com/actions/toolkit/issues/361
  const dryRun =
    (core.getInput("dry-run", { required: false }) || "false") === "true";

  const pendingReleaseLabel =
    core.getInput("pending-release-label") || "pending-release";

  const referencedInReleaseLabel =
    core.getInput("referenced-in-release-label") || "referenced-in-release";

  const octo = github.getOctokit(token);

  // context
  const context = github.context;
  const repo = context.repo;
  const release = context.payload.release;

  if (!repo || !release) {
    core.setFailed(error.message);
  }

  core.info(`Run mode: ${dryRun ? "dry-run" : "production"}`);

  // release
  const releaseName = release.tag_name;
  const releaseBody = release.body;

  const issues = findIssues(releaseBody, repo.repo);

  if (Array.isArray(issues) && issues.length) {
    core.info(
      `Issues referenced in the ${releaseName} release: ${issues.join(", ")}`
    );

    for (const issueNumber of issues) {
      core.info(`Updating issue #${issueNumber}...`);

      let issue;
      try {
        issue = await octo.issues.get({
          owner: repo.owner,
          repo: repo.repo,
          issue_number: issueNumber,
        });
      } catch (err) {
        core.info(
          `Referenced issue (#${issueNumber}) cannot be found. Skipping...`
        );
        continue;
      }

      // update open and *closed* issues/PRs
      if (issue && issue.status === 200) {
        const issueData = issue.data;

        const labels = issueData.labels || [];

        // https://docs.github.com/en/rest/reference/issues#get-an-issue
        // GitHub's REST API v3 considers every pull request an
        // issue, but not every issue is a pull request.
        const issueTypeName = Object.keys(issueData).includes("pull_request")
          ? "pull request"
          : "issue";

        const isPendingRelease = labels.some(
          ({ name }) => name === pendingReleaseLabel
        );

        if (isPendingRelease) {
          if (!dryRun) {
            await octo.issues.removeLabel({
              owner: repo.owner,
              repo: repo.repo,
              issue_number: issueNumber,
              name: pendingReleaseLabel,
            });
          } else {
            core.info(`--removing label <${pendingReleaseLabel}>`);
          }
        }

        if (!dryRun) {
          await octo.issues.addLabels({
            owner: repo.owner,
            repo: repo.repo,
            issue_number: issueNumber,
            labels: [referencedInReleaseLabel],
          });

          const commentBody = `
👋 Hi, this ${issueTypeName} was referenced in the **${releaseName}** release!\n\n \

Check out the release notes here ${release.html_url}.
           `;
          await octo.issues.createComment({
            issue_number: issueNumber,
            owner: repo.owner,
            repo: repo.repo,
            body: commentBody,
          });
        } else {
          core.info(`--adding label <${referencedInReleaseLabel}>`);
          core.info(
            `--adding comment of type ${issueTypeName} for **${releaseName}** release`
          );
        }
      } else {
        core.info(
          `Referenced issue (#${issueNumber}) does not exist. Skipping...`
        );
      }
    }
  } else {
    core.info(`No issues were referenced in this release. Skipping...`);
  }
}

run();
