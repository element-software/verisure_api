# Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Install Node.js (if not already installed)
```bash
# On macOS using Homebrew
brew install node

# On Ubuntu/Debian
sudo apt-get install nodejs npm

# On Windows, download from https://nodejs.org/
```

### 2. Clone and Setup the Repository
```bash
git clone https://github.com/element-software/verisure_api
cd verisure_api
npm install
```

### 3. Build the Project
```bash
npm run build
```

## Running the CLI

### Option 1: Using TypeScript Directly (Development)
```bash
npm run dev
```

This will start the interactive CLI immediately without compilation.

### Option 2: Using Compiled JavaScript
```bash
npm start
```

This runs the pre-compiled version from the `dist/` folder.

### Option 3: After Global Installation
Once installed globally (via npm), you can run:
```bash
securitas
```

## First Time Usage

1. **Start the CLI**: Run one of the commands above
2. **Enter your credentials**: Provide your Securitas Direct username and password
3. **Access features**:
   - View your alarm installations
   - Check current alarm status
   - Arm/Disarm the alarm
   - View connected devices
   - Check event history
   - Manage settings

## Using as a Library

### Step 1: Import the Client
```typescript
import { SecuritasDirectClient } from './dist/lib';

const client = new SecuritasDirectClient();
```

### Step 2: Authenticate

**SECURITY WARNING:** Never hardcode credentials in your code! Always use environment variables.

```typescript
const result = await client.authenticate({
  username: process.env.SECURITAS_USERNAME || '',
  password: process.env.SECURITAS_PASSWORD || '',
});

if (!result.success) {
  console.error('Authentication failed');
  process.exit(1);
}
```

### Step 3: Use the API
```typescript
// Get installations
const installations = await client.getInstallations();
const installationId = installations[0].installationId;

// Check status
const status = await client.getStatus(installationId);
console.log(`Alarm is ${status.armState}`);

// Arm alarm
await client.arm(installationId);

// Disarm alarm
await client.disarm(installationId);

// Get devices
const devices = await client.getDevices(installationId);

// Get events
const events = await client.getEvents(installationId, 10);

// Logout
client.logout();
```

See `example.ts` for a complete working example.

## Common Commands

### Check Alarm Status
```bash
npm start
# Then select option 2: "Check Alarm Status"
```

### Arm the Alarm
```bash
npm start
# Then select option 3: "Arm Alarm"
```

### Disarm the Alarm
```bash
npm start
# Then select option 4: "Disarm Alarm"
```

### View Devices
```bash
npm start
# Then select option 5: "View Devices"
```

## Configuration

Your credentials and settings are automatically saved in:
```
~/.securitas-config.json
```

**⚠️ SECURITY WARNING:**
This file contains:
- Your username
- Your password (stored in plain text - HIGH SECURITY RISK)
- Your last used installation ID

**Recommendations:**
- Set file permissions: `chmod 600 ~/.securitas-config.json`
- Consider using environment variables instead
- Never commit this file to version control
- Be aware this file contains sensitive credentials in plain text

## Troubleshooting

### "Cannot find module" errors
Make sure you've run:
```bash
npm install
npm run build
```

### Authentication fails
- Double-check your Securitas Direct username and password
- Make sure you have internet connectivity
- The Securitas Direct API might be temporarily unavailable

### Port already in use (if running as server)
This CLI tool doesn't use any ports by default, so this shouldn't occur.

### Permission denied error
If you get a permission error when running `securitas` command:
```bash
chmod +x dist/cli/index.js
```

## Need Help?

1. Check the main [README.md](README.md) for detailed API documentation
2. See [example.ts](example.ts) for code examples
3. Open an issue on GitHub

## Next Steps

- Read the full [API documentation](README.md#api-reference)
- Explore the [example code](example.ts)
- Check [Contributing guidelines](CONTRIBUTING.md) if you want to contribute
- Review the source code in [src/lib/client.ts](src/lib/client.ts)
