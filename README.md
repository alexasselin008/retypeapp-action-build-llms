# Retype Build LLMS Action

A GitHub Action to build both a `llms.txt` and `llms-full.txt` files for a [Retype](https://retype.com/) powered website. The output of this action is then made available to subsequent workflow steps, such as publishing to GitHub Pages using the [retypeapp/action-github-pages](https://github.com/retypeapp/action-github-pages) action.


## Introduction
This action runs over the files in a repository to build a  `llms.txt` and `llms-full.txt` which are files that are optimized for AI reasoning engines that need to understand your content.

After the action completes, it will export the `retype-output-path value` for the next steps to handle the output. The output files can then be pushed back to GitHub, or sent by FTP to another web server, or any other form of website publication target.

This action will look for a [retype.yml](https://retype.com/configuration/project/) file in the repository root.

## Usage

```yaml
steps:
- uses: actions/checkout@v4

- uses: actions/setup-dotnet@v4
  with:
    dotnet-version: 9.0.x

- uses: retypeapp/action-build@latest

- uses: alexasselin008/retypeapp-action-build-llms@latest

- uses: retypeapp/action-github-pages@latest
  with:
    branch: retype
    update-branch: true
```
