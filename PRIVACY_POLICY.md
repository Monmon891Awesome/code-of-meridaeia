# 🔐 Privacy Policy & Data Security Clause
## Code of Meridaeia: The Siege of Meridaeia - Beta Testing Program

**Effective Date**: 2025-12-27  
**Version**: 1.0 (Beta)  
**Jurisdiction**: International (GDPR-Compliant)

---

## 📋 Introduction

Welcome to the **Code of Meridaeia Beta Testing Program**! This document outlines how we collect, use, protect, and respect your data during the beta testing phase. We are committed to **privacy-first design** and **minimal data collection**.

### Our Core Principles

✅ **No Advertising** - We will NEVER sell your data to advertisers  
✅ **No Tracking** - No cookies, no analytics scripts, no third-party trackers  
✅ **No Device IDs** - We don't collect device fingerprints or unique identifiers  
✅ **Minimal Data** - We only collect what's necessary for gameplay  
✅ **Your Control** - You can delete your account and data anytime  
✅ **Transparency** - This policy is written in plain English, not legalese

---

## 🗂️ What Data We Collect

### 1. **Account Information** (Required for Signup)

| Data Field | Purpose | Storage Duration |
|------------|---------|------------------|
| **Email Address** | Account login, password recovery | Until account deletion |
| **Username** | In-game display name, leaderboard | Until account deletion |
| **Password (Hashed)** | Authentication | Until account deletion |

**Important Notes**:
- Passwords are **hashed with bcrypt** (we never see your actual password)
- Email is **only used for login** (no marketing emails, ever)
- Username is **publicly visible** on leaderboards (you can opt out)

---

### 2. **Gameplay Data** (Automatically Collected During Play)

| Data Type | Examples | Purpose |
|-----------|----------|---------|
| **Character Progress** | XP, Gold, Level, Hero Class | Save your game state |
| **Inventory** | Owned weapons, armor, consumables | Track purchased items |
| **Combat Logs** | Questions answered, damage dealt, monsters defeated | Anti-cheat, analytics |
| **Skill Tree** | Unlocked abilities, upgrade levels | Character customization |
| **Playtime** | Total minutes in-game | Leaderboard metrics |

**What We DON'T Collect**:
- ❌ Your real name, address, or phone number
- ❌ Payment information (the game is 100% free)
- ❌ IP addresses or geolocation
- ❌ Browser fingerprints or device IDs
- ❌ Cookies (except session authentication token)
- ❌ Social media profiles or contacts

---

### 3. **Session Data** (Temporary, Deleted After Logout)

| Data Type | Purpose | Storage |
|-----------|---------|---------|
| **Authentication Token (JWT)** | Keep you logged in | Memory only (not localStorage) |
| **Current Game State** | Resume from where you left off | Cleared on logout |

---

## 🛡️ How We Protect Your Data

### Security Measures

1. **Encryption in Transit**
   - All data sent between your device and our servers uses **HTTPS/TLS 1.3**
   - No unencrypted HTTP connections allowed

2. **Encryption at Rest**
   - Database is encrypted using **AES-256** (Supabase default)
   - Backups are also encrypted

3. **Access Control**
   - **Row-Level Security (RLS)**: You can only access your own data
   - Database credentials stored in environment variables (never in code)
   - Admin access requires multi-factor authentication (MFA)

4. **Password Security**
   - Passwords hashed with **bcrypt (cost factor 10)**
   - Rate limiting: Max 5 login attempts per 15 minutes
   - Password reset requires email verification

5. **Regular Backups**
   - Daily automated backups (7-day retention)
   - Stored in separate geographic region (disaster recovery)

---

## 🚫 What We Will NEVER Do

We solemnly promise to **NEVER**:

1. ❌ Sell your data to third parties
2. ❌ Show you advertisements (the game is ad-free forever)
3. ❌ Track you across other websites
4. ❌ Share your email with anyone (except for legal compliance)
5. ❌ Use your data for AI training without explicit consent
6. ❌ Send you spam or marketing emails
7. ❌ Collect data from your device (camera, microphone, contacts, etc.)

---

## 🎯 How We Use Your Data

### Primary Uses (Essential for Gameplay)

1. **Account Management**
   - Authenticate your login
   - Recover your password if forgotten
   - Prevent unauthorized access

2. **Game Progression**
   - Save your XP, Gold, and Equipment
   - Track which questions you've answered
   - Display your rank on leaderboards

3. **Anti-Cheat & Fair Play**
   - Detect impossible scores (e.g., 1000 XP in 1 second)
   - Prevent automated bots from farming rewards
   - Ensure leaderboard integrity

### Secondary Uses (Optional, You Can Opt Out)

4. **Leaderboards**
   - Display your username and stats publicly
   - **Opt-Out**: Set "Leaderboard Visibility" to OFF in settings
   - If opted out, you'll appear as "Anonymous Warrior"

5. **Aggregated Analytics** (No Personal Identifiers)
   - Example: "70% of players choose the Java hero"
   - Example: "Average playtime is 45 minutes"
   - **This data is anonymous** (we can't trace it back to you)

---

## 🌍 Data Sharing & Third Parties

### Who Has Access to Your Data?

| Party | Access Level | Purpose |
|-------|--------------|---------|
| **You** | Full access | View/edit your profile, delete account |
| **Game Developers** (Us) | Aggregated analytics only | Improve game balance, fix bugs |
| **Supabase (Hosting Provider)** | Infrastructure access | Database hosting, backups |
| **Vercel (CDN)** | No personal data | Serve static files (HTML/CSS/JS) |

### Third-Party Services

We use **only two** third-party services:

1. **Supabase** (Database + Authentication)
   - Privacy Policy: https://supabase.com/privacy
   - GDPR-compliant, SOC 2 Type II certified
   - Data stored in **US East (Virginia)** region

2. **Vercel** (Frontend Hosting)
   - Privacy Policy: https://vercel.com/legal/privacy-policy
   - GDPR-compliant, ISO 27001 certified
   - No user data stored (only serves static files)

**We do NOT use**:
- ❌ Google Analytics
- ❌ Facebook Pixel
- ❌ Hotjar or session replay tools
- ❌ Ad networks
- ❌ Any tracking scripts

---

## 🗑️ Your Data Rights

### You Have the Right To:

1. **Access Your Data**
   - Download a JSON export of your entire profile
   - Request: Email us at [your-email@example.com]

2. **Correct Your Data**
   - Change your username in settings
   - Update your email (requires re-verification)

3. **Delete Your Data**
   - Click "Delete Account" in settings
   - **Permanent deletion within 30 days**
   - Leaderboard entries removed immediately

4. **Opt Out of Leaderboards**
   - Toggle "Leaderboard Visibility" in settings
   - Your stats remain private

5. **Export Your Data**
   - Download your progress as JSON
   - Useful for migrating to future versions

### How to Exercise Your Rights

- **In-Game**: Settings → Privacy → [Action]
- **Email**: [your-email@example.com] (response within 7 days)
- **Data Deletion**: Automatic via settings, or email us

---

## 🧒 Age Restrictions

Code of Meridaeia is intended for users **13 years and older**. If you are under 13, please do not create an account. We do not knowingly collect data from children under 13.

If we discover a user is under 13, we will:
1. Immediately delete their account
2. Purge all associated data
3. Notify the email address on file

---

## 🔒 Data Retention Policy

| Data Type | Retention Period | After Deletion |
|-----------|------------------|----------------|
| **Account Info** | Until you delete account | Purged within 30 days |
| **Gameplay Data** | Until you delete account | Purged within 30 days |
| **Combat Logs** | 90 days | Auto-deleted after 90 days |
| **Backups** | 7 days | Overwritten by new backups |
| **Deleted Accounts** | 30-day grace period | Permanently deleted |

**Grace Period**: If you delete your account, you have **30 days** to change your mind. After that, data is **permanently unrecoverable**.

---

## 🚨 Data Breach Protocol

In the unlikely event of a data breach, we will:

1. **Immediate Response** (Within 1 hour)
   - Isolate affected systems
   - Revoke all authentication tokens
   - Force password reset for all users

2. **Investigation** (Within 24 hours)
   - Identify scope of breach
   - Determine what data was accessed
   - Patch security vulnerabilities

3. **Notification** (Within 72 hours)
   - Email all affected users
   - Publish public incident report
   - Offer free account monitoring (if applicable)

4. **Prevention** (Ongoing)
   - Conduct security audit
   - Implement additional safeguards
   - Update this policy if needed

---

## 📧 Contact & Transparency

### How to Reach Us

- **Email**: [your-email@example.com]
- **Discord**: [Beta Tester Server Link]
- **GitHub Issues**: [Repository URL]

### Transparency Commitments

- This policy is **version-controlled on GitHub** (you can see all changes)
- We'll notify you **30 days before** any major policy changes
- Annual transparency report (number of users, data requests, etc.)

---

## 🌐 International Users & GDPR Compliance

### For EU Users (GDPR)

You have additional rights under GDPR:
- **Right to Portability**: Export your data in machine-readable format
- **Right to Restriction**: Limit how we process your data
- **Right to Object**: Object to data processing (we'll delete your account)

### For California Users (CCPA)

You have the right to:
- Know what personal information we collect
- Request deletion of your personal information
- Opt out of data sales (we don't sell data, so this is automatic)

### Data Transfer

- Data is stored in **US East (Virginia)** via Supabase
- EU users: Data transfer covered by **Standard Contractual Clauses (SCCs)**

---

## 🔄 Policy Updates

### How We'll Notify You

- **Email notification** 30 days before changes take effect
- **In-game banner** on login
- **Version history** on GitHub

### What Triggers an Update?

- New features (e.g., chat system)
- Legal requirements (new privacy laws)
- Security improvements

**Current Version**: 1.0 (Beta)  
**Last Updated**: 2025-12-27  
**Next Review**: 2026-03-27 (or when exiting beta)

---

## ✅ Beta Testing Specific Terms

### During Beta Testing

1. **Data Wipes**: We reserve the right to reset all player data if critical bugs are found (we'll give 7 days notice)
2. **Downtime**: The game may be temporarily unavailable for maintenance
3. **Bug Reports**: If you report a bug, we may ask for your user ID (but never your password)
4. **Feedback**: Any feedback you provide (via Discord/email) is voluntary and non-confidential

### After Beta Ends

- We'll migrate all data to the production database (no data loss)
- This policy will be updated to remove beta-specific clauses
- You'll be notified 30 days before the transition

---

## 📜 Legal Disclaimer

This privacy policy is a **good-faith commitment** to protect your data. While we take every precaution, no system is 100% secure. By using Code of Meridaeia, you acknowledge:

1. You understand the risks of online gaming
2. You will not share your password with others
3. You will not attempt to hack or exploit the game
4. You are responsible for your account security

**Limitation of Liability**: We are not liable for data loss due to:
- Your own actions (e.g., deleting your account)
- Third-party service outages (Supabase, Vercel)
- Force majeure events (natural disasters, etc.)

---

## 🤝 Your Consent

By creating an account, you confirm that:

- ✅ You are **13 years or older**
- ✅ You have **read and understood** this policy
- ✅ You **consent** to the data collection described above
- ✅ You understand you can **withdraw consent** by deleting your account

---

## 📊 Data Security Clause (Technical Appendix)

### For Technical Users

**Encryption Standards**:
- TLS 1.3 for data in transit
- AES-256 for data at rest
- bcrypt (cost 10) for password hashing
- JWT tokens with 7-day expiry

**Database Security**:
- Row-Level Security (RLS) enabled on all tables
- Prepared statements (no SQL injection)
- Rate limiting: 100 requests/minute per user
- Automated vulnerability scanning (Dependabot)

**Infrastructure**:
- Supabase: SOC 2 Type II, ISO 27001, HIPAA-compliant
- Vercel: ISO 27001, SOC 2 Type II
- Backups: Encrypted, geo-redundant, 7-day retention

**Incident Response**:
- Security contact: [security@example.com]
- Bug bounty: Responsible disclosure welcome (no monetary rewards for beta)

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-27 | Initial beta policy |

---

## 🎯 Summary (TL;DR)

**What we collect**: Email, username, game progress  
**Why**: To save your game and show leaderboards  
**Who sees it**: Only you (and anonymous stats for us)  
**Your rights**: Delete anytime, opt out of leaderboards  
**What we DON'T do**: Ads, tracking, selling data  

**Questions?** Email [your-email@example.com]

---

**Document Status**: Ready for Beta Launch  
**Legal Review**: Recommended before public release  
**Next Step**: Add "Privacy Policy" link to game footer
