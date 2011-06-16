var reporter = require('nodeunit').reporters.default;
    
reporter.run(
    [
        'collect/collect.js',
        'assembleStrings/assembleStrings.js',
        'build/buildExpected.js',
        'build/build.js',
        'build/buildErrors.js',
    ]
);