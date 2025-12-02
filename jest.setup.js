// Add TextEncoder and TextDecoder polyfills for Node.js APIs
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Prevent dotenv from trying to use localStorage
process.env.DOTENV_KEY = '';
