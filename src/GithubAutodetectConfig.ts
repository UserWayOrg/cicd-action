import * as github from "@actions/github";
import * as userway from "@userway/cicd-core";

export class GithubAutodetectConfig
  extends userway.GitAutodetectedConfig
  implements userway.AutodetectedConfig
{

  public get commitHash(): string {
    if (github.context.payload.pull_request) {
      return github.context.payload.pull_request.head.sha!
    }

    return github.context.sha || super.commitHash;
  }

  public get targetBranch(): string | undefined {
    if (github.context.payload.pull_request) {
      return github.context.payload.pull_request.base.ref;
    }
  }

  public get pullRequest(): number | undefined {
    if (github.context.payload.pull_request) {
      return github.context.payload.pull_request.number;
    }
  }
}
