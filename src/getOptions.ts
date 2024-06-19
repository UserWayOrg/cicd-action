import * as core from "@actions/core";
import * as userway from "@userway/cicd-core";

const filterEmpty = userway.filter<
  userway.Config & {
    configPath?: string;
  }
>((property): boolean => property !== "");

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

    reportPaths: core.getMultilineInput("report_paths"),
    concurrency: core.getInput("concurrency"),

    server: core.getInput("server"),
    timeout: core.getInput("timeout"),
    dryRun: core.getInput("dry_run") === "true",
    verbose: core.isDebug(),
  });
}
