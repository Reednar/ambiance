// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      captureConsole: true, // Capture les logs de console
      jasmine: {
        random: false, // Désactive l'exécution aléatoire des tests
        failFast: true, // Arrête au premier échec (optionnel)
        timeoutInterval: 10000 // Augmente le timeout si nécessaire
      },
      clearContext: false // Garde les résultats visibles
    },
    jasmineHtmlReporter: {
      suppressAll: true, // Supprime les traces dupliquées
      suppressFailed: false // Montre les échecs
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ambiance-front-'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 50,
          branches: 40,
          functions: 45,
          lines: 50
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--headless',
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: true,
    restartOnFileChange: false,
    failOnEmptyTestSuite: false, // Ne pas échouer si aucun test trouvé
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000
  });
};