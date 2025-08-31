# 🔐 Bharat Pashudhan Authentication Setup Guide

## Current Status ✅
Your authentication system is **90% complete** and ready for final testing. Here's what's been configured:

### ✅ Completed Components
- **Supabase Integration**: Connected with your database
- **Backend Routes**: All auth endpoints configured (`/api/auth/*`)
- **Frontend Service**: Updated to match backend API
- **Environment Variables**: Properly configured in `.env`
- **Password Hashing**: bcrypt implementation ready
- **JWT Tokens**: Secure token generation and validation

## 🚨 Critical Next Steps

### 1. **Create Users Table in Supabase** (REQUIRED)
You **MUST** run the SQL script to create the users table:

1. Go to: https://bbbbppiugjeptkvwkigj.supabase.co
2. Navigate to **SQL Editor**
3. Copy the entire content from `create_users_table.sql` (currently open in your editor)
4. Paste and **Execute** the script

This will create:
- Users table with proper schema
- Sample admin user (email: `admin@bharatpashudhan.com`, password: `admin123`)
- Sample field worker (email: `flw@bharatpashudhan.com`, password: `flw123`)

### 2. **Start Backend Server**
```bash
cd backend
node start-server.js
```

### 3. **Test Authentication**
Open the debug dashboard: `backend/debug-auth.html` in your browser to test:
- Backend health check
- Supabase connection
- User registration
- User login

## 🔧 Quick Testing Commands

### Test Backend Health
```bash
curl http://localhost:3001/health
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bharatpashudhan.com","password":"admin123"}'
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"test123",
    "role":"farmer",
    "phone":"+91-9876543210",
    "location":"Test Location"
  }'
```

## 🐛 Common Issues & Solutions

### Issue: "relation 'users' does not exist"
**Solution**: Run the SQL script in Supabase SQL Editor

### Issue: Backend won't start
**Solution**: Check if Node.js is installed and port 3001 is available

### Issue: CORS errors
**Solution**: Frontend should run on http://localhost:5173 (already configured)

### Issue: JWT token errors
**Solution**: Check JWT_SECRET in `.env` file

## 📁 Key Files Modified
- `backend/src/routes/auth.js` - Authentication endpoints
- `backend/src/config/supabase.js` - Database connection
- `backend/.env` - Environment configuration
- `src/services/authService.ts` - Frontend auth service
- `create_users_table.sql` - Database schema

## 🎯 Expected Results After Setup
1. **Health Check**: ✅ Backend healthy, database connected
2. **Login**: ✅ Returns JWT token and user data
3. **Registration**: ✅ Creates new user and returns token
4. **Frontend**: ✅ Can authenticate users seamlessly

## 🚀 Final Deployment
Once authentication works locally:
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel/Netlify
3. Update CORS_ORIGIN in production `.env`
4. Test production authentication flow

---

**Next Action**: Run the SQL script in Supabase, then start the backend server and test authentication!
