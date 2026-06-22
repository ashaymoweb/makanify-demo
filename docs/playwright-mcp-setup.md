# Step 1: Connect Playwright MCP in Cursor

This guide covers the first setup step for browser automation and E2E testing of the Makanify demo using the official [Playwright MCP server](https://playwright.dev/docs/getting-started-mcp).

## Prerequisites

- **Node.js 18+** (20+ recommended) — check with `node --version`
- **Cursor IDE** 0.45+ with MCP support
- **npm** available on your PATH

## What Playwright MCP does

Playwright MCP gives the Cursor agent browser tools (navigate, click, fill forms, take snapshots, etc.) without writing test scripts manually. It uses accessibility snapshots instead of screenshots, so it works well for automating the demo login and contacts flows.

---

## Option A — Project-level config (recommended)

Use this when you only want Playwright MCP for the `makanify-demo` repo.

### 1. Create the MCP config file

Create `.cursor/mcp.json` at the **repo root** (`makanify-demo/`, not inside `demo/`):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

> The `-y` flag tells `npx` to download the package without prompting.

### 2. Restart Cursor

Quit and reopen Cursor, or go to **Settings → MCP** and toggle the Playwright server off/on.

### 3. Verify the connection

1. Open **Cursor Settings → MCP** (or **Tools & MCP**)
2. Find **playwright** in the server list
3. Status should be **green / connected**
4. You should see tools like `browser_navigate`, `browser_click`, `browser_snapshot`, etc.

If the status is red, open **View → Output**, select the **MCP** channel, and read the error log.

---

## Option B — Global config (all projects)

If you want Playwright MCP in every Cursor workspace, add the same JSON to:

| OS      | Path                    |
|---------|-------------------------|
| Windows | `%USERPROFILE%\.cursor\mcp.json` |
| macOS   | `~/.cursor/mcp.json`    |
| Linux   | `~/.cursor/mcp.json`    |

Create the file if it does not exist. Merge the `playwright` entry into the existing `mcpServers` object if you already have other servers.

---

## Option C — Cursor UI (no file edit)

1. Open **Cursor Settings → MCP**
2. Click **Add new MCP Server** (or **Add Custom MCP**)
3. Set:
   - **Name:** `playwright`
   - **Type:** `command`
   - **Command:** `npx @playwright/mcp@latest`
4. Save and restart Cursor

---

## Optional configuration

### Headless mode (no visible browser)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--headless"]
    }
  }
}
```

### Use Firefox instead of Chromium

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--browser=firefox"]
    }
  }
}
```

### HTTP transport (headed browser on a separate process)

If the browser does not open from inside Cursor, start the server manually:

```bash
npx @playwright/mcp@latest --port 8931
```

Then point MCP at the HTTP endpoint:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

---

## Install browser binaries (first run)

On first use, Playwright may need to download browser binaries. Run once in a terminal:

```bash
npx playwright install
```

Or let the MCP server trigger the install on first launch.

---

## Test that it works

After connecting MCP:

1. Start the demo app:

   ```bash
   cd demo
   npm run dev
   ```

2. In Cursor Agent chat, ask something like:

   > Open http://localhost:3000/login in the browser, fill in the login form, and take a snapshot.

3. The agent should use Playwright MCP tools to drive the browser.

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| Red dot / server not connected | Restart Cursor; validate JSON in `.cursor/mcp.json` (no trailing commas) |
| `spawn npx ENOENT` | Node/npm not on PATH for Cursor — use full path to `npx` in config, or launch Cursor from a terminal |
| No tools listed | Check **Output → MCP** for crash logs; run `npx -y @playwright/mcp@latest` manually in terminal |
| Browser never opens | Try `--headless` or use HTTP transport on port `8931` |
| Too many MCP servers | Cursor caps visible tools (~40); disable unused MCP servers |

### Validate config manually

```bash
npx -y @playwright/mcp@latest
```

If this fails in your terminal, fix Node/npm first before expecting Cursor to connect.

---

## Next steps

Once Playwright MCP is connected:

- **Step 2** — Add Playwright test project (`@playwright/test`) to the demo
- **Step 3** — Write E2E tests for login and contacts
- **Step 4** — Run tests in CI

---

## References

- [Playwright MCP docs](https://playwright.dev/docs/getting-started-mcp)
- [microsoft/playwright-mcp on GitHub](https://github.com/microsoft/playwright-mcp)
- [Cursor MCP install link for Playwright](https://cursor.com/en/install-mcp?name=Playwright&config=eyJjb21tYW5kIjoibnB4IEBwbGF5d3JpZ2h0L21jcEBsYXRlc3QifQ%3D%3D)
