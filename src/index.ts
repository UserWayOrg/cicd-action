import * as core from "@actions/core";
import * as github from "@actions/github";
import * as userway from "@userway/cicd-core";
import { stripEmptyProperties } from "src/stripEmptyProperties";

function buildLogger() {
  return { ...core, warn: core.warning };
}

function buildContextConfig() {
  return userway.purgeUndefined({
    project: github.context.payload.repository?.name!,
    commitHash:
      github.context.payload.pull_request?.head.sha ?? github.context.sha,
    branch: github.context.payload.pull_request?.head.ref || github.context.ref,
    target: github.context.payload.pull_request?.base.ref,
    pullRequest: github.context.payload.pull_request?.number,
    contributorName: github.context.actor,
  });
}

function buildActionConfig() {
  return stripEmptyProperties({
    config: core.getInput("config"),

    token: core.getInput("token"),
    organization: core.getInput("organization"),
    project: core.getInput("project"),

    commitHash: core.getInput("commit_hash"),
    commitMessage: core.getInput("commit_message"),
    branch: core.getInput("branch"),
    target: core.getInput("target"),
    pullRequest: core.getInput("pull_request"),
    contributorName: core.getInput("contributor_name"),
    contributorEmail: core.getInput("contributor_email"),

    retention: core.getInput("retention"),
    scope: core.getInput("scope"),
    assigneeEmail: core.getInput("assignee_email"),

    reportPaths: core.getMultilineInput("report_paths"),
    concurrency: core.getInput("concurrency"),

    server: core.getInput("server"),
    timeout: core.getInput("timeout"),
    dryRun: core.getInput("dry_run") === "true",
    verbose: core.isDebug(),
  });
}

async function run() {
  const actionConfig = buildActionConfig();
  const contextConfig = buildContextConfig();

  const fileConfig = await userway
    .read<object>(actionConfig.config)
    .catch(() => ({}));

  core.debug(JSON.stringify({ actionConfig, contextConfig, file: fileConfig }));

  const config = await userway.config.parseAsync({
    ...contextConfig,
    ...fileConfig,
    ...actionConfig,
  });

  core.debug(JSON.stringify({ config }));

  if (config.dryRun) {
    core.info(JSON.stringify(config));
    process.exit(0);
  }

  return await userway.scan(config, { logger: buildLogger() });
}

run()
  .then(({ score }) => {
    const message = `Quality gate outcome is ${score.outcome}`;

    core.info(message);
    core.setOutput("score", score);
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
