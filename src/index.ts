import * as core from "@actions/core";
import * as userway from "@userway/cicd-core";
import { stripUndefinedProperties } from "./stripUndefinedProperties";

async function run() {
  const trimed = stripUndefinedProperties({
    command: core.getInput("command", { required: true }),
    config: core.getInput("config"),

    token: core.getInput("token"),
    organization: core.getInput("organization"),
    project: core.getInput("project"),

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

    reportPath: core.getInput("reportPath"),
    concurrency: core.getInput("concurrency"),

    server: core.getInput("server"),
    timeout: core.getInput("timeout"),
    verbose: core.getBooleanInput("verbose") || core.isDebug(),
    dryRun: core.getBooleanInput("dryRun"),
  });

  const file = await userway.file.read<object>(trimed.config).catch(() => ({}));

  switch (trimed.command) {
    case "analyze": {
      const config = await userway.schema.analyze.parseAsync({
        ...trimed,
        ...file,
      });

      if (config.dryRun) {
        core.info(JSON.stringify(config));
        process.exit(0);
      }

      return await userway.analyze(config, {
        logger: { ...core, warn: core.warning },
      });
    }
    case "scan": {
      const config = await userway.schema.scan.parseAsync({
        ...trimed,
        ...file,
      });

      if (config.dryRun) {
        core.info(JSON.stringify(config));
        process.exit(0);
      }

      return await userway.scan(config, {
        logger: { ...core, warn: core.warning },
      });
    }
    default: {
      throw new Error(`Unknown command: ${trimed.command}`);
    }
  }
}

run()
  .then(({ score }) => {
    core.setOutput("score", score);
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
