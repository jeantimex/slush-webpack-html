#!/usr/bin/env node

/**
 * Release Scripts
 */

'use strict';
var execSync = require('child_process').execSync;
var path = require('path');
var inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'semver',
      message: 'How do you want to release?',
      choices: ['Patch', 'Minor', 'Major'],
      filter: function(val) {
        return val.toLowerCase();
      },
    },
  ])
  .then(function(answer) {
    // Step 1. Double check and make sure everything looks good
    console.log('Validating...');
    execSync('npm run test');

    // Step 2. Bump up version number
    console.log('Bumping up version number...');
    execSync('npm version ' + answer.semver);
    var version = require('./package.json').version;
    console.log('New version is: ' + version);

    // Step 3. Tag the new version
    console.log('Tag new version ' + version);
    execSync('git tag ' + version);
    execSync('git push --follow-tags --no-verify');
    console.log('Publishing to npm...');

    // Step 4. NPM publish
    execSync('npm publish');

    // Step 5. Update change log
    execSync('github_changelog_generator jeantimex/slush-webpack-html --token 1edc3c83bf36c8db38a69950f811a083ade5b02f');
    execSync('git commit -am "Update change log"');
    execSync('git push');

    console.log('Done');
  });