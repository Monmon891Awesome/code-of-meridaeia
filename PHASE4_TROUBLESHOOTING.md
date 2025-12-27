# 🔧 Phase 4 Troubleshooting Guide

## ❌ Current Issue: 401 Unauthorized Error

### Error Details:
```
{message: "Invalid API key", hint: "Double check your Supabase 'anon' or 'service_role' API key."}
```

**Location**: `leaderboard.js:155:20` and `leaderboard.js:128:20`

---

## 🎯 Root Cause Analysis

The leaderboard code is working correctly, but the **Supabase database is not set up yet**. The 401 error typically means:

1. ❌ The `player_profiles` table doesn't exist in Supabase
2. ❌ Row-Level Security (RLS) policies are blocking access
3. ❌ The table exists but has no data

---

## ✅ Solution: Set Up Supabase Database

### Step 1: Create the `player_profiles` Table

Go to your Supabase dashboard and run this SQL:

```sql
-- Create player_profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    total_xp INTEGER DEFAULT 0,
    total_gold INTEGER DEFAULT 0,
    total_monsters_defeated INTEGER DEFAULT 0,
    leaderboard_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX idx_player_profiles_total_xp ON player_profiles(total_xp DESC);
CREATE INDEX idx_player_profiles_total_gold ON player_profiles(total_gold DESC);
CREATE INDEX idx_player_profiles_total_monsters ON player_profiles(total_monsters_defeated DESC);
CREATE INDEX idx_player_profiles_leaderboard ON player_profiles(leaderboard_visible) WHERE leaderboard_visible = true;
```

### Step 2: Enable Row-Level Security (RLS)

```sql
-- Enable RLS on the table
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard data (public leaderboard)
CREATE POLICY "Anyone can view leaderboard"
    ON player_profiles
    FOR SELECT
    USING (leaderboard_visible = true);

-- Allow users to view their own profile (even if hidden from leaderboard)
CREATE POLICY "Users can view own profile"
    ON player_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON player_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
    ON player_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Step 3: Add Sample Data (For Testing)

```sql
-- Insert test players (replace with real data later)
INSERT INTO player_profiles (username, total_xp, total_gold, total_monsters_defeated, leaderboard_visible)
VALUES 
    ('CodeMaster', 15420, 8500, 142, true),
    ('ByteWarrior', 12350, 6200, 98, true),
    ('DevNinja', 10890, 5400, 87, true),
    ('HackerPro', 9450, 4800, 76, true),
    ('SyntaxSlayer', 8230, 4100, 65, true),
    ('BugHunter', 7650, 3900, 58, true),
    ('LogicLord', 6890, 3500, 52, true),
    ('AlgoAce', 6120, 3100, 47, true),
    ('DataDruid', 5540, 2800, 42, true),
    ('QueryQueen', 4980, 2500, 38, true)
ON CONFLICT (username) DO NOTHING;
```

---

## 🧪 Verification Steps

### 1. Check if Table Exists
```sql
SELECT * FROM player_profiles LIMIT 10;
```

**Expected**: Should return rows (or empty table if no data)  
**If Error**: Table doesn't exist, run Step 1 above

### 2. Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'player_profiles';
```

**Expected**: Should show 4 policies  
**If Empty**: Run Step 2 above

### 3. Test Leaderboard Query
```sql
SELECT username, total_xp, total_gold, total_monsters_defeated
FROM player_profiles
WHERE leaderboard_visible = true
ORDER BY total_xp DESC
LIMIT 10;
```

**Expected**: Should return top 10 players  
**If Error**: Check RLS policies

---

## 🔄 After Running SQL

1. **Refresh the game**: https://code-of-meridaeia.vercel.app/
2. **Click** the 🏆 Leaderboard button
3. **Verify**: Should now show player data (or "No players" if table is empty)

---

## 🎮 Alternative: Test Without Database

If you want to test the UI without setting up Supabase yet, you can modify `leaderboard.js` temporarily:

### Option A: Mock Data (Quick Test)
Add this to `leaderboard.js` after line 160:

```javascript
// TEMPORARY: Return mock data for testing
if (!data || data.length === 0) {
    return [
        { username: 'TestPlayer1', total_xp: 1000, total_gold: 500, total_monsters_defeated: 10 },
        { username: 'TestPlayer2', total_xp: 800, total_gold: 400, total_monsters_defeated: 8 },
        { username: 'TestPlayer3', total_xp: 600, total_gold: 300, total_monsters_defeated: 6 }
    ];
}
```

### Option B: Disable Supabase (Local Only)
Comment out the Supabase fetch and show empty state:

```javascript
// In fetchLeaderboard(), replace lines 148-160 with:
return []; // Empty leaderboard for now
```

---

## 📊 Expected Behavior After Fix

### ✅ With Data:
- Leaderboard shows top 100 players
- Top 3 have medals (🥇🥈🥉)
- Tabs switch between XP/Gold/Monsters
- Your rank shows at bottom

### ✅ Without Data:
- Shows "No players on the leaderboard yet!"
- No errors in console
- UI still works (tabs, close, refresh)

---

## 🚨 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Table doesn't exist or RLS blocking | Run SQL from Step 1 & 2 |
| **Empty leaderboard** | No data in table | Run SQL from Step 3 (sample data) |
| **"Invalid API key"** | Wrong Supabase URL/Key | Check credentials in `leaderboard.js` |
| **Infinite loading** | Network issue | Check browser console for errors |

---

## 📝 Quick Fix Checklist

- [ ] Go to Supabase dashboard: https://supabase.com/dashboard/project/rocvmzuccptzypnensyu
- [ ] Click **SQL Editor** in left sidebar
- [ ] Copy SQL from **Step 1** above
- [ ] Click **Run** button
- [ ] Copy SQL from **Step 2** above
- [ ] Click **Run** button
- [ ] (Optional) Copy SQL from **Step 3** for test data
- [ ] Click **Run** button
- [ ] Refresh the game and test leaderboard

---

## 🎉 Success Indicators

When everything is working:
- ✅ No console errors
- ✅ Leaderboard loads in <1 second
- ✅ Player names and scores display
- ✅ Tabs switch smoothly
- ✅ Your rank shows correctly

---

## 🔗 Helpful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/rocvmzuccptzypnensyu
- **SQL Editor**: https://supabase.com/dashboard/project/rocvmzuccptzypnensyu/editor
- **Table Editor**: https://supabase.com/dashboard/project/rocvmzuccptzypnensyu/editor
- **RLS Policies**: https://supabase.com/dashboard/project/rocvmzuccptzypnensyu/auth/policies

---

**Next Step**: Run the SQL queries above in your Supabase dashboard, then test the leaderboard again!
