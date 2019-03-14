#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const specRegExp = /\.spec\.js$/
const target = path.join(process.cwd(), process.argv[2])

// Get all the specification file paths
// If a specification file is provided then just test that file
// Otherwise find all the specification files in the target directory
const paths = specRegExp.test(target)
  ? [ target ]
  : findSpecifications(target, specRegExp)

// Get the content of each specification file
// Get the assertions of each specification file
const assertionGroups = getAssertions(getSpecifications(paths))

// Log all the assertions
logAssertions(assertionGroups)

// Check for any failed assertions and return an appropriate exit code
process.exitCode = checkAssertions(assertionGroups)

// ·············································································
// Function definitions

// Find all the specification files in the directory
function findSpecifications (dir, matchPattern, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file) // Get the full path

    fileList = fs.statSync(filePath).isDirectory() // Check if we are in a directory then
      ? findSpecifications(filePath, matchPattern, fileList) // Continue the recursion
      : fileList.concat(matchPattern.test(filePath) ? filePath : '') // Otherwise check if the file matches the pattern
  })

  return fileList.filter(x => x) // Return the list of found files
}

// Get the content of the specification files
function getSpecifications (paths) {
  return paths.map(path => require(path))
}

// Get all the assertions from the specification files
function getAssertions (specifications) {
  return specifications.map(specification => ({
    title: specification.split('\n\n', 1)[0].trim(),
    assertions: specification.match(/^( |\t)*(\|-)(.|\n)*?\./gm).map(assertion => {
      const assertionFragments = /(?:\|-) (\w*) ((?:.|\n)*)/.exec(assertion)

      return {
        value: assertionFragments[1],
        description: assertionFragments[2].replace(/\n /, '')
      }
    })
  }))
}

// Log the results of the test into the terminal
function logAssertions(assertionGroups) {
  const ansiColor = {
    blue: text => console.log(`\x1b[1m\x1b[34m${text}\x1b[39m\x1b[22m`),
    green: text => console.log(`\x1b[32m  ✔  ${text}\x1b[39m`),
    red: text => console.log(`\x1b[31m  ✖  ${text}\x1b[39m`)
  }

  assertionGroups.forEach(group => {
    ansiColor.blue(group.title)

    group.assertions.forEach(assertion => {
      assertion.value === 'true'
        ? ansiColor.green(assertion.description)
        : ansiColor.red(assertion.description)
    })
  })

  console.log('\n')
}

// Check if all the assertions passed
function checkAssertions (assertionGroups) {
  return assertionGroups.flat().every(assertion => assertion.value === 'true') ? 0 : 1
}
