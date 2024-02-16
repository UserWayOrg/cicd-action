import * as core from "@actions/core";
import * as userway from "@userway/a11y-kit";
import { fetchEmail } from "./fetchEmail";
import { trim } from "./trim";

async function run() {
  const trimed = trim({
    token: core.getInput("userway_token", { required: true }),
    organization: core.getInput("organization", { required: true }),
    project: core.getInput("project", { required: true }),

    commit: core.getInput("commit"),
    branch: core.getInput("branch"),
    target: core.getInput("target"),
    pullRequest: core.getInput("pull_request"),
    contributorName: core.getInput("contributor_name"),
    contributorEmail: core.getInput("contributor_email"),

    retention: core.getInput("retention"),
    scope: core.getInput("scope"),
    assigneeEmail: core.getInput("assignee_email"),
    framework: core.getInput("framework"),

    path: core.getInput("path"),
    concurrency: core.getInput("concurrency"),

    server: core.getInput("server"),
    timeout: core.getInput("timeout"),
  });

  const githubToken = core.getInput("github_token", { required: true });
  const email = (await fetchEmail(githubToken, trimed.contributorName))!;

  const config = await userway.schema.analyze.parseAsync({
    ...trimed,
    assigneeEmail: trimed.assigneeEmail || email,
    contributorEmail: trimed.contributorEmail || email,
    verbose: core.getBooleanInput("verbose"),
  });

  const score = await userway.analyze(config);

  if (score.outcome === "FAILED") {
    throw new Error("Quality gate is failed");
  }

  return score;
}

run()
  .then((score) => {
    core.setOutput("score", score);
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
