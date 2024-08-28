import * as core from "@actions/core";
import * as userway from "@userway/cicd-core";

const filterEmpty = userway.filter<userway.Options>((property) => {
  const isNotUndefined = property !== undefined;
  const isNotEmptyString = property !== "";
  const isNotEmptyArray = Array.isArray(property) ? property.length > 0 : true;

  return isNotUndefined && isNotEmptyString && isNotEmptyArray;
});

function parseBoolean(value: string): boolean | undefined {
  const lower = value.toLowerCase();

  if (lower === "true") return true;
  if (lower === "false") return false;

  return undefined;
}

export function getOptions() {
  return filterEmpty({
    configPath: core.getInput("config_path"),

    token: core.getInput("token"),
    organization: core.getInput("organization"),
    project: core.getInput("project"),

    commitHash: core.getInput("commit_hash"),
    commitMessage: core.getInput("commit_message"),
    commitCreatedAt: core.getInput("commit_created_at"),
    branch: core.getInput("branch"),
    targetBranch: core.getInput("target_branch"),
    pullRequest: core.getInput("pull_request"),
    contributorName: core.getInput("contributor_name"),
    contributorEmail: core.getInput("contributor_email"),

    retention: core.getInput("retention") as userway.Config["retention"],
    scope: core.getInput("scope") as userway.Config["scope"],
    assigneeEmail: core.getInput("assignee_email"),

    reportPaths: core.getInput("report_paths").split(",").filter(Boolean),
    concurrency: core.getInput("concurrency"),

    server: core.getInput("server"),
    timeout: core.getInput("timeout"),
    dryRun: parseBoolean(core.getInput("dry_run")),
    ignoreQualityGate: parseBoolean(core.getInput("ignore_quality_gate")),
    verbose: core.isDebug(),
  });
}
