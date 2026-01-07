# Copilot Instructions for Securitas Direct API

This repository contains a TypeScript client library and CLI tool for interacting with the Securitas Direct alarm system API.

## Project Overview

- **Language**: TypeScript 5.0 with strict mode enabled
- **Runtime**: Node.js 16+
- **Package Manager**: npm
- **Build Tool**: TypeScript Compiler (tsc)
- **HTTP Client**: Axios

## Project Structure

```
src/
├── lib/                      # Core library code
│   ├── client.ts            # Main SecuritasDirectClient class
│   ├── types.ts             # TypeScript interfaces and types
│   ├── constants.ts         # API endpoints and constants
│   ├── utils.ts             # Utility functions
│   └── index.ts             # Library exports
├── cli/                      # Command-line interface
│   └── index.ts             # Interactive CLI application
└── index.ts                 # Main entry point
```

## Building and Testing

### Build Commands
```bash
npm install           # Install dependencies
npm run build        # Compile TypeScript to JavaScript (outputs to dist/)
npm run dev          # Run CLI with TypeScript directly (ts-node)
npm start            # Run compiled CLI
```

### Important Notes
- The build outputs to the `dist/` directory
- Type declarations (.d.ts) and source maps are generated automatically
- No test suite is currently configured (test script is a placeholder)

## Coding Standards

### TypeScript Guidelines

1. **Strict Type Safety**
   - Use TypeScript strict mode (enabled in tsconfig.json)
   - Avoid `any` types where possible - use specific types or `unknown` if necessary
   - Add proper type annotations for all functions and variables
   - Use interfaces for object types

2. **Code Style**
   - Use meaningful variable and function names
   - Keep functions focused and single-purpose
   - Add comments for complex logic only (code should be self-documenting)
   - Follow existing naming conventions:
     - Classes: PascalCase (e.g., `SecuritasDirectClient`)
     - Interfaces: PascalCase (e.g., `SessionData`, `AlarmStatus`)
     - Functions/methods: camelCase (e.g., `authenticate`, `getInstallations`)
     - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `DEVICE_CONFIG`)

3. **Imports and Exports**
   - Use named imports/exports
   - Group imports: external libraries first, then internal modules
   - Use barrel exports (index.ts) for public APIs

### Architecture Patterns

1. **Client Pattern**: The main `SecuritasDirectClient` class handles all API operations
2. **Session Management**: Sessions are stored in memory with automatic refresh
3. **Error Handling**: Use structured error objects with standardized codes
4. **GraphQL Integration**: API uses GraphQL - see `GRAPHQL_IMPLEMENTATION.md` for details

## Key Conventions

### API Client
- All API methods are async and return Promises
- Session state is managed internally by the client
- HTTP requests use Axios with configured timeouts
- GraphQL queries are defined in `constants.ts` as string templates

### Security
- **Never commit credentials or sensitive information**
- Use environment variables for sensitive data
- Credentials stored in CLI config should be clearly documented as insecure
- All API communication uses HTTPS

### Error Handling
- Catch and handle Axios errors appropriately
- Provide meaningful error messages to users
- Use structured error types defined in types.ts

## Documentation

When making changes:
- Update README.md if adding new features or changing public APIs
- Update CONTRIBUTING.md if changing development processes
- Update PROJECT_STRUCTURE.md if adding new files or directories
- Keep inline JSDoc comments for public APIs

## Dependencies

### Production
- `axios` ^1.6.0 - HTTP client for API requests

### Development
- `typescript` ^5.0.0 - TypeScript compiler
- `@types/node` ^20.0.0 - Node.js type definitions
- `ts-node` ^10.9.0 - TypeScript execution for Node.js

**Important**: Only add new dependencies if absolutely necessary. Prefer using standard Node.js APIs or existing dependencies.

## Common Tasks

### Adding a New API Method
1. Define request/response types in `src/lib/types.ts`
2. Add GraphQL query/mutation in `src/lib/constants.ts`
3. Implement method in `src/lib/client.ts`
4. Export from `src/lib/index.ts` if it's a public API
5. Update README.md with usage examples

### Modifying the CLI
- CLI code is in `src/cli/index.ts`
- Keep CLI interactions user-friendly with clear prompts
- Handle errors gracefully and provide helpful messages

### Working with GraphQL
- Review `GRAPHQL_IMPLEMENTATION.md` for API structure
- All GraphQL operations use the same endpoint
- Queries are defined as template strings in constants
- Device info and authentication headers are required for all requests

## Git Workflow

- Keep commits atomic and descriptive
- Reference issue numbers in commit messages when applicable
- Ensure code builds (`npm run build`) before committing
- Follow conventional commit style when possible

## Additional Resources

- See `QUICKSTART.md` for getting started guide
- See `CONTRIBUTING.md` for contribution guidelines
- See `PROJECT_STRUCTURE.md` for detailed architecture
- See `GRAPHQL_IMPLEMENTATION.md` for GraphQL API details
