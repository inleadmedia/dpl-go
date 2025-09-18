![GO logo](../public/icons/logo-white-readme.svg)

<p>
  <br/>
  Website for the public library that uses <a href="https://nextjs.org" target="_blank">Next.js</a> with the <a href="https://nextjs.org/docs/app" target="_blank">App Router</a> for the frontend and <a href="https://www.drupal.org/" target="_blank">Drupal</a> for content management.
  <br>
  Drupal CMS can be accessed through Lagoon by generating a one-time login in the preferred environment.
  <br>
  <br>
</p>

## URLs

| Description                                             | URL                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| Demo site (may change)                                  | <https://node.pr-1707.dpl-cms.dplplat01.dpl.reload.dk/>    |
| Demo site Drupal CMS (may change, login through lagoon) | <https://varnish.pr-1707.dpl-cms.dplplat01.dpl.reload.dk/> |

## Table of contents

- [URLs](#urls)
- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Technical Overview](#technical-overview)
  - [Project structure](#project-structure)
  - [git workflows](#git-workflows)
- [Development](#development)
  - [UI components from shadcn/ui](#ui-components-from-shadcnui)
  - [Tailwind](#tailwind)
  - [Codegen](#codegen)
  - [Codegen types](#codegen-types)
  - [Custom types](#custom-types)
  - [xState](#xstate)
  - [Config handling](#config-handling)
  - [Storybook](#storybook)
  - [Cypress](#cypress)
- [Test production database locally](#test-production-database-locally)
- [Deployment](#deployment)
  - [git branches and pull requests](#git-branches-and-pull-requests)
  - [Create pull request](#create-pull-request)
  - [Reviewing a PR](#reviewing-a-pr)
  - [Updating the demo site](#updating-the-demo-site)
    - [Create a release tag in dpl-go based on sprint number](#create-a-release-tag-in-dpl-go-based-on-sprint-number)
    - [Deploying a release](#deploying-a-release)
- [Quality assurance](#quality-assurance)
  - [GitHub Workflows for quality assurance](#github-workflows-for-quality-assurance)
- [Developers](#developers)

## Getting started

### Prerequisites

- Use the node version registered in the [`.nvm`] file
- Preferably managed by [`nvm`](https://github.com/nvm-sh/nvm)
- This project uses [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) make sure to have this installed globally on your machine

### Setup

1. Make sure you are using the correct Node version:

```bash
nvm use
```

2. Install dependencies:

```bash
yarn
```

3. Start the development server:

We run the server in an [experimental https](https://nextjs.org/docs/pages/api-reference/cli/next#next-dev-options) state to not get blocked by CORS policy when developing locally.

```bash
yarn dev:https
```

The application is now running at [https://localhost:3000](https://localhost:3000)

4. Set up the Drupal CMS ([dpl-cms][dpl-cms]) locally to access configuration variables for the Go app. Ensure the `NEXT_PUBLIC_GRAPHQL_SCHEMA_ENDPOINT_DPL_CMS` variable in the `.env.local` file points to the correct endpoint.

## Technical Overview

- [Next.js][nextjs] with the [App Router][app-router]
- [React][react]
- [React Query][react-query]
- [TypeScript][typescript]
- [shadcn/ui][shadcn]
- [Tailwind CSS][tailwind]
- [ESLint][eslint] & [Prettier][prettier]
- [Storybook][storybook] & [Chromatic][chromatic]
- [cypress][cypress]
- [Vitest][vitest]

### Project structure

In the project, you'll see the following folders and files:

| File(s)                  | Description                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \_\_tests\_\_/\*         | Unit tests for the application components and utilities. Using [vitest][vitest]                                                                           |
| .github/\*               | GitHub configuration files and workflows                                                                                                                  |
| .storybook/\*            | Configuration files and stories for Storybook                                                                                                             |
| .vscode.example/\*       | Example settings and recommendations for Visual Studio Code workspace                                                                                     |
| app/\*                   | Routes for the [App Router][app-router]                                                                                                                   |
| components/global/\*     | Components that should always be rendered on the page                                                                                                     |
| components/pages/\*      | For page layout components used as children on routes (Useful when making API calls server-side on the route and render page layouts as child components) |
| components/paragraphs/\* | Components named according to Drupal CMS conventions for editorial sections on a page                                                                     |
| components/shadcn/\*     | Imported [shadcn/ui][shadcn] components                                                                                                                   |
| components/shared/\*     | Reusable components that can be optionally used across various other components                                                                           |
| hooks/\*                 | Custom React hooks                                                                                                                                        |
| lagoon/\*                | TODO: add description                                                                                                                                     |
| lib/\*                   | Library utilities and configurations                                                                                                                      |
| lib/config/\*            | Centralized access to environment variables and CMS configuration settings                                                                                |
| lib/graphql/\*           | GraphQL-related utilities and configurations                                                                                                              |
| lib/graphql/fetchers/\*  | Custom fetch functions used for fetching data through [React Query][react-query]                                                                          |
| lib/graphql/fragments/\* | GraphQL fragments used to define reusable pieces of data queries                                                                                          |
| lib/graphql/generated/\* | Auto-generated GraphQL types and queries based on the GraphQL schema                                                                                      |
| lib/graphql/queries/\*   | Custom GraphQL queries used throughout the application                                                                                                    |
| lib/helpers/\*           | Utility functions and helpers used across the application                                                                                                 |
| lib/machines/\*          | State machines and related logic for managing complex state transitions through [xstate][xstate]                                                          |
| lib/providers/\*         | Context providers and related logic for managing global state and dependencies                                                                            |
| lib/rest/\*              | REST API-related utilities and configurations                                                                                                             |
| lib/rest/publizon-api/\* | Custom functions and configurations for interacting with the Publizon API                                                                                 |
| lib/session/\*           | Session management utilities and configurations                                                                                                           |
| lib/shadcn/\*            | Utilities for shadcn/ui components                                                                                                                        |
| lib/types/\*             | Manually added types used throughout the application                                                                                                      |
| public/\*                | Non-code, unprocessed assets (fonts, icons, etc.)                                                                                                         |
| styles/\*                | Global [Tailwind] CSS files                                                                                                                               |
| .editorconfig/           | Configuration file for maintaining consistent coding styles between different editors and IDEs                                                            |
| .env.example             | Example environment variables file                                                                                                                        |
| .env.local               | Local environment variables file, specific to your development environment (git ignored)                                                                  |
| .env.test                | Environment variables file for testing                                                                                                                    |
| .eslintignore            | File specifying which files and directories to ignore by ESLint                                                                                           |
| .eslintrc.json           | Configuration file for ESLint rules and settings                                                                                                          |
| .gitignore               | Specifies intentionally untracked files to ignore                                                                                                         |
| .nvmrc                   | Node version manager configuration file                                                                                                                   |
| .prettierignore          | File specifying which files and directories to ignore by Prettier                                                                                         |
| codegen.ts               | Configuration file for generating code based on GraphQL schema                                                                                            |
| components.json          | Configuration file for defining and managing component metadata (necessary when installing shadcn components)                                             |
| next.config.mjs          | Next.js configuration file                                                                                                                                |
| orval.config.ts          | Configuration file for Orval, a tool for generating API clients from OpenAPI specifications                                                               |
| package.json             | Contains metadata about the project and its dependencies, scripts, and other configurations                                                               |
| postcss.config.mjs       | Configuration file for PostCSS, a tool for transforming CSS with JavaScript plugins (necessary for Tailwind to compile)                                   |
| tailwind.config.ts       | [Tailwind] CSS configuration file                                                                                                                         |
| Taskfile.yml             | Task automation file used to define and run tasks                                                                                                         |
| tsconfig.json            | TypeScript configuration file                                                                                                                             |
| vitest.config.ts         | Configuration file for [Vitest][vitest]                                                                                                                   |
| yarn.lock                | Lockfile for Yarn, ensuring consistent installs across different environments                                                                             |

### git workflows

| File(s)                | Description                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| accessibility-test.yml | Runs accessibility tests using Axe and Lighthouse to ensure the application meets accessibility standards.                  |
| chromatic.yml          | Runs Chromatic to visualize and test UI components in Storybook, ensuring that changes do not introduce visual regressions. |
| eslint-check.yml       | Runs ESLint to check for code quality and adherence to coding standards.                                                    |
| prettier-check.yml     | Runs Prettier to ensure code formatting consistency across the project.                                                     |
| publish-source.yml     | Publishes the source code to the specified repository or platform.                                                          |
| type-check.yml         | Runs TypeScript to check for type errors and ensure type safety across the project.                                         |
| unit-test.yml          | Runs unit tests using Vitest to ensure that individual components and utilities function correctly.                         |

## Development

### UI components from shadcn/ui

We use [shadcn/ui][shadcn] to speed up the development of UI components. Imported components are located in [/components/shadcn](./components/shadcn/).

If you're developing a component that requires additional logic beyond the initially installed component styles or logic, copy the imported code into a new component in the [/components/shared](./components/shared/) folder. This ensures that components imported by shadcn do not replace previously installed components.

### Tailwind

We use Tailwind CSS to style the project. Tailwind's predefined classes are configured in the `tailwind.config.ts` file, which references CSS variables defined in the `globals.css` file. This ensures that CSS variables are accessible through both CSS and Tailwind classes when developing components. When creating new variables, add the style as a variable in the `globals.css` file and include this variable in the Tailwind config. Additionally, the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension provides autocomplete features for a smoother development experience.

When introducing new classes, make sure to reuse existing ones and maintain consistency. Use the grid system for placing elements and apply the predefined spacing variables consistently.

### Codegen

In this project, we use codegen to generate GraphQL types and queries, which helps streamline the development process and maintain a high level of code quality.

### Codegen types

Codegen types are automatically generated TypeScript types based on the specific API schema. These types ensure type safety and provide autocompletion features when working with GraphQL queries and mutations.

To generate the types, run the following command:

```bash
yarn codegen:all-rest-services
```

The custom functions and configurations for these services are located in the `lib/rest` directory.

```bash
yarn codegen:graphql
```

This will create or update the types in the `lib/graphql/generated` directory.

```bash
yarn codegen:publizon
```

The `lib/rest/publizon-api` directory contains functions and configurations for interacting with the Publizon API. This API is used to manage and retrieve information about digital publications.

### Custom types

Custom types are manually defined TypeScript types that are used throughout the application to ensure type safety and improve code readability.

When creating a custom type, please write a `T` before the name of the type to refer to the variable as a type. This helps to avoid confusion between types and other functionalities.

To add a custom type, create a new file in the `lib/types` directory and define your types using TypeScript's `type` or `interface` keywords.

### xState

Read about xState [here](architecture/adr-002-xstate.md).

### Config handling

Read about configuration [here](architecture/adr-001-configuration.md).

### Storybook

Storybook is an essential tool in our development workflow for several reasons:

1. **Component Isolation**: It allows us to develop and test UI components in isolation, ensuring that each component works as expected without dependencies on the rest of the application.
2. **Visual Documentation**: Storybook provides a visual representation of our components, making it easier for developers and designers to understand and collaborate on the UI.
3. **Automated Testing**: With integrations like Chromatic, we can automate visual regression testing to catch UI changes and bugs early in the development process.
4. **Reusable Components**: By documenting components in Storybook, we promote reusability and consistency across the application, reducing duplication and improving maintainability.

To start Storybook, run the following command:

```bash
yarn storybook
```

This will launch the Storybook server, and you can view the component library in your browser at [http://localhost:6006](http://localhost:6006).

**_We create Storybook stories strictly on a "render component" basis. This means focusing on smaller atomic components that are not specific to generated code._**

### Cypress

Cypress is an end-to-end testing framework that allows us to write and run tests for the application's core user journeys.

To start Cypress, run the following commands:

```bash
yarn dev # Start the development server
yarn cypress:run # Run all Cypress tests
```

## Test production database locally

To test the production database locally, you need to download a copy of the production database to your local development environment. This allows you to debug issues and verify features using real data, while ensuring that your local changes do not affect the live environment.

Follow these steps to test the production database locally:

1. **Obtain a database and if necessary a file dump and import it to local dpl-cms environment**:

   Follow the guide in DPL-CMS:

   <https://danskernesdigitalebibliotek.github.io/dpl-docs/DPL-CMS/local-development/?h=database#download-database-and-files-from-lagoon>

2. **Update CMS user credentials**: In your local DPL-CMS, go to the "People" tab and find the user named `go_graphql`. Click "Edit" for this user. Update the password field to match the value of `NEXT_PUBLIC_GO_GRAPHQL_CONSUMER_USER_PASSWORD` from your `.env.local` file in this project.
   **Note:** Occasionally, the password update may not take effect as expected. If you encounter this issue, repeat step 1 and try again.

3. **Start the application**: Launch your development server as usual. The application should now display data from the imported production database.

### NOTES

- Before testing, clear all cookies from your browser to avoid potential issues caused by existing cookies.
- If you are testing login functionality, make sure the local domain is whitelisted for the relevant library in STIL.
- To configure "adgangsplatform" tokens and Unilogin for local development, run:
  ```bash
  task dev:openid:configure && task dev:unilogin:configure
  ```
  This will set up authentication using materials from the Copenhagen library.
- As webmaster libraries can add their own modules, it can sometimes be necessary to download a copy of their file system as well as the database. The reason for this is, that a database import will not be successful if it can't find all modules.

## Deployment

### git branches and pull requests

We follow a specific Git branching model as the project is currently in development mode and not yet live. The main branches are:

- `main`: Used for deploying code to the demo environment. (In the future this will be the production branch)
- Feature branches are created from `main` and are named using the following convention:

```bash
DDFBRA-220-opstart-dokumentation
```

- `DDFBRA`: Workspace in Jira
- `220`: Ticket number
- `opstart-dokumentation`: Ticket title

Gotha: When creating a branch, use the Jira tickets `create branch` button to create a branch that refers to the ticket.

When a feature is complete, all test are passing and a review process has taken place, it is merged back into `main`.

### Create pull request

When creating a pull request, follow these steps:

1. Create a new pull request `feature`->`main`.
2. Add relevant information to the PR template. At a minimum, include a link to the ticket (if available) and a description.
3. Resolve any merge conflicts, fix errors in workflows, and check Chromatic to ensure new changes do not cause conflicts in the app. The PR creator is responsible for these checks.
4. Await approval from a relevant team member for the changes to the code.
5. Merge the code to `main` and delete the feature branch to clean up.

### Reviewing a PR

1. Review the code changes to ensure they meet the project's coding standards and requirements.
2. Provide constructive feedback and request any necessary changes. **Suggestions** are optional for the creator to fix, while **change requests** must be addressed.
3. Approve the PR if everything looks good, or request changes if there are issues that need to be addressed.

### Updating the demo site

#### Create a release tag in dpl-go based on sprint number

1. Navigate to the github project and go to the releases page
2. Click **Draft a new release**
3. Create a new release with the tag format `0.<sprint_number>.<incremental_release_count>` (e.g., for sprint 7, the tag would be `0.7.0`).
4. This will trigger the `publish-source` workflow in the repository

#### Deploying a release

1. Navigate to the `dpl-cms` repository.
2. Pull the latest changes from the `develop` branch locally.
3. Switch to the `dpl-go-demo` branch and merge the `develop` branch into it.
4. Update the `dpl-go` package version locally to the latest release and push the changes upstream.
5. Edit the `Docker-compose.yml` file with the following changes:

```yaml
node:
  image: ghcr.io/danskernesdigitalebibliotek/dpl-go-node:0.<sprint_number>.<incremental_release_count>
  labels:
    lagoon.type: node
    provenance: false
```

## Quality assurance

Quality assurance (QA) is a critical aspect of our development process, ensuring that the application meets the required standards and functions correctly. By implementing robust QA practices, we can identify and address issues early, maintain code quality, and deliver a reliable product to users.

**_As an overall rule of thumb, we add different levels of quality assurance depending on the given problem._**

#### GitHub Workflows for quality assurance

1. **Automated Unit Testing**: Workflows like `unit-test.yml` run unit tests automatically, ensuring that individual components and utilities function correctly. This helps catch bugs early in the development process.

2. **End-to-end Testing**: Workflows such as `e2e-test.yml` run end-to-end tests using Cypress to simulate user interactions and test the application's core user journeys. This helps ensure that the application and important features work as expected. This also helps catch bugs early in the development process.

3. **Code Quality Checks**: Workflows such as `eslint-check.yml` and `prettier-check.yml` enforce coding standards and consistent formatting. This ensures that the codebase remains clean, readable, and maintainable.

4. **Type Safety**: The `type-check.yml` workflow runs TypeScript checks to ensure type safety across the project. This helps prevent type-related errors and improves code reliability.

5. **Accessibility Testing**: The `accessibility-test.yml` workflow runs accessibility tests on each [Storybook] Story using [Axe] through [Playwright]. This ensures that the application meets accessibility standards and provides a better user experience for all users.

6. **Visual Regression Testing**: The `chromatic.yml` workflow runs Chromatic to visualize and test UI components in [Storybook]. This helps catch visual regressions and ensures that UI changes do not introduce unexpected issues.

## Developers

- Adam Antal - <adam@reload.dk>
- Mikkel Jakobsen - <mikkel@reload.dk>
- Thomas Gross Rasmussen - <tgr@reload.dk>
- Jacob Pihl - <jacob@reload.dk>

[nextjs]: https://nextjs.org/
[app-router]: https://nextjs.org/docs/app
[react]: https://react.dev/
[shadcn]: https://ui.shadcn.com/
[typescript]: https://www.typescriptlang.org/
[tailwind]: https://tailwindcss.com/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[storybook]: https://storybook.js.org/
[chromatic]: https://www.chromatic.com/
[react-query]: https://tanstack.com/query/latest/docs/framework/react/overview
[xstate]: https://xstate.js.org/
[vitest]: https://vitest.dev/
[axe]: https://playwright.dev/docs/accessibility-testing
[playwright]: https://playwright.dev/
[cypress]: https://www.cypress.io/
[dpl-cms]: https://github.com/danskernesdigitalebibliotek/dpl-cms
