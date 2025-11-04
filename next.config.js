// Proxy configuration file that simply re-exports the ES module based configuration.
// This file is necessary because some environments may still pick up next.config.js.
// We forward to next.config.mjs to avoid duplicate definitions.
import config from './next.config.mjs';
export default config;