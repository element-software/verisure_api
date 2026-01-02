# Project Structure Overview

## Directory Layout

```
securitas-direct-api/
│
├── src/                          # TypeScript source code
│   ├── lib/                      # Core library code
│   │   ├── client.ts            # Main SecuritasDirectClient class
│   │   ├── types.ts             # TypeScript interfaces and types
│   │   ├── constants.ts         # API endpoints and constants
│   │   └── index.ts             # Library exports
│   │
│   ├── cli/                      # Command-line interface
│   │   └── index.ts             # Interactive CLI application
│   │
│   └── index.ts                 # Main entry point (library exports)
│
├── dist/                         # Compiled JavaScript (generated)
│   ├── lib/                      # Compiled library
│   ├── cli/                      # Compiled CLI
│   ├── index.js                 # Compiled main entry
│   └── *.d.ts                   # TypeScript declarations
│
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment variables example
│
├── README.md                    # Full documentation
├── QUICKSTART.md               # Quick start guide
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── example.ts                  # Example usage code
│
└── .git/                       # Git repository

```

## File Descriptions

### Source Files

#### `src/lib/types.ts`
Defines all TypeScript interfaces and types:
- `SecuritasCredentials` - Login credentials
- `SessionData` - Session information
- `AlarmStatus` - Current alarm state
- `AlarmEvent` - Historical events
- `DeviceStatus` - Connected device info
- `CommandResponse` - Response from commands
- `InstallationInfo` - Installation details
- `ApiError` - Error structure

#### `src/lib/constants.ts`
Defines API configuration:
- `API_BASE_URL` - Securitas Direct API endpoint
- `ENDPOINTS` - API route definitions
- `ARM_STATES` - Alarm state constants
- `DEVICE_TYPES` - Device type constants
- `ERROR_CODES` - Error code constants

#### `src/lib/client.ts`
Main API client class with methods:
- `authenticate()` - Login to the API
- `isAuthenticated()` - Check login status
- `getSession()` - Get session details
- `getInstallations()` - Fetch user's installations
- `getStatus()` - Get alarm status
- `arm()` - Arm the alarm
- `disarm()` - Disarm the alarm
- `getDevices()` - Get list of devices
- `getEvents()` - Get event history
- `logout()` - End session
- `refreshSession()` - Refresh authentication

#### `src/lib/index.ts`
Barrel export file that re-exports:
- `SecuritasDirectClient` class
- All types and interfaces
- All constants

#### `src/cli/index.ts`
Interactive command-line interface with:
- Menu-driven interface
- Credential management
- Installation selection
- Status checking
- Alarm control
- Device listing
- Event history viewing
- Local configuration storage

#### `src/index.ts`
Main library entry point that exports all public APIs.

### Configuration Files

#### `package.json`
- Project metadata
- Dependencies (axios)
- Dev dependencies (TypeScript, ts-node, Node types)
- Build and run scripts
- CLI entry point configuration

#### `tsconfig.json`
- TypeScript compiler options
- Strict mode enabled
- Target: ES2020
- Source maps and declarations enabled

#### `.env.example`
Template for environment variables (optional):
- `SECURITAS_USERNAME`
- `SECURITAS_PASSWORD`
- `SECURITAS_INSTALLATION_ID`
- `DEBUG`

### Documentation

#### `README.md`
Comprehensive documentation including:
- Feature list
- Installation instructions
- Usage examples (library and CLI)
- API reference
- Security notes
- Error handling

#### `QUICKSTART.md`
Getting started guide with:
- 5-minute setup
- Running the CLI
- First-time usage
- Common commands
- Troubleshooting

#### `CONTRIBUTING.md`
Contribution guidelines for developers.

#### `example.ts`
Working example code showing all major features.

## Build & Output

The `npm run build` command compiles TypeScript to JavaScript:

```
TypeScript (src/) → TypeScript Compiler → JavaScript (dist/)
                                       ↓
                              Type Declarations (.d.ts)
                                       ↓
                              Source Maps (.js.map)
```

Generated files in `dist/`:
- `.js` - Compiled JavaScript code
- `.d.ts` - TypeScript type declarations
- `.js.map` - Source maps for debugging
- `.d.ts.map` - Declaration source maps

## Script Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Run CLI with TypeScript directly |
| `npm start` | Run compiled CLI |
| `npm test` | Run tests (placeholder) |

## Dependencies

### Production
- **axios** ^1.6.0 - HTTP client for API requests

### Development
- **typescript** ^5.0.0 - TypeScript compiler
- **@types/node** ^20.0.0 - Node.js type definitions
- **ts-node** ^10.9.0 - TypeScript execution for Node.js

## Key Design Patterns

1. **Client Pattern** - Single `SecuritasDirectClient` instance for all API operations
2. **Session Management** - Automatic session handling with storage
3. **Error Handling** - Structured error objects with standardized codes
4. **Type Safety** - Full TypeScript strict mode throughout
5. **CLI Interface** - Interactive menu-based command structure
6. **Library + CLI** - Dual-purpose: importable library and standalone tool

## API Flow

```
User Input (CLI)
      ↓
CLI Handler
      ↓
SecuritasDirectClient
      ↓
Axios HTTP Client
      ↓
Securitas Direct API
      ↓
Response Processing
      ↓
Error Handling or Data Return
      ↓
CLI Display / Library Return
```

## Security Considerations

- Session tokens stored in memory during runtime
- Credentials optionally stored in `~/.securitas-config.json`
- HTTPS communication (via Securitas Direct API)
- No external dependencies beyond axios
- Type-safe to prevent certain classes of bugs
- Input validation via TypeScript types

For production use:
- Consider encrypting stored credentials
- Use environment variables instead of config file
- Implement additional authentication layers
- Monitor API usage
