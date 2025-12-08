# Security Best Practices

This document outlines security measures implemented in The AI Scout and best practices for maintaining security.

## Implemented Security Measures

### 1. Password Security

- **Hashing**: Passwords are hashed using bcrypt with automatic salt generation
- **Never stored in plain text**: All passwords are hashed before storage
- **Minimum requirements**: Enforced via frontend validation (can be extended)

### 2. JWT Authentication

- **Secure tokens**: JWT tokens are signed with a secret key
- **Expiration**: Tokens expire after 7 days
- **Secret key**: Must be set via `JWT_SECRET_KEY` environment variable (no hardcoded fallback in production)
- **Algorithm**: HS256 (HMAC-SHA256)

### 3. Database Security

- **SQL Injection Prevention**: All queries use SQLAlchemy ORM (parameterized queries)
- **Connection Security**: PostgreSQL connections use SSL in production
- **Credentials**: Database credentials stored in environment variables only
- **Connection Pooling**: Configured for performance and security

### 4. CORS Protection

- **Restricted Origins**: Only specified frontend URLs are allowed
- **No wildcard**: Production does not allow `*` origins
- **Credentials**: CORS credentials are enabled for authenticated requests

### 5. Security Headers

The following security headers are automatically added to all responses:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Content-Security-Policy` - Restricts resource loading
- `Strict-Transport-Security` - Forces HTTPS (production only)
- `Permissions-Policy` - Restricts browser features

### 6. Rate Limiting

- **General API**: 100 requests per 60 seconds per IP
- **Auth endpoints**: 5 requests per 60 seconds per IP (stricter)
- **In-memory storage**: Uses in-memory tracking (can be upgraded to Redis for distributed systems)

### 7. Input Validation

- **Pydantic models**: All API inputs are validated using Pydantic
- **Email validation**: Email addresses are validated for format
- **Type checking**: All inputs are type-checked
- **Sanitization**: User inputs are sanitized before processing

### 8. Fraud Prevention

- **Email tracking**: One email = one trial
- **IP rate limiting**: Max 2 signups per IP per 24h
- **Device fingerprinting**: Tracks devices to prevent abuse
- **Payment verification**: Stripe integration for payment validation
- **Disposable email blocking**: Blocks temporary email services

### 9. Environment Variables

- **No secrets in code**: All secrets are loaded from environment variables
- **Validation**: Configuration is validated on startup (production)
- **Separate configs**: Development and production use different configurations

### 10. Error Handling

- **No sensitive data in errors**: Error messages don't expose sensitive information
- **Generic error messages**: User-facing errors are generic
- **Detailed logging**: Detailed errors logged server-side only

## Security Checklist for Production

Before going live, ensure:

- [ ] `JWT_SECRET_KEY` is set to a strong random value (32+ characters)
- [ ] `DATABASE_URL` points to PostgreSQL (not SQLite)
- [ ] `CORS_ORIGINS` only includes production domains
- [ ] `ENVIRONMENT=production` is set
- [ ] All Stripe keys are production keys (not test keys)
- [ ] Email service is configured (not mock)
- [ ] Rate limiting is enabled
- [ ] Security headers are active
- [ ] HTTPS is enforced (automatic on Railway/Vercel)
- [ ] Database backups are configured
- [ ] Monitoring and logging are set up
- [ ] `.env` file is in `.gitignore` (never commit secrets)

## Generating Secure Secrets

### JWT Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Database Password

Use a strong random password generator or:

```bash
openssl rand -base64 32
```

## Regular Security Maintenance

### Weekly

- Review error logs for suspicious activity
- Check for failed login attempts
- Monitor rate limit violations

### Monthly

- Review and rotate secrets (if compromised)
- Update dependencies (`pip install --upgrade -r requirements.txt`)
- Review access logs
- Check for security advisories

### Quarterly

- Security audit
- Penetration testing (optional)
- Review and update security policies
- Backup verification

## Common Security Threats & Mitigations

### 1. SQL Injection

**Mitigation**: Use SQLAlchemy ORM (parameterized queries)

```python
# ✅ Safe
user = db.query(User).filter(User.email == email).first()

# ❌ Never do this
db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

### 2. XSS (Cross-Site Scripting)

**Mitigation**: 
- Content Security Policy headers
- Input sanitization
- Output encoding (handled by FastAPI/React)

### 3. CSRF (Cross-Site Request Forgery)

**Mitigation**:
- CORS restrictions
- SameSite cookies (if using cookies)
- JWT tokens in Authorization header

### 4. Brute Force Attacks

**Mitigation**:
- Rate limiting on auth endpoints
- Account lockout after failed attempts (can be added)
- Strong password requirements

### 5. Session Hijacking

**Mitigation**:
- JWT tokens with expiration
- HTTPS only (automatic on Railway/Vercel)
- Secure token storage (localStorage, not cookies)

### 6. Man-in-the-Middle

**Mitigation**:
- HTTPS/TLS encryption (automatic on Railway/Vercel)
- HSTS headers
- Certificate pinning (optional, advanced)

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** create a public GitHub issue
2. Email security concerns to: [your-security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Railway Security](https://docs.railway.app/guides/security)
- [Vercel Security](https://vercel.com/docs/security)

