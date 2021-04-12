const findIssues = require("./findIssues");

test("matches issue references when compressed", () => {
  const repo = "example-repo";
  const releaseBody = `
        # Change Log\n\n# Project 1 (2021-03-23)\n\n\n \
        ### Bug Fixes\n\n* lorem ipsum ([a7e0351](https://github.com/org/repo-cli/commit/a7e035126e264abf1c075b17cbd9a82fa3963481))\n\n \
        # repo-cli [4.46.1](https://github.com/example-org/example-repo/compare/@example-repo/cli@4.46.0...@example-repo/cli@4.46.1) (2021-03-23)\n\n\n \
        ### Reverts\n\n* Revert "Init and Configure DX changes (#6745)" ([9078b69](https://github.com/example-org/example-repo/commit/9078b69b5842c99f0624797a5e897353bacb65d0)), \ 
        closes [#6745](https://github.com/example-org/example-repo/issues/6745)\n\n# repo-e2e-tests [2.37.1](https://github.com/example-org/example-repo/compare/repo-e2e-tests@2.37.0...repo-e2e-tests@2.37.1) \
        (2021-03-23)\n\n\n### Reverts\n\n* Revert "Init and Configure DX changes (#6745)" ([9078b69](https://github.com/example-org/example-repo/commit/9078b69b5842c99f0624797a5e897353bacb65d0)), closes [#6745](https://github.com/example-org/example-repo/issues/6745)
    `;
  expect(findIssues(releaseBody, repo)).toEqual([6745]);
});

test("matches issue references", () => {
  const repo = "example-repo";
  const releaseBody = `
  # Change Log

  # repo-cli [4.45.2](https://github.com/example-org/example-repo/compare/@org-project/cli@4.45.1...@org-project/cli@4.45.2) (2021-03-12)
  
  ### Bug Fixes
  
  - Eget velit aliquet. ([#6871](https://github.com/example-org/example-repo/issues/1)) ([e53175d](https://github.com/example-org/example-repo/commit/e53175d96136fba57662b1a035d3cea4a65a7601))
  
  # sagittis id consectetur purus ut faucibus pulvinarn [4.40.2](https://github.com/example-org/example-repo/compare/project-provider-orgcloudformation@4.40.1...project-provider-orgcloudformation@4.40.2) (2021-03-12)
  
  ### Bug Fixes
  
  - bump versions ([#6871](https://github.com/example-org/example-repo/issues/2)) ([e53175d](https://github.com/example-org/example-repo/commit/e53175d96136fba57662b1a035d3cea4a65a7601))
  
  # repo-util-mock [3.29.2](https://github.com/example-org/example-repo/compare/project-util-mock@3.29.1...project-util-mock@3.29.2) (2021-03-12)
  
  ### Bug Fixes
  
  - bump versions ([#6871](https://github.com/example-org/example-repo/issues/3)) ([e53175d](https://github.com/example-org/example-repo/commit/e53175d96136fba57662b1a035d3cea4a65a7601))
  
  
  ### Features
  
  - **cli:** consectetur purus ut faucibus ([#6618](https://github.com/example-org/example-repo/issues/6618)) ([50a5775](https://github.com/example-org/example-repo/commit/50a5775a4468ea88e3ba5050c0365b29691afb61))
  
  # repo-hosting [1.2.6](https://github.com/example-org/example-repo/compare/project-container-hosting@1.2.5...project-container-hosting@1.2.6) (2021-03-23)
  
  
  ### Bug Fixes
  
  - Id consectetur purus ut faucibus pulvinar elementum integer enim. ([#6495](https://github.com/example-org/example-repo/issues/6495)) ([2333dec](https://github.com/example-org/example-repo/commit/2333decdd61c2a5421a7030723f20d05f3c00269)), closes [#6359](https://github.com/example-org/example-repo/issues/6359)
  - Nulla malesuada pellentesque elit eget.  ([#5783](https://github.com/example-org/example-repo/issues/5783)) ([2cfa2b5](https://github.com/example-org/example-repo/commit/2cfa2b58d0469dce8a5644b3280480196d995ea4))
  - **magna eget est lorem** Donec adipiscing tristique risus nec feugiat in fermentum posuere ([#6908](https://github.com/example-org/example-repo/issues/6908)) ([a5ad84d](https://github.com/example-org/example-repo/commit/a5ad84d28aaa2daddd9ddb6df7bee93e5d2bef73))
  - **magna eget est lorem** Donec adipiscing tristique risus nec feugiat in fermentum posuere ([#6803](https://github.com/example-org/example-repo/issues/6803)) ([ae02803](https://github.com/example-org/example-repo/commit/ae0280302f7a6632f74f1184a4b928319965df55)), closes [#6578](https://github.com/example-org/example-repo/issues/6578)
  - stop check when resource is in create status ([#6349](https://github.com/example-org/example-repo/issues/6349)) ([45e0246](https://github.com/example-org/example-repo/commit/45e0246306136e513c735899b030f94bb004a330))
`;
  expect(findIssues(releaseBody, repo)).toEqual([
    1,
    2,
    3,
    6618,
    6495,
    6359,
    5783,
    6908,
    6803,
    6578,
    6349,
  ]);
});

test("handles no release body correctly", () => {
  const repo = "example-repo";
  const releaseBody = undefined;
  expect(findIssues(releaseBody, repo)).toEqual([]);
});

test("handles no release body logic-releaseBody", () => {
  const repo = "example-repo";
  const releaseBody = undefined;

  const issues =
    releaseBody && repo.repo ? findIssues(releaseBody, repo.repo) : [];

  expect(issues).toEqual([]);
});

test("handles no release body logic-repo", () => {
  const repo = { item: "" };
  const releaseBody = "this contains something";

  const issues =
    releaseBody && repo.repo ? findIssues(releaseBody, repo.repo) : [];

  expect(issues).toEqual([]);
});
