# 🚀 Quick Start: Online Hosting Setup
## Let's Get Code of Meridaeia Online!

**Status**: Ready to begin Phase 1 (Infrastructure Setup)  
**Estimated Time**: 1-2 hours for initial setup  
**Goal**: Deploy your game to the internet and set up the database

---

## ✅ Pre-Flight Checklist

Before you start, make sure you have:
- [x] Read BETA_DOCUMENTATION_INDEX.md (you did this!)
- [x] Read BETA_TESTING_INFRASTRUCTURE.md (the master plan)
- [x] Read DATABASE_DESIGN.md (the schema)
- [ ] A GitHub account (for version control)
- [ ] A Supabase account (we'll create this now)
- [ ] A Vercel account (we'll create this now)

---

## 🎯 Today's Mission: Get Your Game Online

We're going to do **3 things** today:

1. **Push your code to GitHub** (5 minutes)
2. **Create Supabase project & database** (15 minutes)
3. **Deploy to Vercel** (10 minutes)

After this, your game will be **live on the internet** and your friends can access it! 🎉

---

## 📝 Step 1: Push to GitHub (5 minutes)

### 1.1 Initialize Git (if not already done)

```bash
cd "/Users/monskiemonmon427/LGTM Antigravity Made Game"

# Check if git is already initialized
git status

# If you see "not a git repository", run:
git init
```

### 1.2 Create .gitignore

Create a file called `.gitignore` in your project root:

```
# macOS
.DS_Store

# Environment variables (we'll add these later)
.env
.env.local

# Node modules (if you add build tools later)
node_modules/

# Editor files
.vscode/
.idea/
```

### 1.3 Commit Your Code

```bash
# Add all files
git add .

# Commit
git commit -m "Phase 3 complete - Ready for online deployment"

# Check status
git status
```

### 1.4 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `code-of-meridaeia-siege-of-meridaeia`
3. Description: "An epic RPG-style coding practice game"
4. **Keep it Private** (for now, until beta is ready)
5. **Don't** initialize with README (you already have one)
6. Click "Create repository"

### 1.5 Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/code-of-meridaeia-siege-of-meridaeia.git

# Push
git branch -M main
git push -u origin main
```

**✅ Checkpoint**: Visit your GitHub repo URL. You should see all your files!

---

## 🗄️ Step 2: Create Supabase Project (15 minutes)

### 2.1 Sign Up for Supabase

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest option)
4. Authorize Supabase to access your GitHub

### 2.2 Create New Project

1. Click "New Project"
2. Fill in details:
   - **Organization**: Create new (or use existing)
   - **Name**: `code-of-meridaeia-beta`
   - **Database Password**: Click "Generate a password" (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `Southeast Asia (Singapore)` for you)
   - **Pricing Plan**: Free (perfect for beta!)
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning ☕

### 2.3 Save Your Credentials

Once the project is ready, you'll see the dashboard. Click on **Settings** (gear icon) → **API**:

**Copy these 3 values** (you'll need them later):
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- **Service Role Key**: (keep this SECRET, don't share!)

**Save them in a text file** (we'll use them in Step 3)

### 2.4 Initialize Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "New query"
3. Open `DATABASE_DESIGN.md` in your editor
4. Scroll to the section **"Database Initialization SQL"** (around line 500)
5. **Copy the ENTIRE SQL block** (starts with `CREATE EXTENSION...`)
6. **Paste into Supabase SQL Editor**
7. Click **Run** (or press Cmd+Enter)

You should see: ✅ Success. No rows returned

### 2.5 Verify Tables Created

1. Click **Table Editor** (left sidebar)
2. You should see 7 tables:
   - `player_profiles`
   - `hero_progress`
   - `inventory`
   - `shop_items`
   - `combat_logs`
   - `skill_tree`
   - `leaderboard_cache`

**✅ Checkpoint**: All tables visible? You're golden! 🎉

### 2.6 Seed Shop Items (Optional but Recommended)

Let's add your shop items to the database so they're ready:

1. In **SQL Editor**, create a new query
2. Paste this (based on your `shop-data.js`):

```sql
-- Insert shop items
INSERT INTO shop_items (id, name, type, cost_gold, stats, description, is_available) VALUES
('sword_of_malloc', 'Sword of Malloc', 'weapon', 100, '{"damage_multiplier": 1.25, "xp_bonus": 5}', 'Forged in the fires of memory allocation.', true),
('armor_of_segfault', 'Armor of Segfault Protection', 'armor', 150, '{"max_hints": 5, "damage_reduction": 0.2}', 'Shields you from critical errors.', true),
('scroll_of_skipping', 'Scroll of Skipping', 'consumable', 50, '{"skip_question": true}', 'Bypass one difficult question.', true);
-- Add more items from your shop-data.js
```

3. Click **Run**

**Note**: You'll need to convert all items from `shop-data.js` to SQL. We can do this together later!

---

## 🚀 Step 3: Deploy to Vercel (10 minutes)

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### 3.2 Import Your Project

1. Click "Add New..." → "Project"
2. You'll see your GitHub repos
3. Find `code-of-meridaeia-siege-of-meridaeia`
4. Click "Import"

### 3.3 Configure Project

**Framework Preset**: Other (it's a static site)

**Root Directory**: `./` (leave as default)

**Build Command**: Leave empty (no build needed)

**Output Directory**: `./` (leave as default)

### 3.4 Add Environment Variables

Click "Environment Variables" and add these 2 variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL (from Step 2.3) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key (from Step 2.3) |

**Important**: Don't add the Service Role Key here (it's too powerful for frontend)

### 3.5 Deploy!

1. Click "Deploy"
2. Wait 30-60 seconds ⏳
3. You'll see: 🎉 **Congratulations!**

### 3.6 Visit Your Live Game

Click the **"Visit"** button or the domain (e.g., `code-of-meridaeia-xxxxx.vercel.app`)

**✅ Checkpoint**: Your game loads! (It's still using IndexedDB for now, but it's ONLINE!)

---

## 🎉 Success! What You Just Did

You just:
- ✅ Pushed your code to GitHub (version control)
- ✅ Created a PostgreSQL database (8 tables, production-ready)
- ✅ Deployed your game to the internet (global CDN)
- ✅ Got a live URL (share with friends!)

**Your game is now accessible from ANY device with internet!** 📱💻

---

## 🔄 Next Steps (Week 2+)

Now that infrastructure is set up, here's what's next:

### Week 2: Authentication System
- Create login/signup UI
- Integrate Supabase Auth
- Test account creation

### Week 3-4: Database Migration
- Replace IndexedDB with Supabase calls
- Implement combat logging
- Add shop purchase validation

### Week 5-6: Leaderboard & Mobile
- Build leaderboard UI
- Optimize for mobile devices
- Test on 3+ devices

### Week 7-8: Beta Testing
- Invite friends
- Collect feedback
- Fix bugs

**Follow IMPLEMENTATION_ROADMAP.md for detailed steps!**

---

## 🛠️ Useful Commands

### Update Your Live Site (After Making Changes)

```bash
# Make your changes to the code
# Then:
git add .
git commit -m "Description of changes"
git push origin main

# Vercel auto-deploys in ~60 seconds!
```

### Check Deployment Status

Visit: https://vercel.com/dashboard

### View Database

Visit: https://supabase.com/dashboard → Your Project → Table Editor

---

## 🆘 Troubleshooting

### "Git command not found"
Install Git: https://git-scm.com/downloads

### "Permission denied (GitHub)"
Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Vercel deployment failed"
Check the build logs in Vercel dashboard. Usually it's a missing file or syntax error.

### "Supabase SQL error"
Make sure you copied the ENTIRE SQL block from DATABASE_DESIGN.md. Check for any missing semicolons.

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Ask me**: I'm here to help debug! Share error messages and I'll troubleshoot.

---

## 🎯 Today's Goal: COMPLETE! ✅

Once you finish these 3 steps, you'll have:
- ✅ Game live on the internet
- ✅ Database ready for user accounts
- ✅ Foundation for online multiplayer

**Time to celebrate!** 🎉 Then move on to Week 2 (Authentication).

---

**Document Status**: Ready to Execute  
**Estimated Time**: 1-2 hours  
**Next Document**: IMPLEMENTATION_ROADMAP.md (Week 2)

Let's make this happen! 🚀
