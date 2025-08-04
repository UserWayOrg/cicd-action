import * as core from "@actions/core";
import { scan } from "@userway/cicd-core";
import { getOptions } from "./getOptions";
import { GithubAutodetectedConfig } from "./GithubAutodetectedConfig";
import { GithubScanAgentDetector } from "./GithubScanAgentDetector";
import { GithubVersionChecker } from "./GithubVersionChecker";

const options = getOptions();

scan(options, {
  logger: { ...core, warn: core.warning },
  autodetectedConfigFactory: ({ logger }) => {
    return new GithubAutodetectedConfig(logger);
  },
  versionCheckerFactory: ({ logger, api }) => {
    return new GithubVersionChecker(logger, api);
  },
  scanAgentDetectorFactory: ({ logger }) => {
    return new GithubScanAgentDetector(logger);
  },
})
  .then(({ score, shouldFail }) => {
    core.setOutput("score", score);
    core.info(`Continuous Accessibility Quality Gate is ${score.outcome}`);

    if (shouldFail) {
      core.setFailed("Continuous Accessibility Quality Gate is failed");
    }
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
