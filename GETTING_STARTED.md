# Securitas Direct API - Complete Setup & Usage Guide

## ✅ Project Complete

Your Securitas Direct API TypeScript project is now ready to use! Here's everything that's included:

## 📦 What's Included

### Core Library (`src/lib/`)
- **client.ts** - Full-featured API client with all Securitas Direct operations
- **types.ts** - Complete TypeScript interfaces for type-safe development
- **constants.ts** - API endpoints, states, and error codes
- **index.ts** - Clean library exports

### Interactive CLI (`src/cli/`)
- **index.ts** - Full-featured menu-driven command-line interface
- Credential management
- Interactive installation selection
- Alarm control (arm/disarm with multiple modes)
- Device monitoring
- Event history viewer
- Settings management

### Compiled Output (`dist/`)
- Production-ready JavaScript code
- TypeScript declarations (.d.ts files)
- Source maps for debugging
- Executable CLI entry point

### Documentation
- **README.md** - Complete API documentation
- **QUICKSTART.md** - 5-minute setup guide
- **CONTRIBUTING.md** - Development guidelines
- **PROJECT_STRUCTURE.md** - Detailed project layout
- **example.ts** - Working code examples
- **LICENSE** - MIT License

## 🚀 Getting Started (30 seconds)

### 1. Build the Project
```bash
npm run build
```

### 2. Run the Interactive CLI
```bash
npm start
```

### 3. Enter Your Credentials
- Use your Securitas Direct username and password
- The CLI will guide you through the menu

## 📋 Features Available

### In the CLI
1. ✅ Authenticate with Securitas Direct
2. ✅ View all your alarm installations
3. ✅ Check current alarm status
4. ✅ Arm alarm (Full, Night, or Partial modes)
5. ✅ Disarm alarm
6. ✅ View connected devices
7. ✅ Check event/activity history
8. ✅ Manage credentials and settings

### As a Library
Use in your own TypeScript/JavaScript projects:
```typescript
import { SecuritasDirectClient } from 'securitas-direct-api';

const client = new SecuritasDirectClient();

// SECURITY: Always use environment variables for credentials
const username = process.env.SECURITAS_USERNAME || '';
const password = process.env.SECURITAS_PASSWORD || '';

await client.authenticate({ username, password });
const status = await client.getStatus(installationId);
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Run CLI with TypeScript directly (development)
npm run dev

# Run compiled CLI
npm start

# Run tests (placeholder)
npm test
```

## 📁 Project Files

### Main Files
- `src/lib/client.ts` - The main API client class
- `src/cli/index.ts` - The interactive CLI interface
- `example.ts` - Example usage code
- `package.json` - Project configuration

### Configuration
- `tsconfig.json` - TypeScript compiler settings
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variables template

### Documentation
All in markdown format for easy reading:
- README.md (detailed)
- QUICKSTART.md (fast setup)
- CONTRIBUTING.md (for contributors)
- PROJECT_STRUCTURE.md (architecture overview)

## 💾 Configuration Storage

The CLI automatically saves your preferences to:
```
~/.securitas-config.json
```

**⚠️ SECURITY WARNING:**
Contains:
- Your Securitas Direct username
- Your password (stored in PLAIN TEXT - HIGH SECURITY RISK)
- Last used installation ID

**Security Recommendations:**
- Set restrictive file permissions: `chmod 600 ~/.securitas-config.json`
- Consider using environment variables instead of stored credentials
- Never commit this file to version control
- Delete this file when not in use: credentials stored in plain text
- Be aware that anyone with access to your account can read these credentials

## 🔒 Security Notes

⚠️ **Important Security Considerations:**

1. **Credential Storage**
   - Credentials are stored in plain text in `~/.securitas-config.json`
   - For production use, consider environment variables
   - Or implement credential encryption

2. **API Communication**
   - Uses HTTPS to Securitas Direct servers
   - No external API keys stored

3. **Best Practices**
   - Use environment variables for credentials in automation
   - Don't commit credentials to version control
   - Consider running in isolated environments
   - Regularly review access logs

## 🧪 Testing

Run the included example:
```bash
npm run build
ts-node example.ts
```

This will:
1. Authenticate with your credentials
2. Fetch installations
3. Check alarm status
4. List devices
5. Show recent events
6. Demonstrate all API features

(Note: Update `example.ts` with your credentials first)

## 🌍 API Endpoints Supported

- Authentication (login/logout)
- Get installations list
- Get alarm status
- Arm alarm (multiple modes)
- Disarm alarm
- Get devices list
- Get event history
- Session refresh

## 📦 Dependencies

### Production
- **axios** - HTTP client for API communication

### Development
- **typescript** - Language and type checking
- **@types/node** - Node.js type definitions
- **ts-node** - TypeScript execution

All dependencies are minimal and production-ready.

## 📖 How to Use

### As a Standalone CLI Tool

```bash
# After building:
npm start

# Or with TypeScript directly:
npm run dev

# Follow the interactive prompts
```

### As a Library in Your Code

```typescript
import { SecuritasDirectClient, AlarmStatus } from 'securitas-direct-api';

async function monitorAlarm() {
  const client = new SecuritasDirectClient();
  
  // Login
  const auth = await client.authenticate({
    username: process.env.SECURITAS_USER,
    password: process.env.SECURITAS_PASS,
  });
  
  if (!auth.success) throw new Error('Auth failed');
  
  // Get installations
  const installations = await client.getInstallations();
  const installId = installations[0].installationId;
  
  // Monitor status
  const status: AlarmStatus = await client.getStatus(installId);
  console.log(`Alarm is ${status.armState}`);
  
  // Logout
  client.logout();
}

monitorAlarm().catch(console.error);
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run build
```

### Authentication Fails
- Verify your Securitas Direct credentials
- Check your internet connection
- Verify the API is online (check Securitas Direct status page)

### Permission Issues
```bash
# Make CLI executable
chmod +x dist/cli/index.js
```

## 📞 Support

- 📖 Read [README.md](README.md) for detailed documentation
- ⚡ Check [QUICKSTART.md](QUICKSTART.md) for quick setup
- 💡 See [example.ts](example.ts) for code examples
- 🏗️ Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture

## 📝 Next Steps

1. ✅ **Review the code** - Start with `src/lib/client.ts`
2. ✅ **Try the CLI** - Run `npm start` and explore
3. ✅ **Integrate into your project** - Import the library
4. ✅ **Contribute** - See CONTRIBUTING.md for guidelines
5. ✅ **Deploy** - Use in your applications

## 📄 License

MIT License - You can use this freely in personal and commercial projects.
See [LICENSE](LICENSE) file for details.

---

**Happy automating your Securitas Direct alarm system! 🔐**

For questions or issues, refer to the documentation files or open an issue on GitHub.
