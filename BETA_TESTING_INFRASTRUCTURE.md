# 🚀 Beta Testing Infrastructure Plan
## Code of Meridaeia: The Siege of Meridaeia

---

## 📋 Executive Summary

This document outlines the complete infrastructure strategy for hosting **Code of Meridaeia** as a beta test for your friends, enabling:
- ✅ **Zero-maintenance hosting** (no need to keep your laptop running)
- ✅ **Mobile-responsive gameplay** (works on phones)
- ✅ **Online-only progression** (no local caches, server-authoritative)
- ✅ **User accounts with authentication**
- ✅ **Global leaderboard system**
- ✅ **Privacy-first approach** (no ads, no tracking, minimal data collection)

---

## 🌐 Hosting Strategy

### Recommended Solution: **Vercel + Supabase**

#### Why This Stack?

| Component | Technology | Purpose | Cost |
|-----------|-----------|---------|------|
| **Frontend Hosting** | Vercel | Static site deployment with global CDN | **FREE** (Hobby tier) |
| **Backend + Database** | Supabase | PostgreSQL database + Auth + Real-time APIs | **FREE** (up to 500MB DB, 50K monthly active users) |
| **File Storage** | Supabase Storage | For future avatar uploads (optional) | **FREE** (1GB included) |

#### Alternative Options (if needed):

1. **Netlify + Firebase** (similar free tier, Google ecosystem)
2. **Railway + PostgreSQL** (more control, $5/month after free tier)
3. **Render + Neon Database** (serverless PostgreSQL, generous free tier)

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S DEVICE (Mobile/Desktop)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Code of Meridaeia Web App (HTML/CSS/JS)              │   │
│  │  - Character Selection                               │   │
│  │  - Combat Engine                                     │   │
│  │  - Shop System                                       │   │
│  │  - Leaderboard View                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Global Edge Network)          │
│  - Serves static assets (HTML, CSS, JS, SVGs)               │
│  - Auto-scaling, zero config                                │
│  - Custom domain support (codequest.yourdomain.com)         │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API / WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Service                              │   │
│  │  - Email/Password signup                             │   │
│  │  - Session management (JWT tokens)                   │   │
│  │  - Password reset flows                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                 │   │
│  │  - User profiles                                     │   │
│  │  - Character progression (XP, Gold, Equipment)       │   │
│  │  - Combat logs                                       │   │
│  │  - Leaderboard rankings                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Real-time Subscriptions (Optional for Phase 7+)     │   │
│  │  - Live leaderboard updates                          │   │
│  │  - Future chat/community features                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### User Journey

1. **First Visit** → Landing page with "Sign Up" / "Login" buttons
2. **Sign Up** → Email + Password + Username (3-20 characters, unique)
3. **Email Verification** (optional for beta, recommended for production)
4. **Login** → JWT token stored in memory (not localStorage for security)
5. **Session Management** → Auto-refresh tokens, 7-day expiry
6. **Logout** → Clear session, redirect to login

### Security Features

- ✅ **Passwords hashed with bcrypt** (handled by Supabase)
- ✅ **Rate limiting** on login attempts (5 attempts/15 minutes)
- ✅ **HTTPS-only** communication
- ✅ **No third-party tracking scripts**
- ✅ **Session tokens expire after inactivity**

---

## 📱 Mobile Optimization Strategy

### Responsive Design Requirements

1. **Touch-Friendly UI**
   - Minimum button size: 44x44px (Apple HIG standard)
   - Increased padding on interactive elements
   - Swipe gestures for navigation (optional)

2. **Performance Optimization**
   - Lazy-load question banks (don't load all 100+ questions at once)
   - Compress SVG assets (use SVGO)
   - Implement service worker for offline question caching (read-only)

3. **Viewport Adjustments**
   - Breakpoints: 320px (mobile), 768px (tablet), 1024px+ (desktop)
   - Stack combat UI vertically on mobile
   - Collapsible shop categories

4. **Testing Checklist**
   - [ ] iOS Safari (iPhone 12+)
   - [ ] Chrome Mobile (Android)
   - [ ] Landscape orientation support
   - [ ] Notch/safe-area handling

---

## 🎮 Online-Only Progression Model

### Key Principles

1. **Server is the Source of Truth**
   - All XP, Gold, and Equipment stored in database
   - Client-side state is temporary (session-only)
   - No localStorage for progression data

2. **Session-Based Gameplay**
   - On login: Fetch user's current state from DB
   - During gameplay: Track changes in memory
   - On actions: Immediately sync to server (e.g., after defeating a monster)
   - On logout: Final sync, then clear local state

3. **Anti-Cheat Measures**
   - Server validates all XP/Gold calculations
   - Question answers checked server-side (don't trust client)
   - Rate limiting on API calls (prevent spam farming)
   - Audit logs for suspicious activity

---

## 🏆 Leaderboard System

### Ranking Metrics

| Rank Type | Calculation | Display |
|-----------|-------------|---------|
| **Overall XP** | Total XP earned across all categories | Top 100 players |
| **Gold Hoarders** | Total Gold accumulated | Top 50 players |
| **Category Masters** | XP per hero class (Java, C++, etc.) | Top 20 per category |
| **Speed Runners** | Fastest time to defeat 10 monsters | Top 10 with timestamps |

### Leaderboard Features

- **Real-time updates** (refresh every 30 seconds)
- **Player rank display** (e.g., "You are #42 out of 150 players")
- **Anonymity option** (display as "Anonymous Warrior" instead of username)
- **Seasonal resets** (optional: reset leaderboard every 3 months)

---

## 🔄 Deployment Workflow

### Step-by-Step Process

#### 1. **Initial Setup** (One-time, ~30 minutes)
   - Create Vercel account (link GitHub repo)
   - Create Supabase project
   - Configure environment variables
   - Set up database schema (see DATABASE_DESIGN.md)

#### 2. **Continuous Deployment** (Automatic)
   - Push code to GitHub `main` branch
   - Vercel auto-deploys in ~60 seconds
   - Changes go live immediately

#### 3. **Beta Testing Invitations**
   - Share URL: `https://codequest-beta.vercel.app`
   - Provide test credentials (or let friends sign up)
   - Monitor Supabase dashboard for user activity

#### 4. **Monitoring & Maintenance**
   - Check Vercel analytics (page views, load times)
   - Review Supabase logs (API errors, slow queries)
   - Collect feedback via in-game form or Discord

---

## 📊 Scalability Considerations

### Free Tier Limits (Supabase)

| Resource | Limit | Estimated Capacity |
|----------|-------|-------------------|
| Database Size | 500 MB | ~50,000 users with full progression |
| Monthly Active Users | 50,000 | More than enough for beta |
| API Requests | 500K/month | ~16K requests/day |
| Bandwidth | 5 GB/month | ~10K daily active users |

### When to Upgrade?

- If you exceed **100 concurrent players**, consider upgrading to Supabase Pro ($25/month)
- If database grows beyond **500 MB**, upgrade or implement data archiving
- For **production launch**, budget ~$50-100/month for hosting + database

---

## 🛡️ Backup & Disaster Recovery

### Automated Backups

- **Supabase**: Daily automatic backups (7-day retention on free tier)
- **Manual Backups**: Weekly export of database to CSV (via Supabase dashboard)
- **Code Backups**: GitHub repository (already version-controlled)

### Recovery Procedures

1. **Database Corruption**: Restore from latest Supabase backup
2. **Accidental Data Deletion**: Use Supabase Point-in-Time Recovery (Pro tier)
3. **Frontend Issues**: Revert to previous Git commit, redeploy

---

## 🎯 Alignment with Current Development Phases

### Integration Points

| Current Phase | Beta Infrastructure Impact |
|---------------|---------------------------|
| **Phase 3** (Shop System) | Shop purchases must sync to database immediately |
| **Phase 4** (Boss Fight) | Boss encounter progress saved after each question |
| **Phase 5** (Networking) | API simulation replaced with real Supabase calls |
| **Phase 6** (Beta Testing) | **THIS DOCUMENT** - Ready to deploy! |
| **Phase 7** (Chat/Community) | Supabase Real-time for live chat, already included |

### Migration Path

1. **Phase 1-3 (Current)**: Keep using IndexedDB for local testing
2. **Phase 4**: Implement Supabase integration in parallel (dual-write mode)
3. **Phase 5**: Switch to Supabase-only (remove IndexedDB for progression)
4. **Phase 6**: Deploy to Vercel, invite beta testers
5. **Phase 7+**: Add community features using existing infrastructure

---

## 📝 Next Steps

### Immediate Actions (Before Coding)

1. ✅ **Read DATABASE_DESIGN.md** (database schema specification)
2. ✅ **Read PRIVACY_POLICY.md** (user data protection guidelines)
3. ✅ **Read IMPLEMENTATION_ROADMAP.md** (technical migration plan)
4. ✅ **Review SECURITY_CLAUSE.md** (legal/compliance requirements)

### Pre-Launch Checklist

- [ ] Create Vercel account
- [ ] Create Supabase account
- [ ] Set up custom domain (optional: codequest.yourdomain.com)
- [ ] Implement authentication UI (login/signup screens)
- [ ] Migrate database.js to Supabase API calls
- [ ] Test on 3+ mobile devices
- [ ] Write beta testing guidelines for friends
- [ ] Set up feedback collection form

---

## 🤝 Beta Tester Onboarding

### What Your Friends Will See

1. **Landing Page**: Epic lore intro + "Join the Beta" button
2. **Sign Up**: Simple form (email, username, password)
3. **Tutorial**: 3-question guided combat (no XP/Gold earned)
4. **Main Game**: Full access to all features
5. **Leaderboard**: See their rank after first monster kill

### Feedback Collection

- **In-Game Form**: "Report Bug" button in settings
- **Discord Channel**: Private beta-tester Discord server
- **Weekly Surveys**: Google Forms for structured feedback

---

## 💰 Cost Estimate (First 6 Months)

| Item | Cost |
|------|------|
| Vercel Hosting | **$0** (Hobby tier) |
| Supabase Database | **$0** (Free tier) |
| Custom Domain (optional) | **$12/year** (~$6 for 6 months) |
| **Total** | **~$6** (or $0 without custom domain) |

**Conclusion**: You can run a full beta test for **FREE** with professional infrastructure! 🎉

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **Mobile Testing**: BrowserStack (free for open-source projects)

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-27  
**Author**: Senior Dev Bro 🤘  
**Status**: Ready for Implementation
