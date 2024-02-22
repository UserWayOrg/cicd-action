import * as core from "@actions/core";

export const logger = {
  info: core.info,
  warn: core.warning,
  error: core.error,
  debug: core.debug,
};
