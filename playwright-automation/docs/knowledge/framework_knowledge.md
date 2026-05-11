# Playwright Automation Framework

## Overview

This project is a scalable, maintainable end-to-end test automation framework built with Playwright and TypeScript. It supports CI integration (GitHub Actions) and generates detailed test reports (HTML, JUnit XML).

## Project Structure

playwright-automation/
│
├── tests/           # Test cases
├── pages/           # Page Object Model classes
├── fixtures/        # Test data and fixtures
├── utils/           # Helper utilities
├── config/          # Playwright configuration
├── reports/         # Test reports
├── .github/         # CI workflows
├── package.json     # Dependencies & scripts
├── tsconfig.json    # TypeScript config
├── README.md        # Project documentation
└── .gitignore       # Git ignore rules

# Getting Started
## 1. Install Dependencies
npm install

## 2. Install Playwright Browsers
npx playwright install

## 3. Run Tests
npm playwright test

## 4. View HTML Reportc
npx playwright show-report reports/html

# Configuration
Playwright config: config/playwright.config.ts
TypeScript config: tsconfig.json
Test directory: tests/
Reports: reports/html (HTML), reports/results.xml (JUnit XML)

# CI Integration
GitHub Actions workflow is defined in .github/workflows/ci.yml.
On every push or pull request to main, tests are executed and reports are uploaded as artifacts.

# Page Object Model
Page classes are located in pages/.
Example: LoginPage.ts encapsulates login page actions.

# Fixtures & Utilities
fixtures/: Reusable test data and setup/teardown logic.
utils/: Helper functions (e.g., logging, API helpers).

# Reporting
HTML Report: Detailed, interactive test results.
JUnit XML: For CI integration and test history.

# Extending the Framework
Add new tests in tests/.
Create new page objects in pages/.
Add fixtures and utilities as needed.
Update configuration files for custom settings.

# Useful Commands

| Command | Description |
| :-- | :-- |
| npm install | Install dependencies |
| npx playwright install | Install browsers |
| npx playwright test | Run all tests |
| npx playwright show-report | Open HTML report |


