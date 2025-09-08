# Quick start: MCP Server setup in VS Code

## Prerequisites

1. Install the latest version of [Visual Studio Code](https://code.visualstudio.com/download) and enable MCP support in VS Code with the chat.mcp.enabled setting
2. Access to [Copilot](https://code.visualstudio.com/docs/copilot/setup)
3. Install the latest [Nodejs](https://nodejs.org/en/download/) and able to run npm & npx commands

**NOTE**: If you're new to MCP servers, follow this link [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

## Step 1: Create new Project Directory and Open in VS Code

- Create new Project Directory and Open in VS Code

  ```bash
  mkdir my-mcp-server
  cd my-mcp-server
  ```

- Launch the VS Code and open the project directory created above Or
Use `code .` from the bash or cmd prompt to launch VS Code and open the project directory

## Step 2: Register the Server

1. Open the VS Code Command Palette (`Cmd/Ctrl + Shift + P`).
2. Type **"MCP: Add Server"**.
3. Choose **"Command (stdio)"**.
4. Enter the command: `npx -y selenium-webdriver-mcp@latest`.
5. Give it a name like `selenium-mcp`.
6. Choose **Global** for all projects or Choose **Workspace** for just this project setup.

This creates a `.vscode/mcp.json` file in your project:

```json
{
  "servers": {
    "selenium-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "selenium-webdriver-mcp@latest"
      ],
      "type": "stdio"
    }
  },
  "inputs": []
}

```

## Step 3: Test with GitHub Copilot

1. Start the server by clicking the "Start" button next to your server name (selenium-mcp) in the MCP panel.
2. Toggle Chat window (if Chat isn't opened or Ctrl + Shift +I) and Switch to Agent Mode in the Copilot sidebar.
3. Prompt Text: Copy paste the below prompt (replace with a programming language of your choice - Java, JavaScript, Python, C#)

```text
Use Selenium MCP tools to generate tests for the following scenario in <YOUR_FAVOURITE_PROGRAMMING_LANGUAGE>
1. Open browser and navigate to SauceDemo website https://www.saucedemo.com
2. For the list of Accepted usernames available, generate login scenarios using page object model (POM) create login and home pages
3. Login with each specific user and validate homepage and logout and close browser
4. Execute the tests
```

Wait for the magic to happen!

The prompt should Open browser and execute the steps and generate tests. It first executes the steps (click 'Continue' few times if the agent is not set up for auto instructions), after finishing the Agent will start creating the framework and adds relevant directory structure, and tests depending on the programming language chosen!

This demonstrates how seamlessly MCP servers integrate with AI tools like GitHub Copilot.
