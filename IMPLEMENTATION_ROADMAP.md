# 🛠️ Implementation Roadmap
## Code of Meridaeia: Migration to Online Multiplayer Infrastructure

---

## 📋 Overview

This document provides a **step-by-step technical implementation plan** for migrating Code of Meridaeia from a local IndexedDB-based game to a fully online multiplayer experience with user accounts, leaderboards, and server-authoritative progression.

**Estimated Timeline**: 4-6 weeks (part-time development)  
**Difficulty**: Intermediate (requires JavaScript, SQL, REST API knowledge)  
**Prerequisites**: Basic understanding of async/await, fetch API, PostgreSQL

---

## 🎯 Implementation Phases

### Phase Overview

| Phase | Focus | Duration | Deliverable |
|-------|-------|----------|-------------|
| **Phase 1** | Infrastructure Setup | 1 week | Supabase + Vercel configured |
| **Phase 2** | Authentication System | 1 week | Login/Signup UI working |
| **Phase 3** | Database Migration | 1-2 weeks | All game data in PostgreSQL |
| **Phase 4** | Leaderboard System | 1 week | Real-time rankings |
| **Phase 5** | Mobile Optimization | 1 week | Responsive design |
| **Phase 6** | Beta Testing | 1-2 weeks | Bug fixes, polish |

---

## 📅 Phase 1: Infrastructure Setup (Week 1)

### Objectives
- ✅ Create Supabase project
- ✅ Deploy to Vercel
- ✅ Set up environment variables
- ✅ Initialize database schema

### Step-by-Step Guide

#### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in details:
   - **Name**: `codequest-beta`
   - **Database Password**: Generate strong password (save in password manager!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Wait 2-3 minutes for provisioning
5. Copy **Project URL** and **Anon Key** (you'll need these later)

#### 1.2 Initialize Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire SQL from `DATABASE_DESIGN.md` (section "Database Initialization SQL")
3. Paste into SQL Editor and click **Run**
4. Verify tables created: Go to **Table Editor** → Should see 7 tables

#### 1.3 Configure Row-Level Security (RLS)

1. In **SQL Editor**, run:
```sql
-- Enable RLS on all tables
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_tree ENABLE ROW LEVEL SECURITY;

-- Create policies (see DATABASE_DESIGN.md for full policies)
CREATE POLICY "Users can view own profile"
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Repeat for other tables (see DATABASE_DESIGN.md)
```

#### 1.4 Deploy to Vercel

1. Push your code to GitHub (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/codequest.git
git push -u origin main
```

2. Go to https://vercel.com and sign up
3. Click "Import Project" → Select your GitHub repo
4. Configure:
   - **Framework Preset**: Other (static site)
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: `./`
5. Add **Environment Variables**:
   - `VITE_SUPABASE_URL` = Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
6. Click **Deploy**
7. Wait 60 seconds → Your game is live at `https://codequest-xxxxx.vercel.app`

#### 1.5 Test Deployment

1. Visit your Vercel URL
2. Open browser console (F12)
3. Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Should see your Supabase URL (if not, check environment variables)

---

## 📅 Phase 2: Authentication System (Week 2)

### Objectives
- ✅ Create login/signup UI
- ✅ Integrate Supabase Auth
- ✅ Implement session management
- ✅ Add password reset flow

### Step-by-Step Guide

#### 2.1 Install Supabase Client

Create a new file: `supabase-client.js`

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### 2.2 Create Authentication UI

Add to `index.html` (before game content):

```html
<!-- Auth Modal -->
<div id="authModal" class="modal">
  <div class="modal-content">
    <h2 id="authTitle">Welcome to Code of Meridaeia</h2>
    
    <!-- Login Form -->
    <form id="loginForm" class="auth-form">
      <input type="email" id="loginEmail" placeholder="Email" required>
      <input type="password" id="loginPassword" placeholder="Password" required>
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="#" id="showSignup">Sign Up</a></p>
    </form>
    
    <!-- Signup Form (hidden by default) -->
    <form id="signupForm" class="auth-form hidden">
      <input type="text" id="signupUsername" placeholder="Username (3-20 chars)" required>
      <input type="email" id="signupEmail" placeholder="Email" required>
      <input type="password" id="signupPassword" placeholder="Password (min 8 chars)" required>
      <button type="submit">Create Account</button>
      <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
    </form>
  </div>
</div>
```

#### 2.3 Implement Auth Logic

Create `auth.js`:

```javascript
import { supabase } from './supabase-client.js';

// Check if user is logged in on page load
export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // User is logged in
    hideAuthModal();
    await loadPlayerData(session.user.id);
  } else {
    // Show login screen
    showAuthModal();
  }
}

// Login function
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    alert(`Login failed: ${error.message}`);
    return false;
  }
  
  hideAuthModal();
  await loadPlayerData(data.user.id);
  return true;
}

// Signup function
export async function signup(username, email, password) {
  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    alert(`Signup failed: ${authError.message}`);
    return false;
  }
  
  // Step 2: Create player profile
  const { error: profileError } = await supabase
    .from('player_profiles')
    .insert({
      user_id: authData.user.id,
      username: username
    });
  
  if (profileError) {
    alert(`Profile creation failed: ${profileError.message}`);
    return false;
  }
  
  alert('Account created! Please check your email to verify.');
  return true;
}

// Logout function
export async function logout() {
  await supabase.auth.signOut();
  location.reload(); // Refresh page to show login screen
}

// Load player data from database
async function loadPlayerData(userId) {
  const { data, error } = await supabase
    .from('player_profiles')
    .select(`
      *,
      hero_progress (*),
      inventory (*)
    `)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Failed to load player data:', error);
    return;
  }
  
  // Store in global state (replace IndexedDB)
  window.playerData = data;
  console.log('Player data loaded:', data);
}

function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
}

function hideAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}
```

#### 2.4 Wire Up Event Listeners

In `game.js`, add:

```javascript
import { checkAuth, login, signup, logout } from './auth.js';

// On page load
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  
  // Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await login(email, password);
  });
  
  // Signup form
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    await signup(username, email, password);
  });
  
  // Toggle forms
  document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
  });
  
  document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  });
});
```

---

## 📅 Phase 3: Database Migration (Weeks 3-4)

### Objectives
- ✅ Replace IndexedDB with Supabase calls
- ✅ Implement server-side XP/Gold validation
- ✅ Add combat logging
- ✅ Sync shop purchases

### Step-by-Step Guide

#### 3.1 Create Database Service Layer

Create `db-service.js`:

```javascript
import { supabase } from './supabase-client.js';

// Get current player profile
export async function getPlayerProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error) throw error;
  return data;
}

// Update player XP and Gold (after combat)
export async function updatePlayerProgress(xpGained, goldGained, monstersDefeated = 0) {
  const profile = await getPlayerProfile();
  
  const { data, error } = await supabase
    .from('player_profiles')
    .update({
      total_xp: profile.total_xp + xpGained,
      total_gold: profile.total_gold + goldGained,
      total_monsters_defeated: profile.total_monsters_defeated + monstersDefeated,
      total_questions_answered: profile.total_questions_answered + 1
    })
    .eq('id', profile.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Log combat event
export async function logCombat(heroClass, category, difficulty, wasCorrect, damage, xp, gold, monsterDefeated) {
  const profile = await getPlayerProfile();
  
  const { error } = await supabase
    .from('combat_logs')
    .insert({
      player_id: profile.id,
      hero_class: heroClass,
      question_category: category,
      question_difficulty: difficulty,
      was_correct: wasCorrect,
      damage_dealt: damage,
      xp_earned: xp,
      gold_earned: gold,
      monster_defeated: monsterDefeated
    });
  
  if (error) throw error;
}

// Purchase item from shop
export async function purchaseItem(itemId, itemType, cost) {
  const profile = await getPlayerProfile();
  
  // Check if player has enough gold
  if (profile.total_gold < cost) {
    throw new Error('Insufficient gold');
  }
  
  // Deduct gold
  await supabase
    .from('player_profiles')
    .update({ total_gold: profile.total_gold - cost })
    .eq('id', profile.id);
  
  // Add item to inventory
  const { error } = await supabase
    .from('inventory')
    .insert({
      player_id: profile.id,
      item_id: itemId,
      item_type: itemType,
      quantity: 1
    });
  
  if (error) throw error;
}

// Get player's inventory
export async function getInventory() {
  const profile = await getPlayerProfile();
  
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('player_id', profile.id);
  
  if (error) throw error;
  return data;
}
```

#### 3.2 Replace IndexedDB Calls

In `game.js`, find all `database.js` calls and replace:

**Before (IndexedDB)**:
```javascript
await db.updateProgress(category, {
  xp: currentXP + xpGained,
  gold: currentGold + goldGained
});
```

**After (Supabase)**:
```javascript
import { updatePlayerProgress, logCombat } from './db-service.js';

await updatePlayerProgress(xpGained, goldGained, monstersDefeated);
await logCombat(heroClass, category, difficulty, wasCorrect, damage, xpGained, goldGained, monsterDefeated);
```

#### 3.3 Update Shop System

In `shop.js` (or wherever shop logic lives):

```javascript
import { purchaseItem, getInventory } from './db-service.js';

async function buyItem(item) {
  try {
    await purchaseItem(item.id, item.type, item.cost);
    alert(`Purchased ${item.name}!`);
    await refreshInventory();
  } catch (error) {
    alert(error.message);
  }
}

async function refreshInventory() {
  const inventory = await getInventory();
  // Update UI to show owned items
  displayInventory(inventory);
}
```

---

## 📅 Phase 4: Leaderboard System (Week 5)

### Objectives
- ✅ Create leaderboard UI
- ✅ Fetch top players from database
- ✅ Show player's rank
- ✅ Add real-time updates

### Step-by-Step Guide

#### 4.1 Create Leaderboard UI

Add to `index.html`:

```html
<div id="leaderboardModal" class="modal">
  <div class="modal-content">
    <h2>🏆 Global Leaderboard</h2>
    <div class="leaderboard-tabs">
      <button class="tab active" data-type="xp">Top XP</button>
      <button class="tab" data-type="gold">Top Gold</button>
      <button class="tab" data-type="monsters">Monster Slayers</button>
    </div>
    <div id="leaderboardList"></div>
    <p id="playerRank"></p>
    <button onclick="closeLeaderboard()">Close</button>
  </div>
</div>
```

#### 4.2 Implement Leaderboard Logic

Create `leaderboard.js`:

```javascript
import { supabase } from './supabase-client.js';

export async function showLeaderboard(type = 'xp') {
  const leaderboard = await fetchLeaderboard(type);
  const playerRank = await getPlayerRank(type);
  
  displayLeaderboard(leaderboard, playerRank);
  document.getElementById('leaderboardModal').classList.add('active');
}

async function fetchLeaderboard(type) {
  let orderBy = 'total_xp';
  if (type === 'gold') orderBy = 'total_gold';
  if (type === 'monsters') orderBy = 'total_monsters_defeated';
  
  const { data, error } = await supabase
    .from('player_profiles')
    .select('username, total_xp, total_gold, total_monsters_defeated')
    .eq('leaderboard_visible', true)
    .order(orderBy, { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data;
}

async function getPlayerRank(type) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('player_profiles')
    .select('id, total_xp, total_gold, total_monsters_defeated')
    .eq('user_id', user.id)
    .single();
  
  // Count how many players have higher score
  let column = 'total_xp';
  if (type === 'gold') column = 'total_gold';
  if (type === 'monsters') column = 'total_monsters_defeated';
  
  const { count } = await supabase
    .from('player_profiles')
    .select('*', { count: 'exact', head: true })
    .gt(column, profile[column]);
  
  return count + 1; // Rank is count + 1
}

function displayLeaderboard(data, rank) {
  const list = document.getElementById('leaderboardList');
  list.innerHTML = data.map((player, index) => `
    <div class="leaderboard-row">
      <span class="rank">#${index + 1}</span>
      <span class="username">${player.username}</span>
      <span class="stats">${player.total_xp} XP | ${player.total_gold} Gold</span>
    </div>
  `).join('');
  
  document.getElementById('playerRank').textContent = `Your Rank: #${rank}`;
}
```

---

## 📅 Phase 5: Mobile Optimization (Week 6)

### Objectives
- ✅ Responsive CSS breakpoints
- ✅ Touch-friendly buttons
- ✅ Test on real devices

### Step-by-Step Guide

#### 5.1 Add Viewport Meta Tag

In `index.html` `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

#### 5.2 Update CSS for Mobile

In `styles.css`, add:

```css
/* Mobile Breakpoint */
@media (max-width: 768px) {
  /* Stack combat UI vertically */
  .combat-container {
    flex-direction: column;
  }
  
  /* Larger buttons */
  button {
    min-height: 44px;
    font-size: 16px;
    padding: 12px 24px;
  }
  
  /* Full-width modals */
  .modal-content {
    width: 95%;
    max-width: 100%;
  }
  
  /* Hide complex animations on mobile (performance) */
  .particle-effect {
    display: none;
  }
}

/* Touch-friendly spacing */
@media (hover: none) {
  .category-card {
    margin: 16px 0;
  }
}
```

#### 5.3 Test on Mobile Devices

1. **Chrome DevTools**: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. **Real Device Testing**:
   - Visit your Vercel URL on your phone
   - Test login, gameplay, shop, leaderboard
   - Check for layout issues

---

## 📅 Phase 6: Beta Testing & Polish (Weeks 7-8)

### Objectives
- ✅ Invite beta testers
- ✅ Collect feedback
- ✅ Fix bugs
- ✅ Optimize performance

### Step-by-Step Guide

#### 6.1 Create Beta Tester Guide

Create `BETA_TESTER_GUIDE.md`:

```markdown
# Code of Meridaeia Beta Testing Guide

## How to Access
1. Visit: https://codequest-beta.vercel.app
2. Create an account (use a real email for password recovery)
3. Choose your hero and start playing!

## What to Test
- [ ] Login/Signup flow
- [ ] Character selection
- [ ] Combat mechanics (answer questions, defeat monsters)
- [ ] Shop system (buy items, equip gear)
- [ ] Leaderboard (check your rank)
- [ ] Mobile gameplay (if you have a phone)

## How to Report Bugs
- **Discord**: [Link to beta channel]
- **Email**: [your-email@example.com]
- **In-Game**: Click "Report Bug" button in settings

## Known Issues
- [ ] (List any known bugs here)

Thank you for testing! 🎮
```

#### 6.2 Set Up Feedback Collection

Add a feedback form to `index.html`:

```html
<div id="feedbackModal" class="modal">
  <div class="modal-content">
    <h2>Report a Bug</h2>
    <form id="feedbackForm">
      <textarea id="feedbackText" placeholder="Describe the issue..." required></textarea>
      <button type="submit">Submit</button>
    </form>
  </div>
</div>
```

In `game.js`:

```javascript
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const feedback = document.getElementById('feedbackText').value;
  
  // Log to Supabase (create a 'feedback' table)
  await supabase.from('feedback').insert({
    player_id: window.playerData.id,
    message: feedback,
    timestamp: new Date().toISOString()
  });
  
  alert('Thank you for your feedback!');
  document.getElementById('feedbackModal').classList.remove('active');
});
```

#### 6.3 Monitor Performance

1. **Vercel Analytics**: Enable in Vercel dashboard (free tier)
2. **Supabase Logs**: Check for slow queries in Supabase dashboard
3. **Browser Performance**: Use Chrome DevTools → Performance tab

---

## 🔧 Troubleshooting Guide

### Common Issues

| Issue | Solution |
|-------|----------|
| **"Failed to fetch"** | Check CORS settings in Supabase (should allow your Vercel domain) |
| **"Row-level security policy violated"** | Verify RLS policies are set correctly |
| **"User not found"** | Ensure player_profile is created after signup |
| **Slow leaderboard** | Use materialized view (see DATABASE_DESIGN.md) |
| **Mobile layout broken** | Check viewport meta tag, test in Chrome DevTools |

---

## 📊 Testing Checklist

### Pre-Launch Checklist

- [ ] All tables created in Supabase
- [ ] RLS policies enabled and tested
- [ ] Authentication works (login, signup, logout)
- [ ] Player data saves correctly
- [ ] Shop purchases deduct gold
- [ ] Leaderboard shows correct rankings
- [ ] Mobile layout looks good on 3+ devices
- [ ] Privacy policy linked in footer
- [ ] Beta tester guide written
- [ ] Feedback form working

---

## 🚀 Deployment Checklist

### Going Live

- [ ] Push final code to GitHub `main` branch
- [ ] Vercel auto-deploys (check deployment logs)
- [ ] Test production URL on multiple devices
- [ ] Share URL with beta testers
- [ ] Monitor Supabase dashboard for errors
- [ ] Set up Discord channel for feedback
- [ ] Announce beta launch! 🎉

---

## 📈 Post-Launch Monitoring

### Week 1 After Launch

- [ ] Check daily active users (Supabase dashboard)
- [ ] Review combat logs for cheating patterns
- [ ] Respond to bug reports within 24 hours
- [ ] Collect feedback survey responses
- [ ] Plan Phase 7 features (chat, guilds, etc.)

---

## 🎯 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Beta Testers** | 20+ friends | Supabase user count |
| **Daily Active Users** | 10+ | Supabase analytics |
| **Average Playtime** | 30+ minutes | `total_playtime_minutes` |
| **Bug Reports** | <5 critical bugs | Feedback table |
| **Leaderboard Engagement** | 80% opt-in | `leaderboard_visible = TRUE` count |

---

## 📝 Next Steps After Beta

### Phase 7: Community Features (Future)

- [ ] Real-time chat (Supabase Realtime)
- [ ] Guilds/Clans system
- [ ] Daily challenges
- [ ] Seasonal events
- [ ] PvP duels (question races)

---

**Document Status**: Ready for Implementation  
**Estimated Completion**: 6-8 weeks (part-time)  
**Next Step**: Start with Phase 1 (Infrastructure Setup)
