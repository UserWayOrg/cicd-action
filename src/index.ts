import * as core from "@actions/core";
import { scan } from "@userway/cicd-core";
import { GithubAutodetectConfig } from "./GithubAutodetectConfig";
import { GithubVersionChecker } from "./GithubVersionChecker";
import { getOptions } from "./getOptions";

const options = getOptions();

scan(options, {
  logger: { ...core, warn: core.warning },
  autodetectedConfigFactory: ({ logger }) => {
    return new GithubAutodetectConfig(logger);
  },
  versionCheckerFactory: ({ logger, api }) => {
    return new GithubVersionChecker(logger, api);
  },
})
  .then(({ score }) => {
    core.info(`Quality Gate is ${score.outcome}`);
    core.setOutput("score", score);
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
