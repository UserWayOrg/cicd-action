import { ScanAgent, ScanAgentType } from "@userway/cicd-api";
import { ScanAgentDetector } from "@userway/cicd-core";

export class GithubScanAgentDetector implements ScanAgentDetector {
  get(): ScanAgent {
    return {
      type: ScanAgentType.GITHUB,
    };
  }
}
