const github = require("@actions/github");
const core = require("@actions/core");

/**
 * Follow up on issues and PRs, open or closed/merged,
 * after a release is published. The `pending-release`
 * label will also be removed if it's present.
 *
 * The relevant issues are parsed from the release
 * changelog and only recognized if present in the
 * current repo (i.e. where the release is published).
 *
 * @param {string} `github-token`
 * @param {boolean} `dry-run`
 *
 */
async function run() {
  const token = core.getInput("github-token", { required: true });
  // const dryRun = core.getInput("dry-run");

  const octo = github.getOctokit(token);

  // context
  const context = octo.context;
  const repo = context.repo;
  const release = context.payload.release;

  if (!repo || !release) {
    core.setFailed(error.message);
  }

  // release
  const releaseName = release.tag_name;
  const releaseBody = release.body;

  // parse release notes for issue (includes PR)
  // numbers in the current repo
  const issuePattern = `\/${repo.repo}\/issues\/([0-9]+)+?`;
  const issueRE = new RegExp(issuePattern, "gim");

  // match and dedupe
  const matches = new Set(
    [...releaseBody.matchAll(issueRE)].map((issue) => issue[1])
  );
  const issues = [...matches];

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
          ({ name }) => name === "pending-release"
        );

        if (isPendingRelease) {
          await octo.issues.removeLabel({
            owner: repo.owner,
            repo: repo.repo,
            issue_number: issueNumber,
            name: "pending-release",
          });
        }

        await octo.issues.addLabels({
          owner: repo.owner,
          repo: repo.repo,
          issue_number: issueNumber,
          labels: ["referenced-in-release"],
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
