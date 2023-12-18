import * as browserSync from 'browser-sync';

// Browser-Sync configuration
const config: browserSync.Options = {
  proxy: 'localhost:3000', // Your Express server
  files: ['views/**/*.ejs'], // Path to your EJS files
  browser: 'google chrome', // Preferred browser
  port: 5000, // Browser-Sync port, make sure it's different from your Express server port
  notify: false,
  open: false
};

// Initialize Browser-Sync with the configuration
browserSync.init(config);
