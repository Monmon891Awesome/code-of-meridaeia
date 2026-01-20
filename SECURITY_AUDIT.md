# Security Audit Report

## 1. Hardcoded Credentials in Client-Side Code

**File:** `leaderboard.js`

**Finding:**
The file contains hardcoded Supabase credentials:
```javascript
const SUPABASE_URL = 'https://rocvmzuccptzypnensyu.supabase.co';
const SUPABASE_ANON_KEY = '...';
```

**Risk Analysis:**
While Supabase Anon Keys are designed to be public, their safety relies entirely on correctly configured Row Level Security (RLS) policies on the backend. If RLS is permissive or disabled, these credentials allow full read/write access to the database.

**Recommendation:**
- Ensure RLS is strictly configured.
- Consider moving credentials to a configuration file that can be environment-specific, although for a static site this is limited.

## 2. RLS Policy & Logic Discrepancy

**File:** `leaderboard.js`, `DATABASE_DESIGN.md`, `SUPABASE_SETUP_GUIDE.md`

**Finding:**
`leaderboard.js` queries the `player_profiles` table directly:
```javascript
supabaseClient.from('player_profiles')...
```
However, the `SUPABASE_SETUP_GUIDE.md` instructs users to set up an RLS policy that restricts `player_profiles` access to the owning user only:
```sql
CREATE POLICY "Users can view own profile" ON player_profiles FOR SELECT USING (auth.uid() = user_id);
```

**Risk Analysis:**
If the guide is followed, the leaderboard code **will fail** for anonymous users or any user trying to view others' scores, as the RLS policy prevents reading other users' rows.
If the RLS policy is relaxed to make the code work (e.g., `USING (true)`), it exposes all user profile data (email, metadata, etc.) to anyone with the Anon Key.

**Recommendation:**
- The code should query the `leaderboard_cache` materialized view as suggested in `DATABASE_DESIGN.md`, which is intended to be public.
- Alternatively, a specific public RLS policy for `player_profiles` with `leaderboard_visible = true` should be created.

## 3. Client-Side Game Logic Trust

**File:** `game.js`

**Finding:**
The entire game logic (scoring, XP calculation, combat) resides in the client-side JavaScript.
There is no server-side validation of these actions.

**Risk Analysis:**
A malicious user can modify the JavaScript code or manipulate the `IndexedDB` data to grant themselves maximum XP, gold, or leaderboard rankings. When `leaderboard.js` submits scores (if implemented), falsified data could be sent to the server.

**Recommendation:**
- This is inherent to client-side only games. Acknowledging this limitation is important. To fix this, game logic must move to a server (authoritative server architecture).

## 4. CDN Dependency

**File:** `index.html`

**Finding:**
Supabase is loaded via a CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

**Risk Analysis:**
If the CDN is down or blocked (e.g., by corporate firewalls or ad blockers), the leaderboard functionality will break silently or cause errors.

**Recommendation:**
- Add error handling to detect if Supabase fails to load.
- Consider bundling the library or providing a fallback.

## 5. Data Export Privacy

**File:** `game.js`

**Finding:**
`exportData()` exports the full `userProfile` object.

**Risk Analysis:**
While currently `userProfile` contains only game stats, future expansions adding sensitive data (like emails or tokens) to this object would cause them to be exported in plain text JSON.

**Recommendation:**
- Add a warning to the user before export.
- Sanitize the exported object to include only necessary game state.
