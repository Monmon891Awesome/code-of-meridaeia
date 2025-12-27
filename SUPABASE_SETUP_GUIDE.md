# 🎯 Supabase Setup - Step-by-Step Guide
## Code of Meridaeia - Live Now!

**Time Required**: 20 minutes  
**Goal**: Get your database online and ready for deployment

---

## 📝 Step 1: Create Supabase Account (5 minutes)

### 1.1 Sign Up

1. **Open this link**: https://supabase.com
2. Click **"Start your project"**
3. Click **"Continue with GitHub"** (easiest option!)
4. Authorize Supabase to access your GitHub account
5. You'll be redirected to the Supabase dashboard

---

## 🗄️ Step 2: Create Your Project (3 minutes)

### 2.1 New Project Setup

1. Click **"New Project"** (big green button)
2. Fill in the form:

   **Organization**: 
   - If first time: Click "Create a new organization"
   - Name it: `Code of Meridaeia` or your name
   
   **Project Details**:
   - **Name**: `code-of-meridaeia-beta`
   - **Database Password**: Click **"Generate a password"**
     - ⚠️ **IMPORTANT**: Click the copy icon and save this password!
     - Paste it somewhere safe (Notes app, password manager)
   - **Region**: Choose **"Southeast Asia (Singapore)"** (closest to you!)
   - **Pricing Plan**: **Free** (already selected)

3. Click **"Create new project"**
4. Wait 2-3 minutes while it sets up ☕
   - You'll see a progress bar
   - When done, you'll see the project dashboard

---

## 🔑 Step 3: Save Your Credentials (2 minutes)

### 3.1 Get Your API Keys

Once your project is ready:

1. Click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** (under Project Settings)
3. You'll see a page with your credentials

### 3.2 Copy These 3 Values

**Copy and save these somewhere safe** (create a text file called `supabase-credentials.txt`):

```
PROJECT URL: https://xxxxxxxxxxxxx.supabase.co
ANON/PUBLIC KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
SERVICE ROLE KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

⚠️ **IMPORTANT**: 
- The **Anon Key** is safe to use in your frontend (we'll use this)
- The **Service Role Key** is SECRET - never share it or put it in your code!

---

## 🛠️ Step 4: Initialize Database (10 minutes)

### 4.1 Open SQL Editor

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar, looks like `</>`)
2. Click **"+ New query"** button (top right)

### 4.2 Copy the SQL Schema

**Now, follow these steps carefully:**

1. **Open your `DATABASE_DESIGN.md` file** (it's already open in your editor!)
2. **Scroll to line 398** (or search for "Database Initialization SQL")
3. **Select ALL the SQL code** from line 399 to line 516
   - Starts with: `-- Enable UUID extension`
   - Ends with: `EXECUTE FUNCTION update_updated_at_column();`
4. **Copy it** (Cmd+C)

### 4.3 Paste and Run

1. **Go back to Supabase SQL Editor**
2. **Paste the SQL** (Cmd+V) into the editor
3. **Click "Run"** (or press Cmd+Enter)
4. Wait 2-3 seconds...
5. You should see: ✅ **"Success. No rows returned"**

### 4.4 Verify Tables Created

1. Click **"Table Editor"** (left sidebar, looks like a table icon)
2. You should see **7 tables**:
   - ✅ `player_profiles`
   - ✅ `hero_progress`
   - ✅ `inventory`
   - ✅ `shop_items`
   - ✅ `combat_logs`
   - ✅ `skill_tree`
   - ✅ `leaderboard_cache`

**If you see all 7 tables, you're GOLDEN!** 🎉

---

## 🎯 Step 5: Enable Row-Level Security (OPTIONAL but Recommended)

### 5.1 What is RLS?

Row-Level Security ensures users can only access their own data. It's like a bouncer for your database!

### 5.2 Enable RLS (2 minutes)

1. Still in **SQL Editor**, click **"+ New query"**
2. Copy and paste this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_tree ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Everyone can read leaderboard (it's public!)
CREATE POLICY "Leaderboard is public"
  ON leaderboard_cache FOR SELECT
  USING (TRUE);

-- Shop items are public (everyone can see what's for sale)
CREATE POLICY "Shop items are public"
  ON shop_items FOR SELECT
  USING (TRUE);
```

3. Click **"Run"**
4. You should see: ✅ **"Success"**

---

## ✅ Verification Checklist

Before moving to Vercel, make sure:

- [x] Supabase account created
- [x] Project created (`code-of-meridaeia-beta`)
- [x] Database password saved
- [x] API credentials saved (URL + Anon Key)
- [x] SQL schema executed successfully
- [x] 7 tables visible in Table Editor
- [x] RLS policies enabled (optional but recommended)

---

## 🚀 What's Next?

**You're done with Supabase!** 🎉

Now you're ready for **Step 3: Deploy to Vercel**

### Next Steps:

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Import** your `code-of-meridaeia` repository
4. **Add environment variables**:
   - `VITE_SUPABASE_URL` = (the URL you saved)
   - `VITE_SUPABASE_ANON_KEY` = (the Anon Key you saved)
5. **Deploy!**

---

## 🆘 Troubleshooting

### "SQL Error: relation already exists"
- **Solution**: You already ran the SQL! Check Table Editor - if you see 7 tables, you're good.

### "Permission denied for schema auth"
- **Solution**: This is normal! Supabase manages the `auth` schema. Your tables are in the `public` schema.

### "Can't find SQL Editor"
- **Solution**: Look for the `</>` icon in the left sidebar. It might be collapsed - click the hamburger menu.

### "Tables not showing up"
- **Solution**: Refresh the page. Sometimes Supabase UI needs a refresh to show new tables.

---

## 📞 Need Help?

If you get stuck:
1. **Check the error message** in SQL Editor (it's usually helpful!)
2. **Refresh the page** and try again
3. **Ask me!** Share the error message and I'll help debug

---

**Status**: Ready to Execute! ✅  
**Next**: Deploy to Vercel  
**Time to Beta**: ~30 minutes away! 🚀
