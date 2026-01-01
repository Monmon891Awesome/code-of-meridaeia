# Phase F: Retro Asset Integration Plan

**Status:** In Progress  
**Last Updated:** 2025-12-29

---

## 📦 Asset Inventory

### ✅ **Battle Backgrounds (Ready to Use)**

These are **DONE** and located in `assets/environments/`:

| Asset | Filename | Status | Style |
|-------|----------|--------|-------|
| Wasteland | `wasteland_battle_background_retro.png` | ✅ Ready | Dark gothic pixel art |
| Forest | `forest_battle_retro.png` | ✅ Ready | Dark emerald with glowing vines |
| Data Lake | `data_lake_battle_retro.png` | ✅ Ready | Bioluminescent purple/blue |
| Mountains | ❌ Missing | Pending | Purple peaks with static snow |
| Fortress | ❌ Missing | Pending | Dark gates with red torches |

### ❌ **Item Icons (Not Yet Created)**

Need **32x32 pixel art icons** for shop items:

**Weapons (5 icons needed):**
- `weapon_rusty_sword.png`
- `weapon_iron_axe.png`
- `weapon_steel_blade.png`
- `weapon_enchanted_staff.png`
- `weapon_legendary_hammer.png`

**Armor (4 icons needed):**
- `armor_leather_vest.png`
- `armor_chainmail.png`
- `armor_plate_armor.png`
- `armor_dragon_scale.png`

**Accessories (4 icons needed):**
- `accessory_gold_ring.png`
- `accessory_xp_amulet.png`
- `accessory_lucky_charm.png`
- `accessory_speed_boots.png`

**Consumables (3 icons needed):**
- `consumable_skip_scroll.png` *(can reuse `scroll-ancient.png`)*
- `consumable_barrier_potion.png`
- `consumable_time_crystal.png` *(can reuse `artifact-cube.png`)*

---

## 🎨 CSS Integration Steps

Apply these changes to activate the retro backgrounds we already have!

### Update `styles.css` (around line 1498):

```css
/* Environment Backgrounds - RETRO VERSION */
#game-area.env-wasteland {
    background-image: url('assets/environments/wasteland_battle_background_retro.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

#game-area.env-forest {
    background-image: url('assets/environments/forest_battle_retro.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

#game-area.env-lakes {
    background-image: url('assets/environments/data_lake_battle_retro.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Keep tiles for these until retro versions ready */
#game-area.env-mountains {
    background-image: url('assets/environments/tile-mountains.png');
    background-size: 256px 256px;
    background-repeat: repeat;
}

#game-area.env-gates {
    background-image: url('assets/environments/tile-gates.png');
    background-size: 256px 256px;
    background-repeat: repeat;
}
```

---

## 📋 Next Actions

**You can do NOW:**
1. Apply the CSS snippet above
2. Refresh browser and test combat with Grom/Malloc/Artemis

**When image gen comes back:**
3. Generate Mountains + Fortress backgrounds
4. Generate shop item icons
5. Update `shop-data.js` with icon paths
