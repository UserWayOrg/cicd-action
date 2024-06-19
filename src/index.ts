import * as core from "@actions/core";
import { scan } from "@userway/cicd-core";
import { GithubAutodetectConfig } from "./GithubAutodetectConfig";
import { GithubVersionChecker } from "./GithubVersionChecker";
import { getOptions } from "./getOptions";

const logger = { ...core, warn: core.warning };

const options = getOptions();
core.debug(`Provided options: ${JSON.stringify(options)}`);

scan(options, {
  logger,
  autodetect: new GithubAutodetectConfig(logger),
  versionCheckerFactory: ({ logger, semver }) => {
    return new GithubVersionChecker(logger, semver);
  },
})
  .then(({ score }) => {
    core.info(`Continuous Accessibility Quality Gate is ${score.outcome}`);
    core.setOutput("score", score);
  })
  .catch((error) => {
    core.setFailed(error.message);
  });
