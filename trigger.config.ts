import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: 'proj_dpxcewmivbkeunmgxzxg', 
  dirs: ['./src/module/trigger/tasks'],
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  maxDuration: 300, // 5 minutes
});
