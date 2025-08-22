# Selenium MCP Server

A Model Context Protocol (MCP) server for [Selenium](https://www.selenium.dev/) that provides comprehensive Selenium WebDriver automation tools for AI assistants and applications. This server enables automated web browser interactions, testing, and scraping through a standardized interface.

## 🚀 Overview

The Selenium MCP Server bridges the gap between AI models and web automation by providing a robust set of tools for browser control, element interaction, and web testing. Built with TypeScript and modern ES modules, it offers type-safe browser automation capabilities through the Model Context Protocol.

## ✨ Key Features

- **Multi-Browser Support**: Chrome, Firefox, and Edge browser automation
- **Comprehensive Element Interaction**: Click, type, hover, drag & drop, file uploads
- **Advanced Navigation**: Forward, backward, refresh, window management
- **Wait Strategies**: Intelligent waiting for elements and page states
- **Type Safety**: Full TypeScript implementation with Zod validation

## 🤝 Integration

### MCP Client Integration

Configure your MCP client to connect to the Selenium server:

### Standard Configuration (applicable to Windsurf, Warp, Gemini CLI etc)

```json
{
  "servers": {
    "Selenium": {
      "command": "npx",
      "args": ["-y", "selenium-webdriver-mcp"]
    }
  }
}
```

## Installation in VS Code

Update your `mcp.json` in **VS Code** with below configuration

**NOTE**: If you're new to MCP servers, follow this link [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)

### Example 'stdio' type connection

```json
{
  "servers": {
    "selenium": {
    "command": "npx",
    "args": [
      "-y",
      "selenium-webdriver-mcp"
    ],
    "type": "stdio"
    }
  },
  "inputs": []
}

```

### Example 'http' type connection

```json
{
  "servers": {
    "Selenium": {
      "url": "https://smithery.ai/server/@pshivapr/selenium-mcp",
      "type": "http"
    }
  },
  "inputs": []
}

```

After installation, the Selenium MCP server will be available for use with your GitHub Copilot agent in VS Code.

### To install the Selenium MCP server using the VS Code CLI

```bash
# For VS Code
code --add-mcp '{\"name\":\"Selenium\",\"command\": \"npx\",\"args\": [\"selenium-webdriver-mcp\"]}'

```

```bash
# For VS Code Insiders
vscode-insiders --add-mcp '{\"name\":\"Selenium\",\"command\": \"npx\",\"args\": [\"selenium-webdriver-mcp\"]}'
```

## To install the package using either npm, or Smithery

Using npm:

```bash
npm install -g selenium-webdriver-mcp
```

Using Smithery

To install Selenium MCP for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@pshivapr/selenium-mcp):

```bash
npx @smithery/cli install @pshivapr/selenium-mcp --client claude
```

## Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "Selenium": {
      "command": "npx",
      "args": ["-y", "selenium-webdriver-mcp"]
    }
  }
}
```

## Screenshot

![Selenium + Claude](images/Claude-example.png)

## 🛠️ MCP Available Tools

### Browser Management Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_open` | Open a new browser session | `browser`, `options` |
| `browser_navigate` | Navigate to a URL | `url` |
| `browser_navigate_back` | Navigate back in history | None |
| `browser_navigate_forward` | Navigate forward in history | None |
| `browser_title` | Get the current page title | None |
| `browser_refresh` | Refresh the current page | None |
| `browser_resize` | Resize browser window | `width`, `height` |
| `browser_switch_tab_or_window` | Switch to a tab or window | `handle` |
| `browser_switch_to_original_window` | Switch to the original window | None |
| `browser_close` | Close current browser session | None |

### Element Interaction Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_find_element` | Find an element on the page | `by`, `value`, `timeout` |
| `browser_click` | Click on an element | `by`, `value`, `timeout` |
| `browser_type` | Type text into an element | `by`, `value`, `text`, `timeout` |
| `browser_get_element_text` | Get text content of element | `by`, `value`, `timeout` |
| `browser_file_upload` | Upload file via input element | `by`, `value`, `filePath`, `timeout` |
| `browser_clear` | Clear text from an element | `by`, `value`, `timeout` |
| `browser_get_attribute` | Get element attribute value | `by`, `value`, `attribute`, `timeout` |
| `browser_element_is_displayed` | Check if element is displayed | `by`, `value`, `timeout` |
| `browser_switch_to_frame` | Switch to a frame by locator | `by`, `value`, `timeout`, `timeout` |

### Advanced Action Tools  

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_hover` | Hover over an element | `by`, `value`, `timeout` |
| `browser_double_click` | Double-click on an element | `by`, `value`, `timeout` |
| `browser_right_click` | Right-click (context menu) | `by`, `value`, `timeout` |
| `browser_drag_and_drop` | Drag from source to target | `by`, `value`, `targetBy`, `targetValue`, `timeout` |
| `browser_wait_for_element` | Wait for element to appear | `by`, `value`, `timeout` |
| `browser_scroll_to_element` | Scroll element into view | `by`, `value`, `timeout` |
| `browser_execute_script` | Execute JavaScript code | `script`, `args` |
| `browser_screenshot` | Take a screenshot | `filename` (optional) |
| `browser_select_dropdown_by_text` | Select dropdown option by visible text | `by`, `value`, `text`, `timeout` |
| `browser_select_dropdown_by_value` | Select dropdown option by value | `by`, `value`, `dropdownValue`, `timeout` |
| `browser_key_press` | Press a keyboard key in the browser | `key`, `timeout` |

### Element Locator Strategies

- **`id`**: Find by element ID
- **`css`**: Find by CSS selector
- **`xpath`**: Find by XPath expression
- **`name`**: Find by name attribute
- **`tag`**: Find by HTML tag name
- **`class`**: Find by CSS class name

## 📋 Requirements

- **Node.js**: Version 18.0.0 or higher
- **Browsers**: Chrome, Firefox, or Edge installed
- **WebDrivers**: Automatically managed by selenium-webdriver
- **Operating System**: Windows, macOS, or Linux

## 🚦 Development

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pshivapr/selenium-mcp.git
   cd selenium-mcp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

### Running the Server

#### Production Mode

```bash
npm start
```

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Direct Execution

```bash
node dist/index.js
```

### Using as CLI Tool

After building, you can use the server as a global command:

```bash
npx selenium-webdriver-mcp
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Version History

- **0.1.8** - Selenium MCP Server
  - Multi-browser support (Chrome, Firefox, Edge)
  - Complete element interaction toolset
  - Advanced action capabilities
  - Type-safe TypeScript implementation
  - MCP protocol compliance

---

*Built with ❤️ for the Model Context Protocol ecosystem*
