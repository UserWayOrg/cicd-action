import * as core from "@actions/core";
import * as userway from "@userway/cicd-core";
import { stripUndefinedProperties } from "./stripUndefinedProperties";

async function run() {
  const trimed = stripUndefinedProperties({
    token: core.getInput("token", { required: true }),
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

  const config = await userway.schema.analyze.parseAsync({
    ...trimed,
    verbose: core.isDebug(),
  });

  const { score } = await userway.analyze(config, {
    info: core.info,
    warn: core.warning,
    error: core.error,
    debug: core.debug,
  });

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
