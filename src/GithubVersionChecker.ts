import { Logger, Semver, VersionChecker } from "@userway/cicd-core";
import { name, version } from "../package.json";

export class GithubVersionChecker implements VersionChecker {
  constructor(private logger: Logger, private semver: Semver) {}

  public check(versions: Record<typeof name, string>): void {
    if (this.semver.lt(version, versions[name])) {
      this.logger.warn(this.buildMessage());
    }
  }

  private buildMessage(): string {
    return `
        The current version of ${name} is outdated.
        Please consider updating to the latest version.
    `;
  }
}
