# Setting up Selenium MCP Server in VS Code

**NOTE**: If you're new to MCP servers, follow this link [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

## Step 1: Setup the Project

### Initialize the Project

Create a new directory and initialize it with npm

  ```bash
  mkdir selenium-mcp-demo
  cd selenium-mcp-demo
  npm init -y
  ```

## Step 2: Open the project directory in VS Code

- Launch the VS Code and open the project directory created in Step 1 above
- Or use `code .` from the bash or cmd prompt to launch VS Code and open the project directory

## Step 3: Register the Server

### Register the Server

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

## Step 4: Test with GitHub Copilot

1. Start the server by clicking the "Start" button next to your server name (Selenium) in the MCP panel.
2. Switch to **Agent Mode** in the Copilot sidebar.
3. Ask: Copy paste the below prompt (An example prompt that generates test in Typescript - replace with a language of your choice)

```text
Use Selenium MCP tools to generate tests for the following scenario in Typescript
1. Open browser and navigate to SauceDemo website https://www.saucedemo.com
2. For the list of Accepted usernames available, generate login scenarios using page object model (POM) create login and home pages
3. Login with each specific user and validate homepage and logout and close browser
4. Execute the tests
```

Wait for the magic to happen!

The prompt should Open browser and execute the steps and generate tests.

This demonstrates how seamlessly MCP servers integrate with AI tools like GitHub Copilot.
