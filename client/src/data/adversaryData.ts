/**
 * Nexus 9: The Fraying Dark — Complete Adversary Database
 * 
 * All stat blocks follow Daggerheart SRD scaling:
 *   Tier 1: Attack +1, Damage 1d6+2 to 1d12+4, Diff 10-13, Thresholds Major 7 / Severe 12
 *   Tier 2: Attack +2, Damage 2d6+3 to 2d12+4, Diff 14-15, Thresholds Major 10 / Severe 20
 *   Tier 3: Attack +3, Damage 3d8+3 to 3d12+5, Diff 16-17, Thresholds Major 20 / Severe 32
 *   Tier 4: Attack +4, Damage 4d8+10 to 4d12+15, Diff 18-20, Thresholds Major 25 / Severe 45
 * 
 * Fear Budget: T1=1, T2=2, T3=4, T4=8 (Legendary=12)
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdversaryFeature {
  name: string;
  type: "Passive" | "Action" | "Reaction" | "Movement";
  description: string;
}

export interface FearMove {
  name: string;
  fearCost: number;
  description: string;
}

export interface Adversary {
  name: string;
  faction: string;
  tier: number;
  type: "Minion" | "Standard" | "Bruiser" | "Skulk" | "Support" | "Leader" | "Solo" | "Boss" | "Legendary Boss" | "Standard (Ship)" | "Boss (Ship)";
  difficulty: number;
  hp: number;
  attackMod: number;
  damage: string;
  damageType: string;
  thresholds: { major: number; severe: number };
  evasion: number;
  fearCost: number;
  signature: string;
  features: AdversaryFeature[];
  fearMoves: FearMove[];
  stressInflict: number; // 0 = none, 1+ = marks this many Stress on specific triggers
  description: string; // short lore paragraph
}

// ─── Kaelen Syndicate ────────────────────────────────────────────────────────
// Faction identity: Criminal empire. Swarm tactics, dirty tricks, economic pressure.
// Combat feel: Cheap and numerous at low tiers, ruthlessly efficient at high tiers.

const KAELEN_SYNDICATE: Adversary[] = [
  {
    name: "Syndicate Enforcer",
    faction: "Kaelen Syndicate",
    tier: 1,
    type: "Minion",
    difficulty: 12,
    hp: 3,
    attackMod: 1,
    damage: "1d6+2",
    damageType: "ballistic",
    thresholds: { major: 7, severe: 12 },
    evasion: 10,
    fearCost: 1,
    signature: "Cheap muscle that swarms in numbers",
    description: "Street-level thugs armed with cheap pistols and shock-batons. The Syndicate recruits them from the station's lower rings, paying in credits and protection. They fight dirty and flee when outmatched.",
    stressInflict: 0,
    features: [
      { name: "Strength in Numbers", type: "Passive", description: "When two or more Enforcers are adjacent to the same target, they each gain +1 to their attack rolls against that target." },
      { name: "Cheap Shot", type: "Action", description: "The Enforcer makes an attack. On a hit, the target cannot use Reactions until the start of their next turn." },
    ],
    fearMoves: [],
  },
  {
    name: "Syndicate Fixer",
    faction: "Kaelen Syndicate",
    tier: 1,
    type: "Support",
    difficulty: 13,
    hp: 4,
    attackMod: 1,
    damage: "1d6+2",
    damageType: "ballistic",
    thresholds: { major: 7, severe: 12 },
    evasion: 11,
    fearCost: 1,
    signature: "Buffs allies, debuffs PCs with dirty tricks",
    description: "The Fixer is the Syndicate's field coordinator — part quartermaster, part saboteur. They carry stim-packs for allies and flash-grenades for enemies, always staying behind the front line.",
    stressInflict: 1,
    features: [
      { name: "Combat Stim", type: "Action", description: "The Fixer injects an ally within Very Close range with a combat stim. That ally gains +2 to their next attack roll and heals 1 HP." },
      { name: "Flash Grenade", type: "Action", description: "The Fixer throws a flash grenade at a point within Close range. All creatures within Very Close range of that point must succeed on a Difficulty 12 Instinct roll or become Vulnerable until the end of their next turn." },
    ],
    fearMoves: [],
  },
  {
    name: "Syndicate Breacher",
    faction: "Kaelen Syndicate",
    tier: 2,
    type: "Bruiser",
    difficulty: 14,
    hp: 6,
    attackMod: 2,
    damage: "2d8+3",
    damageType: "ballistic",
    thresholds: { major: 10, severe: 20 },
    evasion: 12,
    fearCost: 2,
    signature: "Heavy hitter that breaches cover and defenses",
    description: "Breachers are the Syndicate's shock troops — armored enforcers equipped with breaching charges and heavy shotguns. When the Syndicate wants a door opened or a rival's safe house raided, Breachers go in first.",
    stressInflict: 1,
    features: [
      { name: "Breach Charge", type: "Action", description: "The Breacher places or throws a charge at a point within Close range. All creatures within Very Close range take 2d6+3 damage and any cover in the area is destroyed. Usable once per encounter." },
      { name: "Armored", type: "Passive", description: "The Breacher has an Armor Score of 2. Reduce all incoming damage by 2 before comparing to thresholds." },
      { name: "Scatter Shot", type: "Action", description: "The Breacher fires a wide blast. Make an attack against all creatures in a cone within Very Close range." },
    ],
    fearMoves: [],
  },
  {
    name: "Syndicate Cleaner",
    faction: "Kaelen Syndicate",
    tier: 3,
    type: "Skulk",
    difficulty: 16,
    hp: 8,
    attackMod: 3,
    damage: "3d8+4",
    damageType: "energy",
    thresholds: { major: 20, severe: 32 },
    evasion: 15,
    fearCost: 4,
    signature: "Assassin with devastating single-target damage",
    description: "Cleaners are the Syndicate's elite assassins — the ones called when a problem needs to disappear permanently. They use cloaking tech and mono-filament blades, striking from shadow and vanishing before anyone can react.",
    stressInflict: 2,
    features: [
      { name: "Cloaking Field", type: "Passive", description: "The Cleaner begins combat Hidden. After making an attack, they may spend 1 Fear to immediately become Hidden again if they are in dim light or darkness." },
      { name: "Assassinate", type: "Action", description: "If the Cleaner is Hidden, their next attack deals an additional 2d8 damage. If this attack reduces the target to 0 HP, the Cleaner marks no Stress." },
      { name: "Vanish", type: "Reaction", description: "When the Cleaner takes damage, they may move up to Close range and become Hidden. Usable once per encounter." },
    ],
    fearMoves: [
      { name: "Mark for Death", fearCost: 2, description: "The Cleaner designates one PC as their target. Until the end of the encounter, the Cleaner has Advantage on all attacks against that target and deals +1d8 damage to them." },
    ],
  },
  {
    name: "Syndicate Overlord",
    faction: "Kaelen Syndicate",
    tier: 4,
    type: "Boss",
    difficulty: 18,
    hp: 12,
    attackMod: 4,
    damage: "4d8+10",
    damageType: "energy",
    thresholds: { major: 25, severe: 45 },
    evasion: 16,
    fearCost: 8,
    signature: "Commands minions and controls the battlefield with Fear Moves",
    description: "The Overlord is a Syndicate crime lord who has clawed their way to the top through cunning, violence, and an extensive network of informants. They rarely fight alone — when cornered, they summon reinforcements and use hostages as shields.",
    stressInflict: 2,
    features: [
      { name: "Crime Lord's Guard", type: "Passive", description: "While the Overlord has at least one Syndicate ally within Very Close range, all attacks against the Overlord have Disadvantage. The ally takes the damage instead if the attack hits." },
      { name: "Commanding Presence", type: "Action", description: "The Overlord commands all Syndicate allies within Far range to immediately move up to Close range and make one attack each." },
      { name: "Personal Shield", type: "Passive", description: "The Overlord has an Armor Score of 3 and begins the encounter with 3 Armor Slots." },
    ],
    fearMoves: [
      { name: "Call Reinforcements", fearCost: 3, description: "2d4 Syndicate Enforcers arrive at the edges of the encounter area. They act on the Overlord's initiative." },
      { name: "Hostage Gambit", fearCost: 2, description: "The Overlord seizes a nearby civilian or downed ally and uses them as a shield. Any attack against the Overlord that misses hits the hostage instead. PCs must succeed on a Difficulty 18 Presence roll to talk the Overlord into releasing them." },
    ],
  },
];

// ─── Aurelian Empire ─────────────────────────────────────────────────────────
// Faction identity: Militaristic theocracy. Disciplined formations, heavy armor, divine authority.
// Combat feel: Slow but devastating. Formation bonuses. War-Priests buff and heal.

const AURELIAN_EMPIRE: Adversary[] = [
  {
    name: "Aurelian Legionnaire",
    faction: "Aurelian Empire",
    tier: 1,
    type: "Standard",
    difficulty: 13,
    hp: 4,
    attackMod: 1,
    damage: "1d8+3",
    damageType: "ballistic",
    thresholds: { major: 7, severe: 12 },
    evasion: 11,
    fearCost: 1,
    signature: "Disciplined soldier that fights in formation",
    description: "The backbone of the Aurelian military. Legionnaires are drilled from youth in the art of formation combat, carrying energy lances and tower shields. Alone they are competent; in formation they are terrifying.",
    stressInflict: 0,
    features: [
      { name: "Shield Wall", type: "Passive", description: "When adjacent to another Legionnaire, both gain +2 to their Evasion and an Armor Score of 1." },
      { name: "Formation Strike", type: "Action", description: "The Legionnaire makes a melee attack. If another Legionnaire is adjacent to the same target, the attack deals an additional 1d6 damage." },
    ],
    fearMoves: [],
  },
  {
    name: "Aurelian Centurion",
    faction: "Aurelian Empire",
    tier: 2,
    type: "Leader",
    difficulty: 15,
    hp: 6,
    attackMod: 2,
    damage: "2d8+3",
    damageType: "energy",
    thresholds: { major: 10, severe: 20 },
    evasion: 13,
    fearCost: 2,
    signature: "Tactical commander that buffs Legionnaires",
    description: "Centurions are field officers of the Aurelian legions, distinguished by their golden crests and command authority. They issue orders that transform disorganized troops into a lethal machine.",
    stressInflict: 1,
    features: [
      { name: "Tactical Command", type: "Action", description: "The Centurion issues a command. All Aurelian allies within Close range gain +1 to attack rolls and +1 to Evasion until the start of the Centurion's next turn." },
      { name: "Disciplined Counter", type: "Reaction", description: "When a PC attacks an Aurelian ally within Very Close range of the Centurion, the Centurion may make a free melee attack against that PC." },
      { name: "Heavy Armor", type: "Passive", description: "The Centurion has an Armor Score of 2." },
    ],
    fearMoves: [
      { name: "Hold the Line!", fearCost: 2, description: "All Aurelian allies within Close range immediately heal 2 HP and gain Advantage on their next attack roll. Any Aurelian ally that was Frightened is no longer Frightened." },
    ],
  },
  {
    name: "Aurelian Praetorian Guard",
    faction: "Aurelian Empire",
    tier: 3,
    type: "Solo",
    difficulty: 17,
    hp: 9,
    attackMod: 3,
    damage: "3d10+4",
    damageType: "energy",
    thresholds: { major: 20, severe: 32 },
    evasion: 14,
    fearCost: 4,
    signature: "Elite bodyguard in heavy powered armor",
    description: "The Praetorian Guard are the Emperor's personal warriors — each one worth a squad of Legionnaires. Encased in relic-tech powered armor passed down through generations, they are walking fortresses of faith and fury.",
    stressInflict: 1,
    features: [
      { name: "Relic Armor", type: "Passive", description: "The Praetorian has an Armor Score of 4 and 4 Armor Slots. Their armor cannot be bypassed by the Piercing weapon feature." },
      { name: "Guardian's Oath", type: "Reaction", description: "When an ally within Very Close range would take damage, the Praetorian may take the damage instead." },
      { name: "Devastating Sweep", type: "Action", description: "The Praetorian makes a melee attack against all creatures within Melee range. Each target hit is pushed to Very Close range." },
    ],
    fearMoves: [
      { name: "Unyielding Advance", fearCost: 2, description: "The Praetorian moves up to Close range, ignoring difficult terrain and opportunity attacks. They make a melee attack against every creature they pass through, dealing 3d10+4 damage on a hit." },
    ],
  },
  {
    name: "Aurelian War-Priest",
    faction: "Aurelian Empire",
    tier: 3,
    type: "Leader",
    difficulty: 16,
    hp: 8,
    attackMod: 3,
    damage: "3d8+3",
    damageType: "energy",
    thresholds: { major: 20, severe: 32 },
    evasion: 13,
    fearCost: 4,
    signature: "Healer and divine buffer for Imperial forces",
    description: "War-Priests channel the Aurelian faith into battlefield miracles — mending wounds, bolstering courage, and calling down divine wrath on heretics. They are the spiritual backbone of every legion.",
    stressInflict: 2,
    features: [
      { name: "Divine Mending", type: "Action", description: "The War-Priest heals an ally within Close range for 3 HP and clears one condition from them." },
      { name: "Wrath of the Throne", type: "Action", description: "The War-Priest calls down a beam of searing light on a target within Far range. The target takes 3d8+3 energy damage and must succeed on a Difficulty 16 Instinct roll or become Vulnerable." },
      { name: "Aura of Command", type: "Passive", description: "All Aurelian allies within Close range of the War-Priest are immune to the Frightened condition." },
    ],
    fearMoves: [
      { name: "Judgment of the Emperor", fearCost: 3, description: "The War-Priest designates one PC as a heretic. All Aurelian allies gain +2 to attack rolls against that PC and deal +1d6 damage to them until the end of the encounter or until the War-Priest is defeated." },
    ],
  },
];

// ─── Mindclave ───────────────────────────────────────────────────────────────
// Faction identity: Psychic collective. Mind control, telepathic assault, information warfare.
// Combat feel: Stress-heavy, condition-heavy. They attack your mind, not your body.

const MINDCLAVE: Adversary[] = [
  {
    name: "Mindclave Hound",
    faction: "Mindclave",
    tier: 1,
    type: "Skulk",
    difficulty: 12,
    hp: 3,
    attackMod: 1,
    damage: "1d8+2",
    damageType: "psychic",
    thresholds: { major: 7, severe: 12 },
    evasion: 12,
    fearCost: 1,
    signature: "Psychic tracker and flanker",
    description: "Hounds are the Mindclave's trackers — low-level telepaths conditioned to hunt specific psychic signatures. They move in packs, flanking targets and overwhelming them with coordinated psychic static.",
    stressInflict: 1,
    features: [
      { name: "Psychic Scent", type: "Passive", description: "The Hound can sense the location of all creatures within Far range, even through walls and while Hidden. Creatures cannot hide from a Hound using conventional stealth." },
      { name: "Mind Bite", type: "Action", description: "The Hound makes a psychic attack against a target within Close range. On a hit, the target takes 1d8+2 psychic damage and marks 1 Stress." },
    ],
    fearMoves: [],
  },
  {
    name: "Mindclave Inquisitor",
    faction: "Mindclave",
    tier: 2,
    type: "Support",
    difficulty: 14,
    hp: 5,
    attackMod: 2,
    damage: "2d6+3",
    damageType: "psychic",
    thresholds: { major: 10, severe: 20 },
    evasion: 13,
    fearCost: 2,
    signature: "Psychic interrogator and mind controller",
    description: "Inquisitors are the Mindclave's field interrogators. They crack minds like safes, extracting secrets and implanting commands. In combat, they turn enemies against each other.",
    stressInflict: 2,
    features: [
      { name: "Psychic Probe", type: "Action", description: "The Inquisitor targets one creature within Close range. The target must succeed on a Difficulty 14 Knowledge roll or the Inquisitor learns one secret the target is keeping (GM decides what is revealed). The target marks 1 Stress regardless." },
      { name: "Implant Command", type: "Action", description: "The Inquisitor targets one creature within Close range. The target must succeed on a Difficulty 14 Presence roll or be forced to take one specific action on their next turn (move to a location, drop a weapon, or attack an ally). The target is aware they are being controlled." },
      { name: "Telepathic Link", type: "Passive", description: "All Mindclave allies within Far range of the Inquisitor can communicate telepathically and cannot be surprised." },
    ],
    fearMoves: [
      { name: "Shatter Will", fearCost: 2, description: "The Inquisitor unleashes a psychic scream. All PCs within Close range must succeed on a Difficulty 14 Presence roll or mark 2 Stress and become Frightened until the end of their next turn." },
    ],
  },
  {
    name: "Mindclave Handler",
    faction: "Mindclave",
    tier: 3,
    type: "Leader",
    difficulty: 16,
    hp: 8,
    attackMod: 3,
    damage: "3d8+3",
    damageType: "psychic",
    thresholds: { major: 20, severe: 32 },
    evasion: 14,
    fearCost: 4,
    signature: "Commands Hounds and dominates thralls",
    description: "Handlers are senior Mindclave operatives who maintain psychic control over entire networks of Hounds and civilian thralls. They rarely engage directly, preferring to command from behind a wall of dominated pawns.",
    stressInflict: 2,
    features: [
      { name: "Command Thrall", type: "Action", description: "The Handler seizes psychic control of one non-player creature within Close range with 6 HP or fewer. The creature acts on the Handler's turn and obeys their commands. The creature can repeat a Difficulty 16 Presence roll at the end of each of its turns to break free." },
      { name: "Hound Network", type: "Passive", description: "All Mindclave Hounds within Far range of the Handler gain +1 to attack rolls and +1 to Evasion." },
      { name: "Psychic Barrier", type: "Reaction", description: "When the Handler would take damage, they may redirect the damage to a Mindclave ally or thrall within Very Close range instead." },
    ],
    fearMoves: [
      { name: "Mass Domination", fearCost: 3, description: "The Handler attempts to dominate one PC. The target must succeed on a Difficulty 16 Presence roll or be controlled by the Handler for one round. The Handler chooses the PC's action on their next turn. The PC is aware they are being controlled and can describe their horror." },
      { name: "Psychic Storm", fearCost: 2, description: "All creatures within Close range of the Handler (including allies) take 3d6 psychic damage and mark 2 Stress. Mindclave creatures are immune." },
    ],
  },
  {
    name: "Mindclave High Councilor",
    faction: "Mindclave",
    tier: 4,
    type: "Boss",
    difficulty: 18,
    hp: 12,
    attackMod: 4,
    damage: "4d8+10",
    damageType: "psychic",
    thresholds: { major: 25, severe: 45 },
    evasion: 16,
    fearCost: 8,
    signature: "Mass telepathy, reality distortion, Fear Moves",
    description: "A High Councilor is one of the ruling minds of the Mindclave — a telepath of such power that their mere presence causes migraines and hallucinations. They can rewrite memories, shatter wills, and turn entire crowds into puppets.",
    stressInflict: 3,
    features: [
      { name: "Psychic Aura", type: "Passive", description: "All non-Mindclave creatures within Close range of the High Councilor have Disadvantage on Knowledge and Presence rolls." },
      { name: "Mind Crush", type: "Action", description: "The High Councilor targets one creature within Far range. The target takes 4d8+10 psychic damage and marks 2 Stress. If this reduces the target to 0 HP, the High Councilor may raise them as a thrall with 1 HP on their next turn." },
      { name: "Thought Shield", type: "Passive", description: "The High Councilor is immune to psychic damage and cannot be charmed, frightened, or dominated. They have an Armor Score of 2 (psychic shielding)." },
    ],
    fearMoves: [
      { name: "Rewrite Memory", fearCost: 3, description: "The High Councilor targets one PC within Close range. The target must succeed on a Difficulty 18 Presence roll or have one memory altered. The GM and the target's player negotiate what changes — the PC believes the false memory is real until evidence proves otherwise." },
      { name: "Puppet Master", fearCost: 4, description: "The High Councilor seizes control of one PC for a full round. The GM controls the PC's movement and actions. The PC can spend 3 Hope to break free at the start of their controlled turn." },
    ],
  },
];

// ─── Valari Collective ───────────────────────────────────────────────────────
// Faction identity: Warrior-mystic culture. Honor-bound melee, sacred rage, spiritual communion.
// Combat feel: Fast, aggressive melee. High single-target damage. Rage mechanics.

const VALARI_COLLECTIVE: Adversary[] = [
  {
    name: "Valari Skirmisher",
    faction: "Valari Collective",
    tier: 1,
    type: "Standard",
    difficulty: 13,
    hp: 4,
    attackMod: 1,
    damage: "1d10+3",
    damageType: "kinetic",
    thresholds: { major: 7, severe: 12 },
    evasion: 12,
    fearCost: 1,
    signature: "Fast melee fighter with ritual blades",
    description: "Skirmishers are young Valari warriors on their first tour of duty. They fight with paired ritual blades and move with a fluid, dance-like grace that belies their lethal intent.",
    stressInflict: 0,
    features: [
      { name: "Swift Strike", type: "Action", description: "The Skirmisher moves up to Close range and makes a melee attack in the same action." },
      { name: "Ritual Fury", type: "Passive", description: "When the Skirmisher is reduced to half HP or below, they gain +1 to attack rolls and deal +1d4 additional damage." },
    ],
    fearMoves: [],
  },
  {
    name: "Valari Templar",
    faction: "Valari Collective",
    tier: 2,
    type: "Bruiser",
    difficulty: 15,
    hp: 7,
    attackMod: 2,
    damage: "2d10+4",
    damageType: "kinetic",
    thresholds: { major: 10, severe: 20 },
    evasion: 13,
    fearCost: 2,
    signature: "Heavy melee warrior in sacred rage",
    description: "Templars are Valari holy warriors who channel their spiritual communion into devastating melee combat. When they enter their sacred rage, their eyes glow with inner fire and their blows can shatter bulkheads.",
    stressInflict: 1,
    features: [
      { name: "Sacred Rage", type: "Action", description: "The Templar enters a sacred rage (lasts until end of encounter or until they are reduced to 0 HP). While raging: +2 to melee damage, resistance to kinetic damage (halve before thresholds), and they cannot use ranged attacks or retreat." },
      { name: "Cleaving Blow", type: "Action", description: "The Templar makes a melee attack. If it hits, the Templar may make a second attack against a different target within Melee range at no additional cost." },
      { name: "Unbreakable Will", type: "Passive", description: "The Templar is immune to the Frightened condition and has Advantage on rolls to resist psychic effects." },
    ],
    fearMoves: [
      { name: "Blood Oath", fearCost: 2, description: "The Templar swears a blood oath against the PC who last damaged them. The Templar gains +3 to attack rolls against that PC and automatically succeeds on any roll to resist being moved away from them." },
    ],
  },
  {
    name: "Valari Blademaster",
    faction: "Valari Collective",
    tier: 3,
    type: "Solo",
    difficulty: 17,
    hp: 9,
    attackMod: 3,
    damage: "3d10+5",
    damageType: "kinetic",
    thresholds: { major: 20, severe: 32 },
    evasion: 16,
    fearCost: 4,
    signature: "Duelist with devastating single-target damage",
    description: "Blademasters are the apex of Valari martial tradition — warriors who have spent decades perfecting a single fighting style. Each Blademaster is a living legend, and defeating one in single combat is the highest honor a warrior can achieve.",
    stressInflict: 1,
    features: [
      { name: "Duelist's Challenge", type: "Action", description: "The Blademaster challenges one PC to single combat. If the PC accepts, no other creature may attack either combatant. The Blademaster gains +2 to attack rolls and Evasion against the challenged PC. If the PC refuses, all Valari allies gain +1 to attack rolls against that PC (dishonor penalty)." },
      { name: "Blade Dance", type: "Reaction", description: "When the Blademaster is attacked in melee, they may make a free counterattack against the attacker." },
      { name: "Perfect Parry", type: "Reaction", description: "The Blademaster reduces incoming melee damage by 1d10+5. Usable once per round." },
    ],
    fearMoves: [
      { name: "Thousand Cuts", fearCost: 3, description: "The Blademaster makes three attacks against a single target, each dealing 3d10+5 damage. If all three hit, the target also marks 2 Stress." },
    ],
  },
];

// ─── Terran Coalition ─────────────────────────────────────────────────────────
// Faction identity: Democratic military power. Combined arms, tech advantage, by-the-book tactics.
// Combat feel: Ranged-focused, tactical, uses cover and suppression.

const TERRAN_COALITION: Adversary[] = [
  {
    name: "Terran Marine",
    faction: "Terran Coalition",
    tier: 1,
    type: "Standard",
    difficulty: 13,
    hp: 4,
    attackMod: 1,
    damage: "1d8+3",
    damageType: "ballistic",
    thresholds: { major: 7, severe: 12 },
    evasion: 11,
    fearCost: 1,
    signature: "Reliable ranged soldier using cover and suppression",
    description: "Terran Marines are the Coalition's standard infantry — well-trained, well-equipped, and fighting by the book. They use cover effectively and coordinate fire with squad-mates.",
    stressInflict: 0,
    features: [
      { name: "Suppressive Fire", type: "Action", description: "The Marine fires a sustained burst at a zone within Far range. All creatures in that zone must succeed on a Difficulty 13 Agility roll or become Slowed until the end of their next turn. Creatures that move through the zone before the Marine's next turn take 1d6 damage." },
      { name: "Take Cover", type: "Reaction", description: "When the Marine is attacked by a ranged attack, they may drop prone and gain +2 to Evasion against that attack." },
    ],
    fearMoves: [],
  },
  {
    name: "Terran Special Forces Operative",
    faction: "Terran Coalition",
    tier: 2,
    type: "Skulk",
    difficulty: 15,
    hp: 5,
    attackMod: 2,
    damage: "2d8+4",
    damageType: "ballistic",
    thresholds: { major: 10, severe: 20 },
    evasion: 14,
    fearCost: 2,
    signature: "Stealth specialist and ambush expert",
    description: "SpecOps operatives are the Coalition's black-ops soldiers — trained in infiltration, sabotage, and precision elimination. They operate in small teams behind enemy lines.",
    stressInflict: 1,
    features: [
      { name: "Ambush", type: "Passive", description: "If the Operative attacks from Hidden, they deal an additional 1d8 damage and the target must mark 1 Stress." },
      { name: "Tactical Cloak", type: "Action", description: "The Operative activates a short-duration cloaking field and becomes Hidden. Lasts until they attack or take damage." },
      { name: "Breach and Clear", type: "Action", description: "The Operative throws a flashbang at a point within Close range, then moves to that point. All creatures within Very Close range of the detonation must succeed on a Difficulty 15 Instinct roll or become Stunned until the end of their next turn." },
    ],
    fearMoves: [
      { name: "Precision Strike", fearCost: 2, description: "The Operative makes a single attack with Advantage that deals maximum damage (2d8+4, treat all dice as maximum: 20 total). If this reduces the target to 0 HP, the Operative immediately becomes Hidden." },
    ],
  },
  {
    name: "Terran Heavy Assault Trooper",
    faction: "Terran Coalition",
    tier: 3,
    type: "Solo",
    difficulty: 16,
    hp: 10,
    attackMod: 3,
    damage: "3d10+4",
    damageType: "ballistic",
    thresholds: { major: 20, severe: 32 },
    evasion: 12,
    fearCost: 4,
    signature: "Powered exoskeleton with missile barrage",
    description: "Heavy Assault Troopers wear the Coalition's most advanced powered exoskeletons — walking tanks armed with rotary cannons and micro-missile pods. They are deployed when the Coalition needs to make a statement.",
    stressInflict: 1,
    features: [
      { name: "Powered Exoskeleton", type: "Passive", description: "The Trooper has an Armor Score of 4 and 4 Armor Slots. They are immune to the Slowed condition and cannot be pushed or knocked prone." },
      { name: "Rotary Cannon", type: "Action", description: "The Trooper fires a sustained burst in a cone within Close range. All creatures in the cone take 3d10+4 ballistic damage (Difficulty 16 Agility roll for half)." },
      { name: "Micro-Missile Pod", type: "Action", description: "The Trooper fires a volley of missiles at a point within Far range. All creatures within Very Close range of the impact take 3d8+3 damage. Usable twice per encounter." },
    ],
    fearMoves: [
      { name: "Overcharge", fearCost: 3, description: "The Trooper overcharges their exoskeleton. For the next two rounds, they gain +2 to all attack rolls, +1d10 to all damage, and their movement speed doubles. At the end of the second round, the exoskeleton shuts down for one round (the Trooper is Stunned)." },
    ],
  },
];

// ─── Eclipse-Touched ─────────────────────────────────────────────────────────
// Faction identity: The cosmic threat. Corruption, void energy, reality distortion.
// Combat feel: Terrifying. Stress-heavy. Phase shifting. Swarm + elite mix.

const ECLIPSE: Adversary[] = [
  {
    name: "Eclipse Void-Spawn",
    faction: "Eclipse",
    tier: 1,
    type: "Minion",
    difficulty: 11,
    hp: 2,
    attackMod: 1,
    damage: "1d6+2",
    damageType: "void",
    thresholds: { major: 7, severe: 12 },
    evasion: 10,
    fearCost: 1,
    signature: "Expendable swarm creature from the void",
    description: "Void-Spawn are the Eclipse's foot soldiers — twisted, semi-corporeal entities that pour through rifts in reality. They are barely intelligent, driven by hunger and the will of their masters.",
    stressInflict: 1,
    features: [
      { name: "Void Touch", type: "Passive", description: "All damage dealt by the Void-Spawn is void damage. Creatures damaged by void damage mark 1 Stress in addition to any HP loss." },
      { name: "Expendable", type: "Passive", description: "When a Void-Spawn is destroyed, it explodes in a burst of void energy. All creatures within Melee range take 1d4 void damage." },
    ],
    fearMoves: [],
  },
  {
    name: "Eclipse Void-Stalker",
    faction: "Eclipse",
    tier: 2,
    type: "Skulk",
    difficulty: 14,
    hp: 5,
    attackMod: 2,
    damage: "2d8+3",
    damageType: "void",
    thresholds: { major: 10, severe: 20 },
    evasion: 14,
    fearCost: 2,
    signature: "Psychic ambusher that phase-shifts through walls",
    description: "Void-Stalkers are Eclipse predators that exist partially outside normal space. They phase through solid matter, appear behind targets, and strike with tendrils of concentrated void energy.",
    stressInflict: 2,
    features: [
      { name: "Phase Shift", type: "Movement", description: "The Void-Stalker can move through solid objects and walls. They cannot end their turn inside a solid object." },
      { name: "Void Tendril", type: "Action", description: "The Void-Stalker makes an attack against a target within Close range. On a hit, the target takes 2d8+3 void damage and marks 1 Stress. On a critical hit (Hope die equals Fear die), the target is also Restrained by void tendrils until they succeed on a Difficulty 14 Strength roll." },
      { name: "Flicker", type: "Reaction", description: "When the Void-Stalker is hit by an attack, they may phase partially out of reality. The damage is halved. Usable once per round." },
    ],
    fearMoves: [
      { name: "Drag Into the Void", fearCost: 2, description: "The Void-Stalker grabs a target within Melee range and partially drags them into the void. The target takes 2d8 void damage, marks 2 Stress, and is Restrained. They must succeed on a Difficulty 14 Strength roll at the start of each turn or take an additional 1d8 void damage. Another PC can free them with a Difficulty 14 Strength roll." },
    ],
  },
  {
    name: "Eclipse Void-Caller",
    faction: "Eclipse",
    tier: 2,
    type: "Leader",
    difficulty: 15,
    hp: 7,
    attackMod: 2,
    damage: "2d6+3",
    damageType: "void",
    thresholds: { major: 10, severe: 20 },
    evasion: 12,
    fearCost: 2,
    signature: "Summons Void-Spawn and launches psychic attacks",
    description: "Void-Callers are Eclipse entities that serve as conduits between the void and normal space. They tear open small rifts to summon Void-Spawn and project waves of psychic corruption.",
    stressInflict: 2,
    features: [
      { name: "Summon Void-Spawn", type: "Action", description: "The Void-Caller tears open a rift at a point within Close range. 1d4 Void-Spawn emerge from the rift and act on the Void-Caller's next turn. The rift remains open and produces 1 additional Void-Spawn at the start of each of the Void-Caller's turns until it is closed (Difficulty 15 Knowledge roll as an action while adjacent)." },
      { name: "Corruption Wave", type: "Action", description: "The Void-Caller projects a wave of void energy in a cone within Close range. All creatures in the cone take 2d6+3 void damage and mark 1 Stress." },
      { name: "Void Tether", type: "Passive", description: "All Eclipse allies within Close range of the Void-Caller heal 1 HP at the start of the Void-Caller's turn." },
    ],
    fearMoves: [
      { name: "Reality Fracture", fearCost: 2, description: "The Void-Caller cracks reality in a zone within Far range. The zone becomes difficult terrain filled with void energy. Any creature that starts its turn in the zone or enters it takes 2d6 void damage and marks 1 Stress. The fracture lasts for 3 rounds." },
    ],
  },
  {
    name: "Eclipse Void-Shape",
    faction: "Eclipse",
    tier: 4,
    type: "Boss",
    difficulty: 19,
    hp: 15,
    attackMod: 4,
    damage: "4d10+12",
    damageType: "void",
    thresholds: { major: 25, severe: 45 },
    evasion: 16,
    fearCost: 8,
    signature: "Reality-warping entity of immense power",
    description: "A Void-Shape is a fully manifested Eclipse entity — a being of pure void energy that warps reality around it. Gravity bends, light dims, and the laws of physics become suggestions in its presence. Fighting one is less a battle and more a struggle to maintain sanity.",
    stressInflict: 3,
    features: [
      { name: "Reality Warp", type: "Passive", description: "The area within Close range of the Void-Shape is warped. All non-Eclipse creatures in this area have Disadvantage on all rolls. Ranged attacks that pass through the area have a 50% chance of being deflected harmlessly." },
      { name: "Void Slam", type: "Action", description: "The Void-Shape strikes with a massive tendril of void energy. One target within Close range takes 4d10+12 void damage and is pushed to Far range. If they hit a solid surface, they take an additional 2d6 damage." },
      { name: "Regeneration", type: "Passive", description: "The Void-Shape heals 3 HP at the start of each of its turns. This regeneration can be suppressed for one round by dealing energy or radiant damage to it." },
    ],
    fearMoves: [
      { name: "Void Collapse", fearCost: 4, description: "The Void-Shape collapses reality in a sphere within Far range. All creatures in the area take 4d12+10 void damage, mark 3 Stress, and are pulled to the center of the sphere. Creatures reduced to 0 HP by this attack are consumed by the void (death, no recovery possible without extraordinary intervention)." },
      { name: "Corrupt Champion", fearCost: 3, description: "The Void-Shape targets one PC within Close range. The target must succeed on a Difficulty 19 Presence roll or gain the Eclipse-Touched corruption: their eyes turn black, they deal void damage with all attacks, and they must succeed on a Difficulty 14 Presence roll at the start of each turn or attack the nearest creature (friend or foe). The corruption can be removed by a Difficulty 19 Knowledge roll during a Long Rest." },
    ],
  },
  {
    name: "The Eclipse Overmind",
    faction: "Eclipse",
    tier: 4,
    type: "Legendary Boss",
    difficulty: 20,
    hp: 15,
    attackMod: 4,
    damage: "4d12+15",
    damageType: "void",
    thresholds: { major: 25, severe: 45 },
    evasion: 17,
    fearCost: 12,
    signature: "Final campaign boss with Legendary Actions",
    description: "The Overmind is the intelligence behind the Eclipse — an ancient, cosmic entity that exists outside normal spacetime. It is not a creature in any conventional sense but a malevolent force of entropy given will. Confronting it is the climax of the Gathering Storm campaign.",
    stressInflict: 3,
    features: [
      { name: "Legendary Resistance (3/encounter)", type: "Passive", description: "When the Overmind fails a roll, it may choose to succeed instead. It can do this three times per encounter." },
      { name: "Void Incarnate", type: "Passive", description: "The Overmind is immune to void, psychic, and kinetic damage. It is immune to all conditions. It cannot be moved against its will." },
      { name: "Entropic Aura", type: "Passive", description: "All non-Eclipse creatures within Close range of the Overmind take 2d6 void damage and mark 1 Stress at the start of the Overmind's turn." },
      { name: "Legendary Actions (3/round)", type: "Action", description: "The Overmind can take 3 Legendary Actions per round, each at the end of another creature's turn. Options: (1 action) Void Lash — one target within Far range takes 4d8+10 void damage. (2 actions) Summon — 2d4 Void-Spawn appear within Close range. (3 actions) Reality Shatter — as the Void Collapse Fear Move, but costs no Fear." },
    ],
    fearMoves: [
      { name: "The Fraying Dark", fearCost: 5, description: "The Overmind begins to unravel reality itself. Every PC must make a Difficulty 20 Presence roll. On a failure, the PC is trapped in a personal nightmare for 1 round (Stunned, marks 3 Stress). On a success, the PC takes 4d8 void damage but remains conscious. If every PC fails, the Overmind heals to full HP." },
      { name: "Consume Star", fearCost: 4, description: "The Overmind draws power from a nearby star or energy source. It heals 5 HP, gains +2 to all attack rolls for 2 rounds, and the battlefield is plunged into darkness (all creatures are effectively Blinded unless they have void sight or technological countermeasures)." },
    ],
  },
];

// ─── Station / Automated ─────────────────────────────────────────────────────
// Faction identity: Neutral station defenses. Hackable, predictable, but numerous.

const STATION: Adversary[] = [
  {
    name: "Station Security Drone",
    faction: "Nexus 9 Station",
    tier: 1,
    type: "Minion",
    difficulty: 11,
    hp: 2,
    attackMod: 1,
    damage: "1d6+2",
    damageType: "energy",
    thresholds: { major: 7, severe: 12 },
    evasion: 10,
    fearCost: 1,
    signature: "Automated patrol drone, hackable",
    description: "Standard-issue station security drones that patrol the corridors of Nexus 9. They are predictable, following set patrol routes, but they are networked — disable one and the others know.",
    stressInflict: 0,
    features: [
      { name: "Networked Alert", type: "Passive", description: "When a Security Drone is destroyed or detects an intruder, all other Security Drones within the same station ring are alerted and converge on the location within 2 rounds." },
      { name: "Stun Beam", type: "Action", description: "The Drone fires a non-lethal stun beam at a target within Close range. On a hit, the target takes 1d6+2 energy damage. If this damage exceeds the target's Minor threshold, the target is also Stunned until the end of their next turn." },
      { name: "Hackable", type: "Passive", description: "A PC can attempt to hack the Drone with a Difficulty 12 Knowledge roll as an action. On success, the Drone is disabled for 1 minute or can be reprogrammed to serve the party for the remainder of the encounter." },
    ],
    fearMoves: [],
  },
];

// ─── Named Villains ──────────────────────────────────────────────────────────

const NAMED_VILLAINS: Adversary[] = [
  {
    name: "The Whisperer",
    faction: "Eclipse (Named)",
    tier: 4,
    type: "Boss",
    difficulty: 19,
    hp: 15,
    attackMod: 4,
    damage: "4d8+10",
    damageType: "void",
    thresholds: { major: 25, severe: 45 },
    evasion: 17,
    fearCost: 10,
    signature: "Primary Eclipse agent — Dominate, Reality Blur, infiltrator",
    description: "The Whisperer is the Eclipse's primary agent within known space — a being that wears the faces of the dead and speaks with the voices of lost loved ones. It has infiltrated every faction, and no one knows its true form. It is the recurring villain of the Gathering Storm campaign.",
    stressInflict: 3,
    features: [
      { name: "Shapeshifter", type: "Passive", description: "The Whisperer can perfectly mimic the appearance, voice, and mannerisms of any humanoid it has touched. Detecting the disguise requires a Difficulty 19 Instinct roll, and only if the observer has reason to suspect deception." },
      { name: "Dominate", type: "Action", description: "The Whisperer targets one creature within Close range. The target must succeed on a Difficulty 19 Presence roll or be charmed by the Whisperer. While charmed, the target regards the Whisperer as a trusted ally and will not attack it. The charm breaks if the Whisperer or its allies damage the target." },
      { name: "Reality Blur", type: "Reaction", description: "When the Whisperer would be reduced to 0 HP, it instead drops to 1 HP and teleports to a location within Very Far range. It then becomes Hidden and assumes a new disguise. Usable once per encounter." },
    ],
    fearMoves: [
      { name: "Speak with the Dead", fearCost: 3, description: "The Whisperer assumes the form and voice of someone a PC has lost — a dead friend, family member, or mentor. The target PC must succeed on a Difficulty 19 Presence roll or be Stunned for 1 round and mark 3 Stress as they are overwhelmed by grief and confusion." },
      { name: "Sow Discord", fearCost: 2, description: "The Whisperer implants a false memory or suspicion in one PC's mind. The target believes one of their allies has betrayed them (the GM chooses which ally and what the betrayal appears to be). The false belief persists until the PC succeeds on a Difficulty 17 Knowledge roll or is presented with clear evidence." },
    ],
  },
];

// ─── Progenitor ──────────────────────────────────────────────────────────────
// Ancient machines. Adaptive, mysterious, powerful.

const PROGENITOR: Adversary[] = [
  {
    name: "Progenitor Sentinel",
    faction: "Progenitor",
    tier: 3,
    type: "Bruiser",
    difficulty: 16,
    hp: 10,
    attackMod: 3,
    damage: "3d10+5",
    damageType: "energy",
    thresholds: { major: 20, severe: 32 },
    evasion: 14,
    fearCost: 4,
    signature: "Ancient machine guardian with adaptive shielding",
    description: "Progenitor Sentinels are ancient war machines that guard the ruins and artifacts of the long-vanished Progenitor civilization. They activate when intruders approach and fight with terrifying efficiency, adapting to threats in real-time.",
    stressInflict: 1,
    features: [
      { name: "Adaptive Shielding", type: "Passive", description: "After the Sentinel takes damage of a specific type (ballistic, energy, kinetic, etc.), it gains resistance to that damage type for the rest of the encounter (halve damage before thresholds). It can adapt to up to 2 damage types." },
      { name: "Progenitor Beam", type: "Action", description: "The Sentinel fires a beam of concentrated energy at a target within Far range. The target takes 3d10+5 energy damage. If the target is behind cover, the beam ignores the cover." },
      { name: "Self-Repair", type: "Passive", description: "The Sentinel heals 2 HP at the start of each of its turns. This can be disrupted by a Difficulty 16 Knowledge roll (as an action) to identify and target its repair systems." },
    ],
    fearMoves: [
      { name: "Progenitor Protocol", fearCost: 3, description: "The Sentinel activates an ancient defense protocol. It gains +2 to all attack rolls and Evasion for 2 rounds, and it makes two attacks per turn instead of one. At the end of the protocol, it must spend one round recharging (Stunned)." },
    ],
  },
];

// ─── Pirates & Rogues ────────────────────────────────────────────────────────
// Faction identity: Opportunists. Aggressive, unpredictable, boarding-focused.

const PIRATES: Adversary[] = [
  {
    name: "Void Pirate Raider",
    faction: "Pirates",
    tier: 1,
    type: "Standard",
    difficulty: 12,
    hp: 3,
    attackMod: 1,
    damage: "1d8+2",
    damageType: "ballistic",
    thresholds: { major: 7, severe: 12 },
    evasion: 11,
    fearCost: 1,
    signature: "Aggressive pirate with bloodlust",
    description: "Void Pirates are the scourge of the trade lanes — desperate, violent, and utterly unpredictable. Raiders are the rank-and-file, armed with scavenged weapons and fueled by desperation.",
    stressInflict: 0,
    features: [
      { name: "Bloodlust", type: "Passive", description: "When the Raider reduces a creature to 0 HP, they immediately heal 1 HP and gain +1 to their next attack roll." },
      { name: "Boarding Hook", type: "Action", description: "The Raider throws a magnetic grapple at a target within Close range. On a hit (Difficulty 12 Agility to dodge), the target is pulled to Melee range and the Raider makes a free melee attack." },
    ],
    fearMoves: [],
  },
  {
    name: "Void Pirate Captain",
    faction: "Pirates",
    tier: 2,
    type: "Leader",
    difficulty: 15,
    hp: 6,
    attackMod: 2,
    damage: "2d8+4",
    damageType: "ballistic",
    thresholds: { major: 10, severe: 20 },
    evasion: 13,
    fearCost: 2,
    signature: "Commands raiders, expert in boarding actions",
    description: "Pirate Captains are survivors — the ones cunning and brutal enough to hold a crew together through fear and shared profit. They lead from the front during boarding actions and always have an escape plan.",
    stressInflict: 1,
    features: [
      { name: "Rally the Crew", type: "Action", description: "All Pirate allies within Close range heal 1 HP and may immediately move up to Very Close range." },
      { name: "Dirty Fighting", type: "Passive", description: "The Captain's attacks ignore 1 point of Armor Score." },
      { name: "Escape Plan", type: "Reaction", description: "When the Captain is reduced to half HP or below, they may immediately move to Far range without provoking opportunity attacks. Usable once per encounter." },
    ],
    fearMoves: [
      { name: "All Hands!", fearCost: 2, description: "1d4+1 Void Pirate Raiders burst through a nearby airlock, hatch, or vent. They act on the Captain's initiative." },
    ],
  },
];

// ─── Rogue Technoseers ───────────────────────────────────────────────────────

const ROGUE_TECHNOSEERS: Adversary[] = [
  {
    name: "Rogue Technoseer",
    faction: "Rogue Technoseers",
    tier: 2,
    type: "Support",
    difficulty: 14,
    hp: 5,
    attackMod: 2,
    damage: "2d6+3",
    damageType: "energy",
    thresholds: { major: 10, severe: 20 },
    evasion: 12,
    fearCost: 2,
    signature: "Tech saboteur with drone control",
    description: "Rogue Technoseers are engineers and scientists who have gone off-grid — either exiled for forbidden research or voluntarily abandoning civilized space to pursue dangerous experiments. They fight with jury-rigged drones and improvised tech weapons.",
    stressInflict: 1,
    features: [
      { name: "Deploy Drone", type: "Action", description: "The Technoseer deploys a combat drone at a point within Close range. The drone has 3 HP, Difficulty 12, and attacks for 1d6+2 energy damage on the Technoseer's turn. The Technoseer can have up to 2 drones active." },
      { name: "System Hack", type: "Action", description: "The Technoseer targets one piece of technology within Close range (a weapon, armor system, drone, or ship system). The target must succeed on a Difficulty 14 Knowledge roll or the technology malfunctions for 1 round (weapons jam, armor deactivates, drones turn hostile)." },
      { name: "Jury-Rig", type: "Action", description: "The Technoseer repairs a damaged ally or drone within Very Close range, restoring 2 HP." },
    ],
    fearMoves: [
      { name: "Overload", fearCost: 2, description: "The Technoseer overloads all electronic devices within Close range. All creatures wearing powered armor or using energy weapons take 2d8 energy damage and their equipment is disabled for 1 round." },
    ],
  },
];

// ─── Creatures ───────────────────────────────────────────────────────────────

const CREATURES: Adversary[] = [
  {
    name: "Void Leech",
    faction: "Creatures",
    tier: 1,
    type: "Minion",
    difficulty: 10,
    hp: 2,
    attackMod: 1,
    damage: "1d4+1",
    damageType: "void",
    thresholds: { major: 7, severe: 12 },
    evasion: 9,
    fearCost: 1,
    signature: "Parasitic creature that attaches and drains HP",
    description: "Void Leeches are small, translucent parasites that drift through the void between stars. They are drawn to energy sources — including living creatures — and attach themselves to drain life force.",
    stressInflict: 1,
    features: [
      { name: "Attach", type: "Action", description: "The Void Leech latches onto a target within Melee range. While attached, the target takes 1d4+1 void damage at the start of each of their turns and marks 1 Stress. The Leech can be removed with a Difficulty 10 Strength roll as an action." },
      { name: "Tiny", type: "Passive", description: "The Void Leech is very small. Attacks against it have Disadvantage unless the attacker is within Melee range." },
    ],
    fearMoves: [],
  },
  {
    name: "Nebula Stalker",
    faction: "Creatures",
    tier: 2,
    type: "Skulk",
    difficulty: 14,
    hp: 5,
    attackMod: 2,
    damage: "2d8+3",
    damageType: "kinetic",
    thresholds: { major: 10, severe: 20 },
    evasion: 14,
    fearCost: 2,
    signature: "Ambush predator with natural camouflage",
    description: "Nebula Stalkers are apex predators native to the gas clouds and asteroid fields of the frontier. They are silicon-based lifeforms with natural camouflage that makes them nearly invisible against rocky or metallic surfaces.",
    stressInflict: 1,
    features: [
      { name: "Natural Camouflage", type: "Passive", description: "The Nebula Stalker is Hidden while motionless in rocky, metallic, or debris-filled environments. Detecting it requires a Difficulty 14 Instinct roll." },
      { name: "Pounce", type: "Action", description: "The Stalker leaps up to Close range and makes a melee attack. If the attack hits and the Stalker was Hidden, the target is knocked prone and the Stalker deals an additional 1d8 damage." },
      { name: "Acid Spit", type: "Action", description: "The Stalker spits a glob of corrosive acid at a target within Close range. The target takes 2d6 acid damage and their Armor Score is reduced by 1 until repaired." },
    ],
    fearMoves: [
      { name: "Ambush Pack", fearCost: 2, description: "1d4 additional Nebula Stalkers emerge from hiding. They were always there — the PCs just didn't see them." },
    ],
  },
];

// ─── Ship-Scale Adversaries ──────────────────────────────────────────────────

const SHIPS: Adversary[] = [
  {
    name: "Eclipse Fighter Wing",
    faction: "Eclipse (Ship)",
    tier: 2,
    type: "Standard (Ship)",
    difficulty: 14,
    hp: 4,
    attackMod: 2,
    damage: "2d10+4",
    damageType: "void",
    thresholds: { major: 10, severe: 20 },
    evasion: 14,
    fearCost: 2,
    signature: "Swarm tactics, kamikaze runs",
    description: "Eclipse Fighter Wings are swarms of small, fast void-craft that attack in coordinated waves. They are piloted — if that is the right word — by Eclipse-corrupted beings who have no fear of death.",
    stressInflict: 1,
    features: [
      { name: "Swarm Tactics", type: "Passive", description: "For each additional Eclipse Fighter Wing in the encounter, all Eclipse Fighter Wings gain +1 to attack rolls (maximum +3)." },
      { name: "Kamikaze Run", type: "Action", description: "The Fighter Wing rams a target ship. Both the Fighter Wing and the target take 3d10 damage. The Fighter Wing is destroyed. The target ship's crew must each succeed on a Difficulty 14 Agility roll or take 1d6 kinetic damage from the impact." },
      { name: "Void Strafe", type: "Action", description: "The Fighter Wing strafes a target ship, dealing 2d10+4 void damage to the hull." },
    ],
    fearMoves: [],
  },
  {
    name: "Eclipse Capital Ship",
    faction: "Eclipse (Ship)",
    tier: 4,
    type: "Boss (Ship)",
    difficulty: 18,
    hp: 12,
    attackMod: 4,
    damage: "4d12+15",
    damageType: "void",
    thresholds: { major: 25, severe: 45 },
    evasion: 12,
    fearCost: 8,
    signature: "Regenerating hull, gravity tether, void cannons",
    description: "Eclipse Capital Ships are massive vessels of alien design — grown rather than built, with hulls of living void-matter that regenerate damage. They serve as mobile bases for Eclipse incursions, disgorging Fighter Wings and Void-Spawn.",
    stressInflict: 2,
    features: [
      { name: "Regenerating Hull", type: "Passive", description: "The Capital Ship heals 2 HP at the start of each of its turns. This regeneration can be suppressed for 1 round by targeting the ship's void core (requires a Difficulty 18 Knowledge roll to identify, then a called shot at Disadvantage)." },
      { name: "Void Cannon", type: "Action", description: "The Capital Ship fires its main weapon at a target within Very Far range. The target takes 4d12+15 void damage. All crew aboard the target ship mark 1 Stress." },
      { name: "Launch Fighters", type: "Action", description: "The Capital Ship launches 1d4 Eclipse Fighter Wings. They act on the Capital Ship's next turn." },
    ],
    fearMoves: [
      { name: "Gravity Tether", fearCost: 3, description: "The Capital Ship activates a gravity tether on a target ship within Far range. The target ship cannot move and is pulled one range band closer at the start of each of the Capital Ship's turns. Breaking free requires a Difficulty 18 Strength roll from the pilot and costs the ship 1 HP from engine strain." },
      { name: "Void Storm", fearCost: 4, description: "The Capital Ship unleashes a storm of void energy in all directions. All ships within Close range take 4d10 void damage and all crew aboard mark 2 Stress. Eclipse ships are immune." },
    ],
  },
];

// ─── Combined Database ───────────────────────────────────────────────────────

export const ADVERSARY_DB: Adversary[] = [
  ...KAELEN_SYNDICATE,
  ...AURELIAN_EMPIRE,
  ...MINDCLAVE,
  ...VALARI_COLLECTIVE,
  ...TERRAN_COALITION,
  ...ECLIPSE,
  ...STATION,
  ...NAMED_VILLAINS,
  ...PROGENITOR,
  ...PIRATES,
  ...ROGUE_TECHNOSEERS,
  ...CREATURES,
  ...SHIPS,
];

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getAdversariesByFaction(faction: string): Adversary[] {
  return ADVERSARY_DB.filter(a => a.faction === faction);
}

export function getAdversariesByTier(tier: number): Adversary[] {
  return ADVERSARY_DB.filter(a => a.tier === tier);
}

export function getAdversaryByName(name: string): Adversary | undefined {
  return ADVERSARY_DB.find(a => a.name === name);
}

export const ALL_FACTIONS = Array.from(new Set(ADVERSARY_DB.map(a => a.faction))).sort();
