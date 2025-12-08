# Admin Setup Guide

This guide explains how to set up and use the admin system for The AI Scout.

## Creating an Admin Account

### Using the Script

The easiest way to create an admin account is using the provided script:

```bash
cd backend
python create_admin.py --email admin@example.com --name "Admin User"
```

The script will prompt you for a password, or you can use the `--generate-password` flag to generate a secure random password:

```bash
python create_admin.py --email admin@example.com --name "Admin User" --generate-password
```

### Manual Creation

You can also create an admin account manually by:

1. Creating a regular user account through signup
2. Updating the user in the database to set `is_admin = True` and `role = 'admin'`

## Admin Features

### Admin Dashboard

Access the admin dashboard at `/admin` (requires admin login).

**Features:**
- **Dashboard**: Overview statistics (total users, active subscriptions, trial users, etc.)
- **Users**: User management (view, activate/deactivate, delete, reset trials)
- **Logs**: View signup attempts and system logs

### Admin API Endpoints

All admin endpoints require authentication with an admin account:

- `GET /admin/stats` - Get admin dashboard statistics
- `GET /admin/users` - List all users (with filters)
- `GET /admin/users/{id}` - Get user details
- `PATCH /admin/users/{id}` - Update user (activate/deactivate, change role, etc.)
- `DELETE /admin/users/{id}` - Delete user
- `POST /admin/users/{id}/reset-trial` - Reset trial for a user
- `POST /admin/users/{id}/extend-trial` - Extend trial period
- `GET /admin/logs/signup-attempts` - View signup attempt logs
- `GET /admin/logs/blocked-ips` - View blocked IP addresses

### User Management

**Activate/Deactivate Users:**
```bash
curl -X PATCH http://localhost:8000/admin/users/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

**Reset User Trial:**
```bash
curl -X POST http://localhost:8000/admin/users/1/reset-trial \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Extend Trial:**
```bash
curl -X POST http://localhost:8000/admin/users/1/extend-trial?days=14 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Security

- Admin accounts bypass subscription checks
- Admin accounts cannot delete themselves
- Admin accounts cannot remove their own admin status
- All admin actions are logged (can be extended to audit log)

## Frontend Access

Admin users can access the admin dashboard at `/admin` after logging in. The admin sidebar will appear, and they can navigate between:

- Dashboard (statistics overview)
- Users (user management)
- Logs (system logs)
- Settings (admin settings - to be implemented)

## Troubleshooting

### "Admin access required" error

- Ensure you're logged in with an admin account
- Check that `is_admin = True` in the database for your user
- Verify your JWT token is valid and not expired

### Cannot access admin routes

- Check that the admin routes are included in `backend/app/main.py`
- Verify your authentication token is being sent in the `Authorization: Bearer <token>` header
- Ensure the user account has `is_admin = True` in the database

