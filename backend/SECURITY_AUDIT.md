# Security Audit Checklist

Use this checklist to verify security before and after deployment.

## Pre-Deployment Audit

### Configuration

- [ ] All environment variables are set (no missing values)
- [ ] `ENVIRONMENT=production` is set
- [ ] `JWT_SECRET_KEY` is a strong random value (32+ characters)
- [ ] `DATABASE_URL` uses PostgreSQL (not SQLite)
- [ ] `CORS_ORIGINS` only includes production domains (no `*`)
- [ ] `FRONTEND_URL` is set to production URL
- [ ] All Stripe keys are production keys (not test keys)
- [ ] Email service is configured (not mock in production)

### Code Security

- [ ] No hardcoded secrets in code
- [ ] No `os.getenv()` with insecure fallbacks in production code
- [ ] All API endpoints require authentication where needed
- [ ] Input validation is present on all endpoints
- [ ] SQL queries use ORM (no raw SQL with user input)
- [ ] Error messages don't expose sensitive information
- [ ] Passwords are hashed (never plain text)

### Infrastructure

- [ ] HTTPS is enabled (automatic on Railway/Vercel)
- [ ] Database uses SSL connections
- [ ] Rate limiting is enabled
- [ ] Security headers middleware is active
- [ ] CORS is properly configured
- [ ] `.env` file is in `.gitignore`
- [ ] Database backups are configured

### Authentication & Authorization

- [ ] JWT tokens have expiration
- [ ] Password reset tokens expire
- [ ] Email verification is required
- [ ] Failed login attempts are logged
- [ ] Account lockout is implemented (optional but recommended)

## Post-Deployment Audit

### Functionality Tests

- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Signup creates new accounts
- [ ] Email verification works
- [ ] Password reset works
- [ ] Protected routes require authentication
- [ ] Unauthenticated users are redirected to login

### Security Tests

- [ ] CORS blocks requests from unauthorized origins
- [ ] Rate limiting blocks excessive requests
- [ ] Security headers are present in responses
- [ ] JWT tokens expire after 7 days
- [ ] Invalid JWT tokens are rejected
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked (CSP headers)

### Performance Tests

- [ ] API responds within acceptable time (< 500ms for most endpoints)
- [ ] Database queries are optimized
- [ ] No memory leaks in long-running processes
- [ ] Rate limiting doesn't impact legitimate users

## Ongoing Security Monitoring

### Daily

- [ ] Check error logs for suspicious activity
- [ ] Monitor failed login attempts
- [ ] Review rate limit violations

### Weekly

- [ ] Review access logs
- [ ] Check for unusual traffic patterns
- [ ] Verify backups are being created
- [ ] Review security advisories for dependencies

### Monthly

- [ ] Update dependencies (`pip install --upgrade -r requirements.txt`)
- [ ] Review and rotate secrets (if needed)
- [ ] Check for security patches
- [ ] Review user access and permissions

### Quarterly

- [ ] Full security audit
- [ ] Penetration testing (optional)
- [ ] Review and update security policies
- [ ] Backup restoration test

## Security Testing Commands

### Test Rate Limiting

```bash
# Should be blocked after 5 requests
for i in {1..10}; do
  curl -X POST https://your-api.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### Test CORS

```bash
# Should be blocked if origin is not in CORS_ORIGINS
curl -X GET https://your-api.com/models/ \
  -H "Origin: https://malicious-site.com" \
  -v
```

### Test Security Headers

```bash
# Check if security headers are present
curl -I https://your-api.com/
```

Expected headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy: ...`

### Test JWT Token

```bash
# Get token from login
TOKEN=$(curl -X POST https://your-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# Use token for authenticated request
curl -X GET https://your-api.com/models/ \
  -H "Authorization: Bearer $TOKEN"
```

### Test SQL Injection Protection

```bash
# Should be safely handled (no SQL injection)
curl -X GET "https://your-api.com/models/?email=test@example.com' OR '1'='1"
```

## Vulnerability Scanning

### Dependency Scanning

```bash
# Check for known vulnerabilities
pip install safety
safety check -r requirements.txt
```

### Code Scanning

Consider using:
- [Bandit](https://bandit.readthedocs.io/) - Python security linter
- [Semgrep](https://semgrep.dev/) - Static analysis
- [Snyk](https://snyk.io/) - Dependency and code scanning

## Incident Response Plan

If a security incident occurs:

1. **Immediate Actions**
   - [ ] Identify the scope of the breach
   - [ ] Isolate affected systems if possible
   - [ ] Preserve logs and evidence
   - [ ] Notify team members

2. **Containment**
   - [ ] Change compromised credentials
   - [ ] Revoke affected JWT tokens (if possible)
   - [ ] Block malicious IPs
   - [ ] Update security measures

3. **Recovery**
   - [ ] Restore from backups if needed
   - [ ] Patch vulnerabilities
   - [ ] Monitor for continued attacks
   - [ ] Verify system integrity

4. **Post-Incident**
   - [ ] Document the incident
   - [ ] Review and update security measures
   - [ ] Notify affected users (if required by law)
   - [ ] Conduct post-mortem

## Compliance Considerations

Depending on your jurisdiction and user base, you may need to comply with:

- **GDPR** (EU): User data protection, right to deletion
- **CCPA** (California): User privacy rights
- **PCI DSS** (if handling payments): Payment card data security

Ensure you:
- [ ] Have a privacy policy
- [ ] Have a terms of service
- [ ] Implement data deletion requests
- [ ] Encrypt sensitive data
- [ ] Log access to sensitive data
- [ ] Have data breach notification procedures

## Security Contact

For security concerns, contact: [your-security-email]

