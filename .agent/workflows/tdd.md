---
description: Test-Driven Development (TDD) Workflow
---

# Test-Driven Development (TDD) Workflow

Follow this strict cycle for all feature work and bug fixes.

## 1. Red: Write a Failing Test
Create a test file for the feature or bug you are working on.
- **Unit/Integration**: `__tests__` directory or `*.test.tsx` next to the component.
- **E2E**: `e2e` directory.

Write the test asserting the expected behavior.
Run the test to confirm it fails. :red_circle:
**DO NOT PROCEED UNTIL YOU SEE IT FAIL.**

## 2. Green: Make it Pass
Write the *minimum* amount of code required to make the test pass.
- Do not over-engineer.
- Do not worry about clean code yet.
- Just get to green. :green_circle:

## 3. Refactor: Clean it Code
Review the code you just wrote.
- Remove duplication.
- Improve variable names.
- Extract functions or components.
- ensure tests still pass. :arrows_counterclockwise:

## Rules
- **No Production Code Without Tests**: If you find yourself writing code without a test, stop, delete it, and write the test first.
- **One Step at a Time**: Don't try to implement the whole feature at once.
