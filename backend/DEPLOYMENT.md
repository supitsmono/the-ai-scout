# Deployment Guide

This guide covers deploying The AI Scout to production using Railway (backend + database) and Vercel (frontend).

## Prerequisites

- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- GitHub repository with your code
- Domain name (optional, but recommended)

## Backend Deployment (Railway)

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Copy the `DATABASE_URL` from the database service (it will be in the "Variables" tab)

### 3. Configure Environment Variables

In your Railway backend service, go to "Variables" and add:

```env
ENVIRONMENT=production
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID=price_...
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG....
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
AUTH_RATE_LIMIT_REQUESTS=5
AUTH_RATE_LIMIT_WINDOW=60
```

### 4. Deploy

1. Railway will automatically detect the Dockerfile and deploy
2. Wait for the build to complete
3. Railway will assign a public URL (e.g., `https://your-app.up.railway.app`)
4. Copy this URL - you'll need it for the frontend

### 5. Custom Domain (Optional)

1. In Railway, go to your service → "Settings" → "Networking"
2. Click "Generate Domain" or add your custom domain
3. Follow the DNS configuration instructions

## Frontend Deployment (Vercel)

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory

### 2. Configure Build Settings

Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Environment Variables

Add these environment variables in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Vercel will assign a URL (e.g., `https://your-app.vercel.app`)

### 5. Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Database Backups (Railway)

Railway provides automatic backups for PostgreSQL databases:

1. Go to your PostgreSQL service in Railway
2. Click "Data" tab
3. Click "Backups" to view/manage backups
4. Backups are created automatically daily
5. You can restore from backups via the Railway dashboard

### Manual Backup

To create a manual backup:

```bash
# Get connection string from Railway
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup

```bash
# Restore from backup file
psql $DATABASE_URL < backup_20240101_120000.sql
```

## Post-Deployment Checklist

- [ ] Backend is accessible at Railway URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Database connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured with production frontend URL
- [ ] JWT_SECRET_KEY is set and secure
- [ ] Stripe keys are set (if using payments)
- [ ] Email service is configured
- [ ] Custom domains are configured (if applicable)
- [ ] SSL certificates are active (automatic on Railway/Vercel)
- [ ] Health check endpoint is working (`/`)

## Monitoring

### Railway

- View logs: Railway Dashboard → Service → "Deployments" → Click deployment → "View Logs"
- Monitor metrics: Railway Dashboard → Service → "Metrics"

### Vercel

- View logs: Vercel Dashboard → Project → "Deployments" → Click deployment → "View Function Logs"
- Monitor analytics: Vercel Dashboard → Project → "Analytics"

## Troubleshooting

### Backend Issues

1. **Database connection errors**: Verify `DATABASE_URL` is correct and database is running
2. **JWT errors**: Ensure `JWT_SECRET_KEY` is set
3. **CORS errors**: Check `CORS_ORIGINS` includes your frontend URL
4. **Build failures**: Check Railway logs for Python/dependency errors

### Frontend Issues

1. **API connection errors**: Verify `NEXT_PUBLIC_API_URL` is correct
2. **Build failures**: Check Vercel logs for Next.js build errors
3. **Environment variables**: Ensure variables are prefixed with `NEXT_PUBLIC_` if needed in browser

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] CORS is restricted to production domains
- [ ] Rate limiting is enabled
- [ ] Security headers are active
- [ ] Database uses SSL connections
- [ ] JWT tokens have expiration
- [ ] Passwords are hashed with bcrypt
- [ ] HTTPS is enforced (automatic on Railway/Vercel)

## Scaling

### Railway

- Upgrade database plan for more resources
- Add multiple backend instances for load balancing
- Use Railway's built-in scaling features

### Vercel

- Vercel automatically scales based on traffic
- Upgrade to Pro/Enterprise for more resources and features

