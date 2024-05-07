import * as core from "@actions/core";
import * as github from "@actions/github";
import * as userway from "@userway/cicd-core";

async function scan({
  project = github.context.payload.repository?.name!,
  commitHash = github.context.payload.pull_request?.head.sha ||
    github.context.sha,
  branch = github.context.payload.pull_request?.head.ref || github.context.ref,
  target = github.context.payload.pull_request?.base.ref,
  pullRequest = github.context.payload.pull_request?.number,
  contributorName = github.context.actor,
  ...config
}: userway.OutputOptions) {
  return await userway.scan(
    {
      project,
      commitHash,
      branch,
      target,
      pullRequest,
      contributorName,
      ...config,
    },
    { logger: { ...core, warn: core.warning } }
  );
}

async function run() {
  const trimed = userway.purgeUndefined({
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

  const file = await userway.read<object>(trimed.config).catch(() => ({}));

  const config = await userway.config.parseAsync({
    ...file,
    ...trimed,
  });

  if (config.dryRun) {
    core.info(JSON.stringify(config));
    process.exit(0);
  }

  return await scan(config);
}

run()
  .then(({ score }) => {
    const message = `Quality gate outcome is ${score.outcome}`;
    
    if (score.outcome === "FAILED") {
      core.setFailed(message);
    } else {
      core.info(message);
      core.setOutput("score", score);
    }
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
