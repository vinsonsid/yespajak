import base from "@jangkar/testing-engines/stryker/base";

const config = { ...base, thresholds: { ...base.thresholds, break: 50 } };

export default config;
