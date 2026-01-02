# Securitas Direct API

A TypeScript client library and CLI tool for interacting with the Securitas Direct alarm system API.

## Features

- 🔐 User authentication with session management
- 🏢 View all installations
- 🚨 Check and control alarm status (arm/disarm)
- 📱 List and monitor connected devices
- 📜 View event history
- 💾 Store credentials locally (encrypted recommended)
- 🖥️ Interactive CLI interface
- 📦 Reusable library for integration into other applications

## Project Structure

```
securitas-direct-api/
├── src/
│   ├── lib/               # Core library
│   │   ├── client.ts     # Main API client
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── constants.ts  # API endpoints & constants
│   │   └── index.ts      # Library exports
│   ├── cli/              # CLI interface
│   │   └── index.ts      # Interactive CLI application
│   └── index.ts          # Main entry point
├── dist/                 # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Clone and Install

```bash
git clone https://github.com/element-software/verisure_api
cd verisure_api
npm install
```

### Build

```bash
npm run build
```

## Usage

### As a CLI Tool

#### Run with TypeScript (development)
```bash
npm run dev
```

#### Run compiled JavaScript
```bash
npm start
```

#### After installation, use as a command
```bash
securitas
```

### As a Library

```typescript
import { SecuritasDirectClient } from 'securitas-direct-api';

const client = new SecuritasDirectClient();

// Authenticate
await client.authenticate({
  username: 'your-username',
  password: 'your-password'
});

// Get installations
const installations = await client.getInstallations();

// Check alarm status
const status = await client.getStatus(installationId);

// Arm the alarm
await client.arm(installationId);

// Disarm the alarm
await client.disarm(installationId);

// Get devices
const devices = await client.getDevices(installationId);

// Get events
const events = await client.getEvents(installationId);

// Logout
client.logout();
```

## CLI Features

The interactive CLI provides:

1. **Authentication** - Login with your Securitas Direct credentials
2. **View Installations** - See all your alarm installations
3. **Check Alarm Status** - View current arm state and recent activity
4. **Arm Alarm** - Arm with different modes (Full, Night, Partial)
5. **Disarm Alarm** - Disarm the alarm system
6. **View Devices** - See all sensors and devices
7. **View Events** - Check alarm system history
8. **Settings** - Manage credentials and configuration

### Configuration

The CLI stores configuration in `~/.securitas-config.json`:
- Username
- Password (recommended to use environment variables instead)
- Last used installation ID

## API Reference

### SecuritasDirectClient

#### Methods

##### `authenticate(credentials: SecuritasCredentials): Promise<AuthenticationResponse>`
Authenticate with Securitas Direct API.

```typescript
const result = await client.authenticate({
  username: 'user@example.com',
  password: 'password'
});
```

##### `isAuthenticated(): boolean`
Check if currently authenticated.

##### `getSession(): SessionData | null`
Get current session information.

##### `getInstallations(): Promise<InstallationInfo[]>`
Get all installations for the user.

##### `getStatus(installationId: string): Promise<AlarmStatus>`
Get the current alarm status.

##### `arm(installationId: string, armMode?: string): Promise<CommandResponse>`
Arm the alarm system. Supported arm modes:
- `'armed'` - Full arm (default)
- `'armed_night'` - Night mode
- `'armed_partial'` - Partial arm

##### `disarm(installationId: string): Promise<CommandResponse>`
Disarm the alarm system.

##### `getDevices(installationId: string): Promise<DeviceStatus[]>`
Get all devices for an installation.

##### `getEvents(installationId: string, limit?: number): Promise<AlarmEvent[]>`
Get event history (default limit: 50).

##### `logout(): void`
Logout and clear session.

### Types

```typescript
interface SecuritasCredentials {
  username: string;
  password: string;
}

interface SessionData {
  customerId: string;
  sessionId: string;
  sessionExpires: Date;
  authenticated: boolean;
}

interface AlarmStatus {
  armState: string;
  lastActivityTime: string;
  lastActivityType: string;
  status: string;
  events?: AlarmEvent[];
}

interface DeviceStatus {
  deviceId: string;
  name: string;
  type: string;
  status: string;
  lastUpdate: string;
}

interface AlarmEvent {
  eventTime: string;
  eventType: string;
  description: string;
}

interface CommandResponse {
  success: boolean;
  message: string;
  commandId?: string;
  timestamp?: string;
}
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run CLI with TypeScript directly
- `npm start` - Run compiled CLI
- `npm test` - Run tests (currently a placeholder)

### Technologies

- **TypeScript 5.0** - Language and type safety
- **Axios** - HTTP client
- **Node.js** - Runtime

## Security Notes

⚠️ **Important**: 
- The CLI stores credentials locally in `~/.securitas-config.json`
- For production use, consider:
  - Using environment variables for credentials
  - Implementing credential encryption
  - Using OAuth or token-based authentication
  - Running the CLI in a secure environment

## Error Handling

The client provides structured error responses:

```typescript
try {
  await client.getStatus(installationId);
} catch (error) {
  console.log(error.code);    // Error code constant
  console.log(error.message); // Human-readable message
  console.log(error.statusCode); // HTTP status code
}
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Disclaimer

This project is not affiliated with Securitas Direct. Use at your own risk and ensure you comply with Securitas Direct's Terms of Service when using this API client.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
