import packageJson from './package.json' with { type: 'json' };

export const userscriptVersion = process.env.GITHUB_RUN_NUMBER
  ? packageJson.version.replace(/\d+$/, process.env.GITHUB_RUN_NUMBER)
  : packageJson.version;
