# Ox Intructions for GitHub Copilot

Javascript, React, Node.js

## Copilot Instructions

When generating code with GitHub Copilot, please adhere to the following guidelines to ensure consistency and maintainability across the codebase:

<!-- - Be friendly and professional in comments and documentation. -->

- Use double quotes instead of single quotes for strings.
- Prefer using `let` and `const` for variable declarations instead of `var`.
- Variables should be named using camelCase.
- Functions should be named using camelCase.
- Use arrow functions for anonymous functions.
- Always include semicolons at the end of statements.
- Use template literals for string interpolation.
- Use destructuring assignment for objects and arrays when appropriate.
- Prefer using `async/await` for asynchronous code instead of Promises.
- Use `===` and `!==` for comparisons instead of `==` and `!=`.
- Use switch statements for multiple conditional branches instead of multiple `if-else` statements only if it is more than 3 levels deep. One "if" and "else if" is preferred for up to 3 levels.
- Use array methods like `map`, `filter`, and `reduce` instead of traditional loops when working with arrays.
- Use `forEach` loops for iterating over iterable objects instead of traditional `for` loops when appropriate.
- Use `try/catch` blocks for error handling in asynchronous code.
- All application logic must go in the "./lib" folder.
- All React components must go in the "./components" folder.
- Use a data layer for all data fetching and mutations.
- Use a .css file and className for styling components. Unless the project uses tailwind, in which case use tailwind classes.
- All configuration will be done with a .env file in the root directory. Create it there if it does not exist.
