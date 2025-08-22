# Selenium MCP Server

A Model Context Protocol (MCP) server that provides comprehensive Selenium WebDriver automation tools for AI assistants and applications. This server enables automated web browser interactions, testing, and scraping through a standardized interface.

## 🚀 Overview

The Selenium MCP Server bridges the gap between AI models and web automation by providing a robust set of tools for browser control, element interaction, and web testing. Built with TypeScript and modern ES modules, it offers type-safe browser automation capabilities through the Model Context Protocol.

## ✨ Key Features

- **Multi-Browser Support**: Chrome, Firefox, and Edge browser automation
- **Comprehensive Element Interaction**: Click, type, hover, drag & drop, file uploads
- **Advanced Navigation**: Forward, backward, refresh, window management
- **Wait Strategies**: Intelligent waiting for elements and page states
- **Type Safety**: Full TypeScript implementation with Zod validation

## 🛠️ MCP Available Tools

### Browser Management Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_open` | Open a new browser session | `browser`, `options` |
| `browser_navigate` | Navigate to a URL | `url` |
| `browser_navigate_back` | Navigate back in history | None |
| `browser_navigate_forward` | Navigate forward in history | None |
| `browser_refresh` | Refresh the current page | None |
| `browser_resize` | Resize browser window | `width`, `height` |
| `browser_screenshot` | Take a screenshot | `filename` (optional) |
| `browser_close` | Close current browser session | None |

### Element Interaction Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_find_element` | Find an element on the page | `by`, `value`, `timeout` |
| `browser_click` | Click on an element | `by`, `value`, `timeout` |
| `browser_type` | Type text into an element | `by`, `value`, `text`, `timeout` |
| `browser_get_element_text` | Get text content of element | `by`, `value`, `timeout` |
| `browser_upload_file` | Upload file via input element | `by`, `value`, `filePath`, `timeout` |
| `browser_clear` | Clear text from an element | `by`, `value`, `timeout` |
| `browser_get_attribute` | Get element attribute value | `by`, `value`, `attribute`, `timeout` |

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

## 🚦 Getting Started

### Installation

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
npx selenium-mcp
```

## ⚙️ Configuration

### Browser Options

Configure browser-specific settings when opening a browser:

```javascript
// Chrome options example
{
  "browser": "chrome",
  "options": {
    "headless": false,
    "windowSize": {
      "width": 1920,
      "height": 1080
    },
    "args": [
      "--disable-web-security",
      "--disable-dev-shm-usage"
    ]
  }
}
```

### Supported Browser Options

- `headless`: Run browser in headless mode
- `windowSize`: Set initial window dimensions
- `args`: Additional browser arguments
- `binaryPath`: Custom browser binary path
- `userDataDir`: Custom user data directory

### Element Locator Examples

```javascript
// By ID
{ "by": "id", "value": "login-button" }

// By CSS Selector
{ "by": "css", "value": ".submit-btn" }

// By XPath
{ "by": "xpath", "value": "//button[text()='Submit']" }

// By Name
{ "by": "name", "value": "username" }

// By Class Name
{ "by": "class", "value": "error-message" }

// By Tag Name
{ "by": "tag", "value": "input" }
```

## 📖 Usage Examples

### Basic Web Automation

```javascript
// Open browser
await tool("browser_open", { 
  browser: "chrome", 
  options: { headless: false } 
});

// Navigate to website
await tool("browser_navigate", { 
  url: "https://example.com" 
});

// Find and click a button
await tool("browser_click", { 
  by: "id", 
  value: "submit-button" 
});

// Type in a form field
await tool("browser_type", { 
  by: "css", 
  value: "#username", 
  text: "myusername" 
});

```

## 🤝 Integration

### MCP Client Integration

Configure your MCP client to connect to the Selenium server:

```json
{
  "name": "selenium-mcp",
  "command": "node",
  "args": ["path/to/selenium-mcp/dist/index.js"]
}
```

### Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "selenium": {
      "command": "node",
      "args": ["C:/path/to/selenium-mcp/dist/index.js"]
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Browser not starting**:

- Ensure the target browser is installed
- Check browser binary path in options
- Verify no other processes are using the browser

**Element not found**:

- Increase timeout value
- Verify locator strategy and value
- Check if element is in an iframe
- Wait for page to fully load

**Module resolution errors**:

```bash
npm run clean
npm run build
npm start
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

- **1.0.0** - Initial release with comprehensive Selenium WebDriver integration
  - Multi-browser support (Chrome, Firefox, Edge)
  - Complete element interaction toolset
  - Advanced action capabilities
  - Type-safe TypeScript implementation
  - MCP protocol compliance

---

*Built with ❤️ for the Model Context Protocol ecosystem*
