import * as userway from "@userway/cicd-core";
import * as packagejson from "../package.json";

export class GithubVersionChecker
  extends userway.CoreVersionChecker
  implements userway.VersionChecker
{
  public readonly name = packagejson.name as userway.VersionChecker["name"];
  public readonly version = packagejson.version;

  public get message(): string {
    return `
        The current version of ${this.name} is outdated.
        Please consider updating to the latest version.
    `;
  }
}
