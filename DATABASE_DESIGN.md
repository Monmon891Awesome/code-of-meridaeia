# 🗄️ Database Design Specification
## CodeQuest: The Siege of Meridaeia

---

## 📋 Overview

This document defines the **PostgreSQL database schema** for CodeQuest's online multiplayer infrastructure. The design prioritizes:
- ✅ **Data integrity** (foreign keys, constraints)
- ✅ **Performance** (indexed queries for leaderboards)
- ✅ **Scalability** (normalized structure, no redundant data)
- ✅ **Privacy** (minimal PII, no tracking)
- ✅ **Auditability** (timestamps, logs)

---

## 🏗️ Database Architecture

### Technology Stack
- **Database**: PostgreSQL 15+ (via Supabase)
- **ORM**: Supabase JavaScript Client (auto-generated from schema)
- **Migrations**: Supabase SQL Editor (version-controlled)
- **Backups**: Automated daily backups (Supabase)

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                                  │
│  - id (UUID, PK)                                                     │
│  - username (TEXT, UNIQUE)                                           │
│  - email (TEXT, UNIQUE)                                              │
│  - created_at (TIMESTAMP)                                            │
│  - last_login (TIMESTAMP)                                            │
│  - is_active (BOOLEAN)                                               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:1
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PLAYER_PROFILES TABLE                           │
│  - id (UUID, PK)                                                     │
│  - user_id (UUID, FK → users.id)                                     │
│  - current_hero_class (TEXT)                                         │
│  - total_xp (INTEGER)                                                │
│  - total_gold (INTEGER)                                              │
│  - total_monsters_defeated (INTEGER)                                 │
│  - total_questions_answered (INTEGER)                                │
│  - total_playtime_minutes (INTEGER)                                  │
│  - leaderboard_visible (BOOLEAN)                                     │
│  - updated_at (TIMESTAMP)                                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    HERO_PROGRESS TABLE                               │
│  - id (UUID, PK)                                                     │
│  - player_id (UUID, FK → player_profiles.id)                         │
│  - hero_class (TEXT)                                                 │
│  - xp (INTEGER)                                                      │
│  - level (INTEGER)                                                   │
│  - questions_answered (INTEGER)                                      │
│  - monsters_defeated (INTEGER)                                       │
│  - current_question_index (INTEGER)                                  │
│  - last_played (TIMESTAMP)                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       INVENTORY TABLE                                │
│  - id (UUID, PK)                                                     │
│  - player_id (UUID, FK → player_profiles.id)                         │
│  - item_id (TEXT)                                                    │
│  - item_type (TEXT: 'weapon', 'armor', 'consumable')                 │
│  - quantity (INTEGER)                                                │
│  - is_equipped (BOOLEAN)                                             │
│  - acquired_at (TIMESTAMP)                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ N:1
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      SHOP_ITEMS TABLE (Reference)                    │
│  - id (TEXT, PK)                                                     │
│  - name (TEXT)                                                       │
│  - type (TEXT)                                                       │
│  - cost_gold (INTEGER)                                               │
│  - stats (JSONB)                                                     │
│  - description (TEXT)                                                │
│  - is_available (BOOLEAN)                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      COMBAT_LOGS TABLE                               │
│  - id (UUID, PK)                                                     │
│  - player_id (UUID, FK → player_profiles.id)                         │
│  - hero_class (TEXT)                                                 │
│  - question_category (TEXT)                                          │
│  - question_difficulty (TEXT)                                        │
│  - was_correct (BOOLEAN)                                             │
│  - damage_dealt (INTEGER)                                            │
│  - xp_earned (INTEGER)                                               │
│  - gold_earned (INTEGER)                                             │
│  - monster_defeated (BOOLEAN)                                        │
│  - timestamp (TIMESTAMP)                                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      LEADERBOARD_CACHE TABLE (Materialized View)     │
│  - rank (INTEGER)                                                    │
│  - player_id (UUID, FK → player_profiles.id)                         │
│  - username (TEXT)                                                   │
│  - total_xp (INTEGER)                                                │
│  - total_gold (INTEGER)                                              │
│  - monsters_defeated (INTEGER)                                       │
│  - last_updated (TIMESTAMP)                                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SKILL_TREE TABLE                                │
│  - id (UUID, PK)                                                     │
│  - player_id (UUID, FK → player_profiles.id)                         │
│  - skill_id (TEXT)                                                   │
│  - skill_level (INTEGER)                                             │
│  - unlocked_at (TIMESTAMP)                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Table Definitions

### 1. **users** (Managed by Supabase Auth)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated by Supabase Auth |
| `email` | TEXT | UNIQUE, NOT NULL | User's email (for login) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| `last_login` | TIMESTAMP | NULLABLE | Last successful login |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status (for bans) |

**Notes**:
- This table is auto-managed by Supabase Authentication
- Passwords are hashed and stored separately (not in this table)
- We'll add a custom `username` field via a trigger

---

### 2. **player_profiles**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `user_id` | UUID | FOREIGN KEY (users.id), UNIQUE | Links to auth user |
| `username` | TEXT | UNIQUE, NOT NULL, CHECK(length >= 3 AND length <= 20) | Display name |
| `current_hero_class` | TEXT | NULLABLE | Last played hero (Java, C++, etc.) |
| `total_xp` | INTEGER | DEFAULT 0, CHECK(>= 0) | Cumulative XP across all heroes |
| `total_gold` | INTEGER | DEFAULT 0, CHECK(>= 0) | Current gold balance |
| `total_monsters_defeated` | INTEGER | DEFAULT 0 | Lifetime monster kills |
| `total_questions_answered` | INTEGER | DEFAULT 0 | Lifetime questions attempted |
| `total_playtime_minutes` | INTEGER | DEFAULT 0 | Total time in-game |
| `leaderboard_visible` | BOOLEAN | DEFAULT TRUE | Privacy setting |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Profile creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last profile update |

**Indexes**:
- `idx_total_xp` on `total_xp DESC` (for leaderboard queries)
- `idx_username` on `username` (for search)

---

### 3. **hero_progress**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `player_id` | UUID | FOREIGN KEY (player_profiles.id) | Player reference |
| `hero_class` | TEXT | NOT NULL, CHECK(IN ['Java', 'C++', 'Networking', 'Data Engineering', 'Kernel Dev']) | Hero category |
| `xp` | INTEGER | DEFAULT 0 | XP for this specific hero |
| `level` | INTEGER | DEFAULT 1 | Calculated level (1-50) |
| `questions_answered` | INTEGER | DEFAULT 0 | Questions answered as this hero |
| `monsters_defeated` | INTEGER | DEFAULT 0 | Monsters killed as this hero |
| `current_question_index` | INTEGER | DEFAULT 0 | Resume point (0-based index) |
| `last_played` | TIMESTAMP | DEFAULT NOW() | Last session timestamp |

**Unique Constraint**: `(player_id, hero_class)` (one row per hero per player)

**Indexes**:
- `idx_hero_xp` on `(hero_class, xp DESC)` (for category leaderboards)

---

### 4. **inventory**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `player_id` | UUID | FOREIGN KEY (player_profiles.id) | Player reference |
| `item_id` | TEXT | NOT NULL | References shop_items.id |
| `item_type` | TEXT | CHECK(IN ['weapon', 'armor', 'consumable', 'accessory']) | Item category |
| `quantity` | INTEGER | DEFAULT 1, CHECK(> 0) | Stack size (for consumables) |
| `is_equipped` | BOOLEAN | DEFAULT FALSE | Currently active (weapons/armor only) |
| `acquired_at` | TIMESTAMP | DEFAULT NOW() | Purchase timestamp |

**Unique Constraint**: `(player_id, item_id)` (prevent duplicate non-stackable items)

**Indexes**:
- `idx_player_inventory` on `(player_id, is_equipped)` (fetch equipped items)

---

### 5. **shop_items** (Reference Table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Item identifier (e.g., 'sword_of_malloc') |
| `name` | TEXT | NOT NULL | Display name |
| `type` | TEXT | NOT NULL | 'weapon', 'armor', 'consumable', etc. |
| `cost_gold` | INTEGER | NOT NULL, CHECK(> 0) | Purchase price |
| `stats` | JSONB | NULLABLE | Item modifiers (e.g., {"xp_multiplier": 1.5}) |
| `description` | TEXT | NULLABLE | Flavor text |
| `is_available` | BOOLEAN | DEFAULT TRUE | For seasonal items |

**Example Row**:
```json
{
  "id": "sword_of_malloc",
  "name": "Sword of Malloc",
  "type": "weapon",
  "cost_gold": 100,
  "stats": {"damage_multiplier": 1.25, "xp_bonus": 5},
  "description": "Forged in the fires of memory allocation.",
  "is_available": true
}
```

---

### 6. **combat_logs**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `player_id` | UUID | FOREIGN KEY (player_profiles.id) | Player reference |
| `hero_class` | TEXT | NOT NULL | Hero used in combat |
| `question_category` | TEXT | NOT NULL | Java, C++, etc. |
| `question_difficulty` | TEXT | CHECK(IN ['Easy', 'Medium', 'Hard']) | Question tier |
| `was_correct` | BOOLEAN | NOT NULL | Answer correctness |
| `damage_dealt` | INTEGER | DEFAULT 0 | Damage to monster (0 if wrong) |
| `xp_earned` | INTEGER | DEFAULT 0 | XP reward |
| `gold_earned` | INTEGER | DEFAULT 0 | Gold reward |
| `monster_defeated` | BOOLEAN | DEFAULT FALSE | Monster killed this turn |
| `timestamp` | TIMESTAMP | DEFAULT NOW() | Combat event time |

**Purpose**: Analytics, anti-cheat detection, player insights

**Indexes**:
- `idx_player_logs` on `(player_id, timestamp DESC)` (recent activity)
- `idx_combat_timestamp` on `timestamp DESC` (global activity feed)

---

### 7. **leaderboard_cache** (Materialized View)

| Column | Type | Description |
|--------|------|-------------|
| `rank` | INTEGER | Player's global rank |
| `player_id` | UUID | Player reference |
| `username` | TEXT | Display name |
| `total_xp` | INTEGER | Cumulative XP |
| `total_gold` | INTEGER | Current gold |
| `monsters_defeated` | INTEGER | Lifetime kills |
| `last_updated` | TIMESTAMP | Cache refresh time |

**Refresh Strategy**: Rebuild every 5 minutes via cron job (Supabase Edge Function)

**SQL Definition**:
```sql
CREATE MATERIALIZED VIEW leaderboard_cache AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY total_xp DESC) AS rank,
  pp.id AS player_id,
  pp.username,
  pp.total_xp,
  pp.total_gold,
  pp.total_monsters_defeated AS monsters_defeated,
  NOW() AS last_updated
FROM player_profiles pp
WHERE pp.leaderboard_visible = TRUE
  AND pp.is_active = TRUE
ORDER BY total_xp DESC
LIMIT 100;
```

---

### 8. **skill_tree**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `player_id` | UUID | FOREIGN KEY (player_profiles.id) | Player reference |
| `skill_id` | TEXT | NOT NULL | Skill identifier (e.g., 'timer_boost') |
| `skill_level` | INTEGER | DEFAULT 1, CHECK(>= 1 AND <= 5) | Upgrade tier |
| `unlocked_at` | TIMESTAMP | DEFAULT NOW() | First unlock time |

**Unique Constraint**: `(player_id, skill_id)` (one skill per player)

**Example Skills**:
- `timer_boost`: +5 seconds per level
- `auto_hint`: Reveal 1 hint automatically
- `xp_multiplier`: +10% XP per level

---

## 🔒 Security & Privacy Features

### Row-Level Security (RLS) Policies

Supabase allows defining **who can access what data** at the database level:

#### **player_profiles**
```sql
-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON player_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

#### **inventory**
```sql
-- Users can only see their own inventory
CREATE POLICY "Users can view own inventory"
  ON inventory FOR SELECT
  USING (player_id IN (
    SELECT id FROM player_profiles WHERE user_id = auth.uid()
  ));
```

#### **leaderboard_cache**
```sql
-- Everyone can read leaderboard (public data)
CREATE POLICY "Leaderboard is public"
  ON leaderboard_cache FOR SELECT
  USING (TRUE);
```

---

## 📈 Performance Optimizations

### 1. **Indexing Strategy**
- All foreign keys auto-indexed
- Composite indexes on `(player_id, timestamp)` for logs
- Partial indexes on `leaderboard_visible = TRUE`

### 2. **Query Optimization**
- Use materialized views for leaderboards (avoid real-time aggregation)
- Limit combat logs to last 30 days (archive older data)
- Paginate leaderboard (show top 100, not all users)

### 3. **Caching**
- Client-side: Cache shop items (rarely change)
- Server-side: Redis cache for leaderboard (future upgrade)

---

## 🔄 Data Migration Plan

### From IndexedDB to PostgreSQL

**Phase 1: Dual-Write Mode** (Testing)
- Keep IndexedDB active
- Write to both IndexedDB AND Supabase
- Compare results for consistency

**Phase 2: Read from Supabase** (Validation)
- Fetch data from Supabase on login
- Fall back to IndexedDB if API fails

**Phase 3: Supabase-Only** (Production)
- Remove all IndexedDB code
- Server is the single source of truth

---

## 🛠️ Database Initialization SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create player_profiles table
CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL CHECK(LENGTH(username) >= 3 AND LENGTH(username) <= 20),
  current_hero_class TEXT,
  total_xp INTEGER DEFAULT 0 CHECK(total_xp >= 0),
  total_gold INTEGER DEFAULT 0 CHECK(total_gold >= 0),
  total_monsters_defeated INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_playtime_minutes INTEGER DEFAULT 0,
  leaderboard_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create hero_progress table
CREATE TABLE hero_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  hero_class TEXT NOT NULL CHECK(hero_class IN ('Java', 'C++', 'Networking', 'Data Engineering', 'Kernel Dev')),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  questions_answered INTEGER DEFAULT 0,
  monsters_defeated INTEGER DEFAULT 0,
  current_question_index INTEGER DEFAULT 0,
  last_played TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, hero_class)
);

-- Create inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT CHECK(item_type IN ('weapon', 'armor', 'consumable', 'accessory')),
  quantity INTEGER DEFAULT 1 CHECK(quantity > 0),
  is_equipped BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, item_id)
);

-- Create shop_items table
CREATE TABLE shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  cost_gold INTEGER NOT NULL CHECK(cost_gold > 0),
  stats JSONB,
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE
);

-- Create combat_logs table
CREATE TABLE combat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  hero_class TEXT NOT NULL,
  question_category TEXT NOT NULL,
  question_difficulty TEXT CHECK(question_difficulty IN ('Easy', 'Medium', 'Hard')),
  was_correct BOOLEAN NOT NULL,
  damage_dealt INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  monster_defeated BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create skill_tree table
CREATE TABLE skill_tree (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id TEXT NOT NULL,
  skill_level INTEGER DEFAULT 1 CHECK(skill_level >= 1 AND skill_level <= 5),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, skill_id)
);

-- Create indexes
CREATE INDEX idx_total_xp ON player_profiles(total_xp DESC);
CREATE INDEX idx_username ON player_profiles(username);
CREATE INDEX idx_hero_xp ON hero_progress(hero_class, xp DESC);
CREATE INDEX idx_player_inventory ON inventory(player_id, is_equipped);
CREATE INDEX idx_player_logs ON combat_logs(player_id, timestamp DESC);
CREATE INDEX idx_combat_timestamp ON combat_logs(timestamp DESC);

-- Create leaderboard materialized view
CREATE MATERIALIZED VIEW leaderboard_cache AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY total_xp DESC) AS rank,
  pp.id AS player_id,
  pp.username,
  pp.total_xp,
  pp.total_gold,
  pp.total_monsters_defeated AS monsters_defeated,
  NOW() AS last_updated
FROM player_profiles pp
WHERE pp.leaderboard_visible = TRUE
ORDER BY total_xp DESC
LIMIT 100;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_profiles_updated_at
BEFORE UPDATE ON player_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 Sample Queries

### 1. Get Player's Full State (On Login)
```sql
SELECT 
  pp.*,
  json_agg(DISTINCT hp.*) AS hero_progress,
  json_agg(DISTINCT inv.*) AS inventory
FROM player_profiles pp
LEFT JOIN hero_progress hp ON hp.player_id = pp.id
LEFT JOIN inventory inv ON inv.player_id = pp.id
WHERE pp.user_id = $1
GROUP BY pp.id;
```

### 2. Update Player XP and Gold (After Combat)
```sql
UPDATE player_profiles
SET 
  total_xp = total_xp + $2,
  total_gold = total_gold + $3,
  total_monsters_defeated = total_monsters_defeated + $4,
  total_questions_answered = total_questions_answered + 1
WHERE id = $1
RETURNING *;
```

### 3. Get Top 10 Leaderboard
```sql
SELECT * FROM leaderboard_cache
ORDER BY rank ASC
LIMIT 10;
```

### 4. Get Player's Rank
```sql
SELECT rank FROM leaderboard_cache
WHERE player_id = $1;
```

---

## 🎯 Data Retention Policy

| Data Type | Retention Period | Action |
|-----------|------------------|--------|
| User Accounts | Indefinite | Soft delete (set `is_active = FALSE`) |
| Combat Logs | 90 days | Archive to cold storage, then delete |
| Leaderboard Cache | Real-time | Refresh every 5 minutes |
| Inventory | Indefinite | Tied to account lifecycle |

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-27 | Initial schema design |

---

**Document Status**: Ready for Implementation  
**Estimated Setup Time**: 2-3 hours (including Supabase configuration)  
**Next Step**: Review IMPLEMENTATION_ROADMAP.md for migration guide
