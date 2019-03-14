const dependency = require('./dependency')

module.exports = `
  Example of a Specification File

  Spec.js allows to test JavaScript programs using specification files.

  Every *.spec.js file exports a single template literal that includes a general
  explanation of the file being specified. Each file represents a logical
  component of a bigger system. Each logical component is composed of several
  units of functionality that can be tested for certain properties.

  Each one of this units of functionality may have one or more
  assertions. Each assertion is denoted by a line as the following:

  |- ${dependency} The dependency has been loaded and the first assert has
  been evaluated.

  Multiple assertions can be made for each file:

  |- ${false} This assertion will fail.

  |- ${2 + 2 === 4} This assertion will succeed.

  The combination of | and - will form a Turnstile ligature (|-) using the appropriate
  font. Fira Code is recommended. A Turnstile symbol was used by Gottlob Frege
  at the start of a sentence being asserted as true.

  The intended usage is specification-first software. Where the programmer
  defines the high level structure of a program in terms of a specification,
  then progressively builds the parts conforming that specification until all
  the tests are passed. A desired side-effect is having a simple way to generate
  up-to-date documentation outside the code for API consumers.
`
