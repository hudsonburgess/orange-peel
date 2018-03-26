const fs = require('fs')

console.log('hello from setup');

const defaultConfig = {
    browsers: [
        { type: 'chrome', numInstances: 1 }
    ],
    timeout: 60000,
    baseUrl: 'http://localhost:4200'
};

const configPath = 'orange-config.json';
fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
console.log(`wrote default config to op-config.json`);