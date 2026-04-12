# Nexus 9: The Fraying Dark — Comprehensive Production Plan

**Date:** April 12, 2026
**Objective:** Transform the current 22,000-word manuscript and functional website into a complete, market-ready Daggerheart-compatible TTRPG product.
**Creative Direction:** Original Homage Mode (Babylon 5-inspired cosmic opera: diplomatic tension, deep-time mystery, character-centered drama, no 1:1 canon copying).

---

## Phase 1: The "Playable Combat" Sprint (Weeks 1-2)
*Goal: Unblock the GM so they can run combat encounters using the website tools.*

### 1.1 Adversary Stat Block Overhaul
The current 35 adversaries in the Encounter Builder lack the mechanical teeth required by the Daggerheart SRD. We must add:
- **Attack Modifiers & Damage Dice:** Scaled strictly by Tier (e.g., Tier 1: +1 to hit, 1d6+2 damage; Tier 4: +4 to hit, 4d8+10 damage).
- **Damage Thresholds:** Major and Severe thresholds for every adversary.
- **Features & Abilities:** 1-2 unique passive or active abilities per adversary that reinforce their faction identity (e.g., Aurelian Phalanx tactics, Mindclave psychic intrusion).
- **Fear Moves:** 1-2 specific moves for Bosses and Leaders that the GM can trigger by spending Fear.

### 1.2 Core Combat Rules Completion
- **Stress, Conditions, and Breaking:** Write the missing chapter detailing how Stress is marked, what happens when a character Breaks, and how conditions (Vulnerable, Restrained, etc.) are applied and cleared.
- **Rest and Recovery:** Define Short Rests (clearing Stress/HP) and Long Rests (clearing Armor slots, full recovery) in the context of a space station environment.
- **Action Economy:** Clarify the flow of combat, specifically how the GM uses Fear to interrupt or respond to player actions.

---

## Phase 2: The "Character Depth" Sprint (Weeks 3-4)
*Goal: Give players the narrative and mechanical depth they need to understand their characters.*

### 2.1 Class Write-Ups & Progression
Expand the current 20-word class stubs into full chapters (approx. 1,000-1,500 words each).
- **Narrative Identity:** What does it mean to be an Envoy or a Void Warden on Nexus 9?
- **Progression Tables:** Create clear 1-10 leveling tables showing when players gain new Domain cards, subclass features, and stat increases.
- **Subclass Features:** Detail the mechanical benefits of the 16 subclass paths (e.g., the Envoy's Consul vs. Agitator paths).

### 2.2 Ancestry & Community Lore
- **Ancestries:** Expand the 7 ancestries (Terran, Valari, Aurelian, etc.) with physical descriptions, cultural touchstones, and naming conventions.
- **Communities:** Detail the 8 communities (Station Rat, Core Worlder, Frontier Survivor, etc.) and explain how their free Experiences function mechanically.

### 2.3 Gear & Economy
- **Weapon & Armor Expansion:** Flesh out the remaining items to hit the 199-item target, ensuring all 4 tiers are populated with faction-specific gear.
- **Economy:** Define the currency (Credits/Creds) and the cost of living, bribes, and ship repairs on Nexus 9.

---

## Phase 3: The "Worldbuilding" Sprint (Weeks 5-6)
*Goal: Build the Babylon 5-inspired cosmic opera setting so the GM has a world to run.*

### 3.1 The Known Galaxy (Book 1)
- **History:** The fall of the Progenitors, the rise of the current factions, and the construction of Nexus 9.
- **Factions:** Deep dives into the Aurelian Empire, Kaelen Syndicate, Mindclave, Valari Collective, and Terran Republic. Include their goals, leadership, and fault lines.
- **Daily Life on Nexus 9:** The Promenade, the Docks, the Deep Core, and the political tension of living in a neutral zone.

### 3.2 The GM's Toolkit (Book 5)
- **Faction Turn System:** Rules for how factions advance their agendas off-screen between sessions (Threat Clocks).
- **Encounter Tables:** Rollable tables for station events, deep space anomalies, and diplomatic crises.

---

## Phase 4: The "Campaign" Sprint (Weeks 7-10)
*Goal: Write the 12-chapter "Gathering Storm" campaign.*

### 4.1 Arc 1: The Fragile Peace (Levels 1-3)
- **Focus:** Local station politics, smuggling disputes, and the introduction of the Eclipse threat.
- **Chapters 1-4:** Detailed encounter sequences, NPC dialogue prompts, and choice trees.

### 4.2 Arc 2: The Shadows Lengthen (Levels 4-6)
- **Focus:** System-wide escalation, factional war breaking out, and the discovery of Progenitor ruins.
- **Chapters 5-8:** Mid-campaign reversals, large-scale ship combat, and diplomatic summits.

### 4.3 Arc 3: The Crucible of Stars (Levels 7-10)
- **Focus:** The cosmic threat of the Eclipse, desperate alliances, and a galaxy-spanning final battle.
- **Chapters 9-12:** High-tier combat, massive consequences, and the resolution of the Fraying Dark mystery.

---

## Phase 5: The "Visual Identity" Sprint (Ongoing)
*Goal: Generate the 75-90 images required for a market-standard product.*

### 5.1 Priority 1 (Immediate Need)
- 8 Class Portraits (Envoy, Operative, Pilot, Marine, Engineer, Mystic, Broker, Medic)
- 6 Faction Insignias
- 6 Pregen Crew Portraits (The Dawnrunner Company)
- 1 Station Map (Nexus 9)

### 5.2 Priority 2 (Mid-Term Need)
- 1 Star Map (The Known Galaxy)
- 6-8 Ship Silhouettes
- 8-12 Adversary Illustrations
- 12 Scene Illustrations (one per campaign chapter)

### 5.3 Priority 3 (Polish)
- Weapon/Gear Illustrations
- Domain Card Borders
- Encounter Maps

---

## Execution Strategy

1. **Data First:** All mechanical additions (stat blocks, progression tables) will be added to the website's data layer (`characterData.ts`, `EncounterBuilder.tsx`) first to ensure the tools remain functional.
2. **Prose Second:** Once the data is verified, the prose will be written into `manuscript.json`.
3. **Art Parallel:** Image generation will occur in parallel with writing, using the "nano banana" style prompt to maintain visual consistency with the cover.
