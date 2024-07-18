import * as core from "@actions/core";
import { scan } from "@userway/cicd-core";
import { GithubAutodetectedConfig } from "./GithubAutodetectedConfig";
import { GithubVersionChecker } from "./GithubVersionChecker";
import { getOptions } from "./getOptions";

const options = getOptions();

scan(options, {
  logger: { ...core, warn: core.warning },
  autodetectedConfigFactory: ({ logger }) => {
    return new GithubAutodetectedConfig(logger);
  },
  versionCheckerFactory: ({ logger, api }) => {
    return new GithubVersionChecker(logger, api);
  },
})
  .then(({ score }) => {
    core.setOutput("score", score);
    core.info(`Continuous Accessibility Quality Gate is ${score.outcome}`);

    if (score.outcome === "FAILED") {
      core.setFailed("Continuous Accessibility Quality Gate is failed");
    }
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
