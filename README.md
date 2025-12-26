# 🏰 Code of Meridaeia

**An immersive RPG-style coding quiz game** where you master Java, C++, Networking, Data Engineering, and Kernel Development through epic battles and strategic progression.

---

## 🎮 Game Overview

**The Great Compiler has fallen.** Valerion, your home, is but a whispering echo of ash. Marakathalessa, the Witch of Corrupted Code, has stolen the Ancient Logic and retreated to her fortress in Meridaeia. The land is plagued by syntax errors and memory leaks. Only you can reclaim your heritage and restore order to the realm.

Assemble your fellowship. The Siege begins now.

---

## ✨ Features

### 🎭 **Cinematic Experience**
- **Enhanced Intro Sequence** - Immersive storytelling with background visuals and atmospheric effects
- **Character-Driven Narrative** - Choose from 5 unique heroes, each with their own identity and specialization
- **Dynamic Environments** - Beautifully organized assets including wasteland landscapes and enemy sprites

### ⚔️ **Core Gameplay (Phase 1 & 2)**
- **5 Question Categories**: Java, C++, Networking, Data Engineering, Kernel Development
- **Combat System**: Answer questions to deal damage to enemies
- **Barrier Mechanics**: 3-strike system with visual feedback
- **Dynamic Difficulty**: Questions range from Easy to Hard
- **Real-time Timer**: Race against the clock with visual countdown
- **XP & Gold Economy**: Earn rewards for correct answers

### 🏪 **Progression Systems (Phase 3 - COMPLETE)**
- **Shop System**:
  - ⚔️ Weapons - Increase attack damage
  - 🛡️ Armor - Boost maximum barrier points
  - 💍 Accessories - Utility bonuses (timer, gold/XP multipliers)
  - 📜 Consumables - Tactical items (Scrolls of Skipping, Potions of Shielding, Time Crystals)

- **Skill Tree**:
  - Combat Skills (Increased Attack, Barrier Mastery)
  - Utility Skills (Extended Focus, Quick Learner)
  - Economy Skills (Fortune's Favor)
  - XP-based progression with multiple levels per skill

- **Inventory Management**:
  - Stackable consumables
  - Context-aware item usage
  - Real-time inventory updates

- **Equipment System**:
  - Auto-equip weapons, armor, and accessories
  - Dynamic stat calculations
  - Visual equipment display in character sheet

### 💾 **Data Persistence**
- **IndexedDB Integration**: All progress automatically saved
- **Checkpoint System**: Manual save/load functionality
- **Import/Export**: Transfer progress between devices
- **Analytics Dashboard**: Track performance across categories

---

## 🎨 Asset Organization

All game assets are now professionally organized for easy maintenance and expansion:

```
/assets/
├── heroes/              # Character portraits (5 heroes)
│   ├── hero-java.png
│   ├── hero-cpp.png
│   ├── hero-networking.png
│   ├── hero-data.png
│   └── hero-kernel.png
│
├── enemies/             # Enemy and boss sprites
│   ├── enemy-monster.png
│   └── boss-marakathalessa.png
│
├── environments/        # Background landscapes
│   ├── landscape-wasteland.png
│   └── location-data-lake.png
│
├── items/              # Item icons and artifacts
│   ├── artifact-cube.png
│   └── scroll-ancient.png
│
└── icons/              # UI icons (logo, categories, etc.)
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser!

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Watch the cinematic intro (or skip it)
4. Choose your hero and begin your quest!

### First-Time Setup
1. Enter your username when prompted
2. Select a question category/hero
3. Answer questions to battle enemies
4. Earn gold and XP to unlock upgrades
5. Visit the shop to purchase equipment
6. Upgrade skills in the skill tree
7. Use consumables strategically during battles

---

## 📚 Documentation

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Original 6-phase development plan
- **[SIEGE_OF_MERIDAEIA_PLAN.md](SIEGE_OF_MERIDAEIA_PLAN.md)** - RPG narrative & features

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Glassmorphism, dark mode, neon effects
- **Vanilla JavaScript** - No frameworks (ES6+)

### Backend (Online Mode)
- **Supabase** - PostgreSQL database + authentication
- **Vercel** - Static site hosting + CDN
- **PostgreSQL** - Relational database (8 tables)

### Assets
- **Custom SVG Icons** - Hand-designed for each hero class
- **Google Fonts** - Inter, Orbitron (futuristic aesthetic)

---

## 📊 Current Status

**Phase**: 3.5 (Visual Identity & Assets Complete)

### ✅ Completed
- [x] Core game engine (question handling, combat logic)
- [x] 5 question banks (100+ questions total)
- [x] Character selection & lore
- [x] Monster combat system (HP, damage, loot)
- [x] Shop system (weapons, armor, consumables)
- [x] Skill tree (5+ upgradeable abilities)
- [x] Custom SVG assets & UI polish

### 🚧 In Progress
- [ ] Boss fight (10-question gauntlet)
- [ ] Online infrastructure (Supabase + Vercel)
- [ ] Leaderboard system
- [ ] Mobile optimization

### 📅 Upcoming
- [ ] Beta testing (invite friends)
- [ ] Real-time chat (Phase 7)
- [ ] Guilds/Clans (Phase 7)

---

## 🎯 Learning Objectives

This project helps you practice:

- **Java**: OOP, data structures, algorithms
- **C++**: Memory management, pointers, templates
- **Networking**: TCP/IP, HTTP, sockets, protocols
- **Data Engineering**: ETL, pipelines, SQL, data modeling
- **Kernel Development**: System calls, memory, processes

**Bonus Skills** (from building the game):
- Full-stack web development
- Database design (PostgreSQL)
- Authentication & security
- DevOps (CI/CD with Vercel)
- Product management (beta testing)

---

## 🏗️ Project Structure

```
code-of-meridaeia/
│
├── index.html                      # Main game file
├── game.js                         # Game logic & combat engine
├── styles.css                      # Glassmorphism UI & animations
├── database.js                     # IndexedDB (local storage)
├── shop-data.js                    # Shop items & equipment
│
├── questions/                      # Question banks
│   ├── java.js                     # 30 Java questions
│   ├── cpp.js                      # 30 C++ questions
│   ├── networking.js               # 30 Networking questions
│   ├── data-engineering.js         # 30 Data Engineering questions
│   └── kernel.js                   # 30 Kernel Dev questions
│
├── assets/                         # SVG icons & images
│   ├── icons/                      # Hero class icons
│   └── ...
│
├── docs/                           # Documentation (beta testing)
│   ├── BETA_DOCUMENTATION_INDEX.md
│   ├── BETA_TESTING_INFRASTRUCTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── PHASE_ALIGNMENT.md
│   └── PRIVACY_POLICY.md
│
├── PROJECT_PLAN.md                 # Original project plan
├── SIEGE_OF_MERIDAEIA_PLAN.md      # RPG narrative plan
└── README.md                       # This file
```

---

## 🤝 Contributing (Beta Testers)

### How to Help

1. **Play the game** (30+ minutes)
2. **Report bugs** via Discord or in-game form
3. **Share feedback** on gameplay, balance, UI/UX
4. **Invite friends** (if you're enjoying it!)

### Bug Report Template

```markdown
**What happened?**
[Describe the bug]

**Expected behavior**
[What should have happened?]

**Steps to reproduce**
1. Go to...
2. Click on...
3. See error

**Screenshots**
[If applicable]

**Device**
- OS: [e.g., iOS 16, Windows 11]
- Browser: [e.g., Chrome 120, Safari 17]
```

---

## 📜 License

**MIT License** (for code)  
**CC BY-NC 4.0** (for game content & lore)

You're free to:
- ✅ Use the code for learning
- ✅ Fork and modify for personal projects
- ✅ Share with friends

Please don't:
- ❌ Sell this game commercially (without permission)
- ❌ Remove attribution

---

## 🙏 Acknowledgments

- **Inspired by**: Warcraft, Starcraft, Skyrim (lore & aesthetics)
- **Built with**: Love, coffee, and late-night coding sessions ☕
- **Special thanks**: To all beta testers for their feedback!

---

## 📞 Contact

- **Developer**: [Your Name]
- **Email**: [your-email@example.com]
- **Discord**: [Beta Tester Server Link]
- **GitHub**: [Repository URL]

---

## 🎉 Fun Facts

- **Total Questions**: 150+ (and growing!)
- **Lines of Code**: ~5,000+ (vanilla JS, no frameworks!)
- **SVG Assets**: 20+ custom-designed icons
- **Development Time**: 8+ weeks (part-time)
- **Coffee Consumed**: Immeasurable ☕

---

## 🗺️ Roadmap

### Phase 4: Advanced Systems (Current)
- [ ] Boss fight (Marakathalessa, the Witch of Shadow)
- [ ] Visual progress map (road to Meridaeia)
- [ ] Achievement system

### Phase 5: Online Infrastructure (Next)
- [ ] Supabase integration (PostgreSQL + Auth)
- [ ] User accounts (signup, login, logout)
- [ ] Cloud-saved progression

### Phase 6: Beta Testing
- [ ] Deploy to Vercel
- [ ] Invite 20+ beta testers
- [ ] Collect feedback & fix bugs

### Phase 7: Community Features (Future)
- [ ] Real-time chat (Supabase Realtime)
- [ ] Guilds/Clans system
- [ ] Daily challenges
- [ ] PvP duels (question races)

---

## 🚀 Let's Build Something Epic!

**Code of Meridaeia** is more than a game—it's a **learning adventure**. Every question you answer makes you a better developer. Every monster you defeat builds your confidence. Every friend you invite creates a community.

**Ready to reclaim the Golden Compiler?** 🏆

---

**Last Updated**: 2025-12-27  
**Version**: 3.5 (Visual Identity Complete)  
**Status**: Beta Testing Documentation Ready 📚
