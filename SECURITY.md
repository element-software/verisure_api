# Security Best Practices

This document outlines security best practices for using the Securitas Direct API client.

## Credential Management

### ❌ NEVER Do This

```typescript
// DON'T: Hardcode credentials in your code
const client = new SecuritasDirectClient();
await client.authenticate({
  username: 'myemail@example.com',  // NEVER DO THIS
  password: 'mypassword123'          // NEVER DO THIS
});
```

### ✅ ALWAYS Do This

```typescript
// DO: Use environment variables
const client = new SecuritasDirectClient();
await client.authenticate({
  username: process.env.SECURITAS_USERNAME || '',
  password: process.env.SECURITAS_PASSWORD || ''
});
```

## Environment Variables

### Setup

1. **Create a `.env` file** (never commit this):
   ```bash
   # Unix/Linux/macOS
   cp .env.example .env
   
   # Windows (Command Prompt)
   copy .env.example .env
   
   # Windows (PowerShell)
   Copy-Item .env.example .env
   ```

2. **Set secure permissions**:
   ```bash
   chmod 600 .env
   ```

3. **Add your credentials to `.env`**:
   ```
   SECURITAS_USERNAME=your-email@example.com
   SECURITAS_PASSWORD=your-actual-password
   ```

4. **Load environment variables** in your application:
   ```typescript
   import * as dotenv from 'dotenv';
   dotenv.config();
   ```

### Verification

Ensure `.env` is in your `.gitignore`:
```bash
grep "^\.env$" .gitignore
```

If not present, add it:
```bash
echo ".env" >> .gitignore
```

## CLI Configuration File Security

The CLI stores credentials in `~/.securitas-config.json`.

### Risks
- ⚠️ Credentials stored in **plain text**
- ⚠️ Anyone with access to your user account can read them
- ⚠️ No encryption by default

### Mitigation

1. **Set restrictive permissions**:
   ```bash
   chmod 600 ~/.securitas-config.json
   ```

2. **Delete when not in use**:
   ```bash
   rm ~/.securitas-config.json
   ```

3. **Consider using environment variables instead**:
   ```bash
   export SECURITAS_USERNAME="your-email@example.com"
   export SECURITAS_PASSWORD="your-password"
   npm run dev
   ```

## Git Security

### Pre-commit Checklist

Before every commit, verify:

- [ ] No `.env` file committed
- [ ] No credentials in code
- [ ] No API keys or tokens hardcoded
- [ ] No personal information in commit messages
- [ ] `.gitignore` includes `.env` and other sensitive files

### Verify Clean Repository

```bash
# Check what will be committed
git status

# Search for potential credentials
git grep -i "password\s*=\s*['\"]" -- '*.ts' '*.js'
git grep -i "username\s*=\s*['\"].*@" -- '*.ts' '*.js'

# Ensure .env is ignored
git check-ignore .env  # Should output: .env
```

### If You Accidentally Committed Credentials

1. **Immediately rotate/change** the compromised credentials
2. **Remove from git history**:
   ```bash
   # For recent commits (not pushed)
   git reset --soft HEAD~1
   git reset HEAD <file-with-credentials>
   # Edit file to remove credentials
   git add <file-with-credentials>
   git commit -m "Remove credentials"
   
   # For commits already pushed - consider the credentials compromised
   # Use git-filter-branch or BFG Repo-Cleaner (advanced)
   ```
3. **Notify your security team** if applicable

## Production Deployment

### Environment Variables in Production

Use your platform's secure credential storage:

- **Heroku**: `heroku config:set SECURITAS_USERNAME=xxx`
- **AWS**: Use AWS Secrets Manager or Parameter Store
- **Docker**: Use Docker secrets or environment files
- **Kubernetes**: Use Kubernetes Secrets
- **Azure**: Use Azure Key Vault

### Best Practices

1. **Separate credentials per environment** (dev, staging, prod)
2. **Use credential rotation policies**
3. **Implement least privilege access**
4. **Monitor for suspicious API activity**
5. **Use read-only credentials where possible**
6. **Implement rate limiting**
7. **Log authentication attempts** (success and failure)

## Code Review Checklist

When reviewing code, check for:

- [ ] No hardcoded credentials
- [ ] Environment variables used for sensitive data
- [ ] No credentials in comments
- [ ] No credentials in console.log statements
- [ ] No credentials in error messages
- [ ] Credentials not logged to files
- [ ] No credentials in test files (use mocks)

## Secure Coding Practices

### 1. Input Validation

```typescript
const username = process.env.SECURITAS_USERNAME;
const password = process.env.SECURITAS_PASSWORD;

if (!username || !password) {
  throw new Error('Missing required credentials');
}

// Validate email format (basic check)
if (!username.includes('@')) {
  throw new Error('Invalid username format');
}
```

### 2. Error Handling

```typescript
// DON'T: Expose credentials in error messages
try {
  await client.authenticate({ username, password });
} catch (error) {
  console.error('Auth failed with:', username, password); // NEVER DO THIS
}

// DO: Generic error messages
try {
  await client.authenticate({ username, password });
} catch (error) {
  console.error('Authentication failed'); // Safe
  // Log detailed errors to secure logging system only
}
```

### 3. Logging

```typescript
// DON'T: Log credentials
console.log('Authenticating with:', { username, password }); // NEVER

// DO: Log without revealing credentials
console.log('Authenticating user...');
// Or use a generic identifier that doesn't expose the username
console.log('Authentication attempt');
```

## Incident Response

If credentials are compromised:

1. **Immediately change** the password in Securitas Direct
2. **Revoke** any active sessions
3. **Review** access logs for unauthorized activity
4. **Rotate** any API tokens or session tokens
5. **Update** all instances using the old credentials
6. **Document** the incident
7. **Review** how the compromise occurred
8. **Implement** preventive measures

## Security Audit

Regular security audits should check:

1. **Code**: No hardcoded credentials
2. **Repository**: Clean git history
3. **Configuration**: Secure file permissions
4. **Dependencies**: No known vulnerabilities
5. **Access logs**: No suspicious activity

### Running Security Scan

```bash
# Check for exposed credentials in code
npm audit

# Search for potential credential patterns
grep -r "password.*=.*['\"]" --include="*.ts" --include="*.js" .

# Verify .gitignore
cat .gitignore | grep -E "(\.env|config\.json)"
```

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [12-Factor App - Config](https://12factor.net/config)

## Reporting Security Issues

If you discover a security vulnerability in this project:

1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Include details about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Contact

For security concerns, please contact the repository maintainers.

---

**Remember**: Security is not a one-time task but an ongoing process. Stay vigilant!
