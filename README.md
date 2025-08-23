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


## LLMs files

Most of this section has been copied from https://llms-txt.io/faq

### What is a llms.txt file?

The llms.txt file is a new web standard that provides AI systems with a streamlined, easy-to-understand version of your website content. It helps large language models (LLMs) overcome context window limitations by delivering essential information in a clean, focused format.

### Format
The llms.txt format uses simple markdown that both humans and AI can read:

- H1 title defines the project or site name
- Blockquote provides a concise summary
- H2 headers organize documentation sections
- Optional section marks secondary resources
- Clear links to important content

## Do i need both llms.txt and llms-full.txt?

While llms.txt provides navigation structure, the optional llms-full.txt contains complete documentation content. For simpler websites, llms.txt alone is usually sufficient. For documentation sites, having both can be beneficial for AI comprehension.
