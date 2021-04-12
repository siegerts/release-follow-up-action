/**
 * Parse release notes for issue (includes PR)
 * numbers in the current repo
 */
let findIssues = function (releaseBody, repo) {
  if (!releaseBody) {
    return [];
  }

  const issuePattern = `\/${repo}\/issues\/([0-9]+)+?`;
  const issueRE = new RegExp(issuePattern, "gim");

  // match and dedupe
  const matches = new Set(
    [...releaseBody.matchAll(issueRE)].map((issue) => +issue[1])
  );

  return [...matches];
};

module.exports = findIssues;
