# Nexus 9: The Fraying Dark — Site Improvements Changelog

**Version:** 2.0 (Market Standards Update)
**Date:** April 12, 2026
**Commit:** `42361c4` pushed to `main`

---

## Summary

This update brings the Nexus 9 companion site to market-standard usability and playability for a TTRPG digital product. Six core files were modified across the book reader, character builder, theme system, and stylesheet, adding 1,301 lines and removing 573 lines of legacy code.

---

## Book Reader (Home.tsx)

| Feature | Description |
|:---|:---|
| **Full-Text Search** | Searches all 101 chapters with highlighted keyword matches, result counts per chapter, context snippets, and "no results" feedback. Opens with `/` key or toolbar icon. |
| **Bookmark System** | Save/remove bookmarks per chapter with `B` key. Bookmarks persist in localStorage and display in a dedicated overlay (`M` key). Bookmarked chapters show a teal checkmark in the sidebar. |
| **Hope/Fear Dice Roller** | Roll 2d12 with `D` key. Displays Hope die, Fear die, and result classification (Hope, Fear, Critical Hope, Critical Fear) using the Daggerheart dual-die mechanic. |
| **Quick Reference Panel** | Toggle with `Q` key. Shows all six conditions (Vulnerable, Restrained, Frightened, Hidden, Stunned, Slowed) and six standard actions (Attack, Dash, Help, Hide, Use an Item, Protect). |
| **Keyboard Shortcuts** | Full shortcut system: `/` Search, `B` Bookmark, `M` Bookmarks list, `Q` Quick Ref, `D` Dice, `?` Help, Left/Right arrows for chapter navigation, `Esc` to close overlays. |
| **Reading Time** | Estimated reading time per chapter based on word count (200 wpm), displayed in breadcrumb bar and chapter header. |
| **Reading Progress** | Thin teal progress bar below the breadcrumb that tracks scroll position. Global progress percentage in the sidebar. |
| **Resume Reading** | Cover page shows "Continue Reading" button when a previous reading position exists in localStorage. |
| **Deep Linking** | URLs update to `/book/:bookId/:chapterId` format for shareable chapter links. |
| **Accessibility** | Skip-to-content link, ARIA landmarks (`role="navigation"`, `role="main"`, `role="search"`, `aria-current`, `aria-expanded`), and focus management. |

## Character Builder (CharacterBuilder.tsx)

| Feature | Description |
|:---|:---|
| **Saved Characters Gallery** | Save multiple characters to localStorage. Gallery panel shows all saved characters with name, class, level, and ancestry. Load, delete, or create new characters from the gallery. |
| **Level Selector** | Choose character level 1–10 in the Identity step. Level determines tier (1–4) which filters available weapons and armor. |
| **HP/Evasion Scaling** | Review step shows correct Hit Points and Evasion for the selected class at the selected level, pulled from `CLASS_TIER_STATS` data extracted from the manuscript. |
| **Damage Thresholds** | Review step displays Minor/Major/Severe damage thresholds for the character's class and tier. |
| **Domain Card Modal** | Click any domain card in the Domain step to open a full-detail modal showing card name, level, type, recall cost, and full description. |
| **Expanded Weapons** | 50+ weapons across 4 tiers, including faction-specific rare weapons (Kaelen Syndicate, Aurelian Empire, Mindclave, Valari Collective). Each weapon has damage, range, traits, and tier. |
| **Expanded Armor** | 12 armor sets across 4 tiers with base score, threshold modifiers, features, and tier requirements. |
| **Tier-Aware Filtering** | Gear step only shows weapons and armor available at the character's current tier. Higher-tier items are locked with a clear "Requires Tier X" indicator. |
| **Character Export** | Copy full character sheet to clipboard in formatted text for sharing or printing. |

## Character Data (characterData.ts)

| Addition | Count |
|:---|:---|
| Tier 1 Weapons | 14 items |
| Tier 2 Weapons | 12 items |
| Tier 3 Weapons | 12 items |
| Tier 4 Weapons | 12 items |
| Armor Sets | 12 items (3 per tier) |
| Class Tier Stats | 8 classes x 4 tiers (HP, Evasion, Damage Thresholds) |

## Content Fixes (manuscript.json)

All occurrences of the old working title "Crucible of Stars" have been replaced with "The Fraying Dark" in the manuscript data. The book section title "AGENTS OF THE CRUCIBLE" was corrected to "AGENTS OF THE FRAYING DARK." Three intentional in-world lore references to "crucible" (lowercase, referring to the campaign arc) were preserved.

## Theme System (ThemeContext.tsx)

The theme provider now detects the user's operating system preference via `prefers-color-scheme` media query on first visit. If no explicit theme has been saved to localStorage, the site respects the OS setting. A media query listener watches for system theme changes in real time. The SSR-safe guard (`typeof window !== "undefined"`) prevents errors during server-side rendering.

## Stylesheet (index.css)

The stylesheet now includes mobile-responsive prose sizing (0.9rem on screens below 768px), horizontally scrollable tables on mobile, `focus-visible` outlines in teal for keyboard navigation, dark mode fixes for links, inline code, and horizontal rules, smooth scrolling with `prefers-reduced-motion` respect, and reduced-motion overrides that disable all animations and transitions for users who request it.

---

## Market Standards Checklist

| Standard | Status |
|:---|:---|
| Full-text search | Done |
| Bookmarks / save place | Done |
| Keyboard navigation | Done |
| Dark mode with system detection | Done |
| Mobile responsive tables | Done |
| Accessibility (ARIA, skip links, focus) | Done |
| Character persistence (multi-character) | Done |
| Dice roller (Daggerheart 2d12) | Done |
| Quick reference (conditions/actions) | Done |
| Reading time estimates | Done |
| Deep linking / shareable URLs | Done |
| Print stylesheet | Done |
| Reduced motion support | Done |
| Tier-aware gear progression | Done |
| HP/stat scaling by level | Done |

---

## Remaining Opportunities (Future Iterations)

The following items from the market standards review were not addressed in this update and could be considered for future work:

1. **Encounter Builder dark mode** — The GM Encounter Builder page does not yet adapt to dark mode
2. **PDF export** — Character sheet export to PDF format
3. **Session notes** — In-reader note-taking per chapter
4. **Faction relationship tracker** — Visual tracker for faction standings
5. **Ship builder** — Interactive ship creation tool matching the character builder pattern
6. **Offline support** — Service worker for offline reading
7. **Table of contents within chapters** — Jump links for long chapters with many sections
