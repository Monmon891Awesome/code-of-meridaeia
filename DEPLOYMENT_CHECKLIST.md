# 🎯 Quick Reference Card
## Supabase + Vercel Deployment

**Keep this open while you work!**

---

## 📋 Supabase Setup Checklist

### Step 1: Create Account
- [ ] Go to https://supabase.com
- [ ] Sign up with GitHub
- [ ] Create organization

### Step 2: Create Project
- [ ] Project name: `code-of-meridaeia-beta`
- [ ] Region: Southeast Asia (Singapore)
- [ ] Generate & save password ⚠️
- [ ] Wait 2-3 minutes for setup

### Step 3: Save Credentials
- [ ] Settings → API
- [ ] Copy **Project URL**
- [ ] Copy **Anon/Public Key**
- [ ] Save to text file

### Step 4: Initialize Database
- [ ] SQL Editor → New query
- [ ] Copy SQL from `DATABASE_DESIGN.md` (lines 399-516)
- [ ] Paste and Run
- [ ] Verify 7 tables in Table Editor

### Step 5: Enable RLS (Optional)
- [ ] Copy RLS SQL from `SUPABASE_SETUP_GUIDE.md`
- [ ] Run in SQL Editor
- [ ] Verify success

---

## 🚀 Vercel Deployment Checklist

### Step 1: Sign Up
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel

### Step 2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select `code-of-meridaeia` repo
- [ ] Click "Import"

### Step 3: Configure
- [ ] Framework: Other
- [ ] Build Command: (leave empty)
- [ ] Output Directory: `./`

### Step 4: Environment Variables
- [ ] Add `VITE_SUPABASE_URL` = (your Supabase URL)
- [ ] Add `VITE_SUPABASE_ANON_KEY` = (your Anon Key)

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait 60 seconds
- [ ] Visit your live site!

---

## 📝 Credentials Template

**Save this to a text file:**

```
=== SUPABASE CREDENTIALS ===
Project Name: code-of-meridaeia-beta
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
Database Password: [PASTE HERE]

=== VERCEL ===
Deployment URL: https://code-of-meridaeia.vercel.app
```

---

## 🎯 SQL to Copy (Database Initialization)

**Location**: `DATABASE_DESIGN.md` lines 399-516

**Starts with**:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Ends with**:
```sql
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| SQL error | Check if you copied the ENTIRE SQL block |
| No tables showing | Refresh the page |
| Can't find SQL Editor | Look for `</>` icon in left sidebar |
| Vercel build failed | Check environment variables are set |
| Game not loading | Open browser console (F12) for errors |

---

## ⏱️ Time Estimates

- Supabase setup: **15 minutes**
- Vercel deployment: **10 minutes**
- Testing: **5 minutes**
- **Total**: ~30 minutes to go live!

---

## 🎉 Success Indicators

### Supabase
✅ 7 tables visible in Table Editor  
✅ No SQL errors  
✅ Credentials saved

### Vercel
✅ Build succeeded  
✅ Deployment URL works  
✅ Game loads in browser

---

**Ready?** Open `SUPABASE_SETUP_GUIDE.md` and let's go! 🚀
