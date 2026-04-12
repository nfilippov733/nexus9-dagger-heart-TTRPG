// Nexus 9: The Fraying Dark — Character Builder Data
// All game data extracted from the manuscript for the interactive character builder

export interface Ancestry {
  name: string;
  description: string;
  featureName: string;
  featureEffect: string;
}

export interface Community {
  name: string;
  description: string;
  experience: string;
  experienceBonus: number;
  featureName: string;
  featureEffect: string;
}

export interface Subclass {
  name: string;
  description: string;
  foundation: { name: string; effect: string };
  specialization: { name: string; effect: string };
  mastery: { name: string; effect: string };
}

export interface DomainCard {
  level: number;
  name: string;
  effect: string;
}

export interface GameClass {
  name: string;
  role: string;
  description: string;
  domains: [string, string];
  hp: number;
  evasion: number;
  hopeFeatureName: string;
  hopeFeatureEffect: string;
  classFeatureName: string;
  classFeatureEffect: string;
  subclasses: [Subclass, Subclass];
  starshipRole: string;
  diplomacyRole: string;
  recommendedTraits: string[];
  starterGear: string;
}

export interface Armor {
  name: string;
  type: string;
  minor: number;
  major: number;
  severe: number;
  armorScore: number;
  evasionMod: number;
  agilityMod: number;
}

export interface Weapon {
  name: string;
  type: string;
  trait: string;
  damage: string;
  range: string;
  feature: string;
}

export interface Experience {
  name: string;
  examples: string;
}

export const ANCESTRIES: Ancestry[] = [
  {
    name: "Terran",
    description: "Humans from the Coalition core worlds. Adaptable, ambitious, and widespread.",
    featureName: "Tenacity",
    featureEffect: "Once per Long Rest, when you fail an action roll, you may immediately reroll it and take the new result."
  },
  {
    name: "Aurelian",
    description: "Tall, long-lived humanoids with gilded skin and a culture of imperial grandeur.",
    featureName: "Imperial Bearing",
    featureEffect: "You gain Advantage on Presence rolls when interacting with anyone who recognizes your noble heritage."
  },
  {
    name: "Kaelen",
    description: "Stocky, resilient humanoids with mottled grey-green skin, adapted to harsh frontier worlds.",
    featureName: "Born Survivor",
    featureEffect: "You gain Advantage on Instinct rolls to resist environmental hazards (extreme cold, radiation, low oxygen)."
  },
  {
    name: "Valari",
    description: "Slender, crystalline-boned humanoids with luminous eyes and a deep spiritual tradition.",
    featureName: "Crystal Resonance",
    featureEffect: "You can sense the presence of Progenitor technology or Eclipse corruption within Close range without a roll."
  },
  {
    name: "Mindclave-Born",
    description: "Terrans or Aurelians born with latent telepathic potential, identified and raised within the Mindclave.",
    featureName: "Psychic Sensitivity",
    featureEffect: "You can read the surface emotions (not thoughts) of any creature within Very Close range as a Free Action."
  },
  {
    name: "Frontier-Born",
    description: "Mixed-heritage individuals from the unaligned border worlds — scrappy, resourceful, and self-reliant.",
    featureName: "Resourceful",
    featureEffect: "Once per Short Rest, you may produce a common, non-weapon item worth 50 Credits or less that you \"happened to have.\""
  },
  {
    name: "Synthetic",
    description: "Artificial beings — androids, uploaded consciousnesses, or bio-mechanical constructs.",
    featureName: "Machine Logic",
    featureEffect: "You are immune to telepathic intrusion and the Disoriented condition. You do not need to eat, drink, or breathe, but you require maintenance during Long Rests."
  }
];

export const COMMUNITIES: Community[] = [
  {
    name: "Core Worlder",
    description: "Raised on a wealthy, well-connected inner world.",
    experience: "Bureaucracy",
    experienceBonus: 2,
    featureName: "Connections",
    featureEffect: "You know the name and location of one mid-ranking official in any major faction."
  },
  {
    name: "Station Rat",
    description: "Grew up on Nexus 9 or a similar orbital habitat.",
    experience: "Street Smarts",
    experienceBonus: 2,
    featureName: "Station Knowledge",
    featureEffect: "You always know the fastest route between any two points on a station, and you can identify safe houses and bolt-holes without a roll."
  },
  {
    name: "Frontier Settler",
    description: "Raised on a remote colony world with little infrastructure.",
    experience: "Survival",
    experienceBonus: 2,
    featureName: "Self-Reliant",
    featureEffect: "During a Short Rest, you can repair one piece of damaged equipment without tools or an Engineer."
  },
  {
    name: "Military Brat",
    description: "Grew up on Coalition military bases and warships.",
    experience: "Tactics",
    experienceBonus: 2,
    featureName: "Drilled",
    featureEffect: "In the first round of any combat, you act before any adversary, regardless of the spotlight order."
  },
  {
    name: "Underbelly Dweller",
    description: "Raised in the criminal underworld of a major station.",
    experience: "Deception",
    experienceBonus: 2,
    featureName: "Underworld Contacts",
    featureEffect: "Once per session, you can locate a black-market dealer, fence, or informant in your current location without a roll."
  },
  {
    name: "Temple Raised",
    description: "Raised in a Valari monastery or Aurelian religious order.",
    experience: "Theology",
    experienceBonus: 2,
    featureName: "Inner Peace",
    featureEffect: "Once per Long Rest, you may clear 2 Stress without spending Hope or taking a rest action."
  },
  {
    name: "Exile",
    description: "You were cast out from your original community — a political dissident, a criminal, or a refugee.",
    experience: "Persuasion",
    experienceBonus: 2,
    featureName: "Nothing Left to Lose",
    featureEffect: "When you are at 3 or fewer HP, you gain +1 to all action rolls."
  },
  {
    name: "Technoseer Apprentice",
    description: "Trained (briefly) by the Technoseers before leaving or being expelled.",
    experience: "Engineering",
    experienceBonus: 2,
    featureName: "Progenitor Intuition",
    featureEffect: "You gain Advantage on Knowledge rolls to identify, activate, or repair Progenitor technology."
  }
];

export const TRAITS = ["Agility", "Strength", "Finesse", "Instinct", "Presence", "Knowledge"] as const;
export type TraitName = typeof TRAITS[number];

export const TRAIT_DESCRIPTIONS: Record<TraitName, string> = {
  Agility: "Speed, reflexes, ranged accuracy, dodging",
  Strength: "Raw physical power, melee force, endurance",
  Finesse: "Precision, sleight of hand, stealth, lockpicking",
  Instinct: "Awareness, gut feelings, survival, tracking",
  Presence: "Charisma, intimidation, leadership, deception",
  Knowledge: "Education, technology, medicine, history"
};

export const STANDARD_ARRAY = [2, 1, 1, 0, 0, -1];

export const EXPERIENCES: Experience[] = [
  { name: "Bureaucracy", examples: "Navigating legal systems, filing permits, exploiting regulations" },
  { name: "Deception", examples: "Lying convincingly, forging documents, maintaining a cover identity" },
  { name: "Engineering", examples: "Repairing machines, understanding schematics, jury-rigging solutions" },
  { name: "Intimidation", examples: "Threatening, interrogating, projecting authority" },
  { name: "Investigation", examples: "Searching crime scenes, analyzing evidence, connecting clues" },
  { name: "Medicine", examples: "Treating wounds, diagnosing illness, performing surgery" },
  { name: "Negotiation", examples: "Brokering deals, mediating disputes, haggling prices" },
  { name: "Persuasion", examples: "Convincing, charming, inspiring, rallying" },
  { name: "Piloting", examples: "Flying ships, driving vehicles, navigating hazardous terrain" },
  { name: "Street Smarts", examples: "Knowing the underworld, finding black markets, reading a crowd" },
  { name: "Survival", examples: "Tracking, foraging, enduring harsh environments" },
  { name: "Tactics", examples: "Reading a battlefield, planning ambushes, coordinating teams" },
  { name: "Technology", examples: "Hacking terminals, operating sensors, understanding alien tech" },
  { name: "Theology", examples: "Understanding religious customs, interpreting prophecy, recognizing rituals" }
];

export const CLASSES: GameClass[] = [
  {
    name: "Envoy",
    role: "Face / Social Specialist",
    description: "The Envoy is a master of diplomacy, espionage, and manipulation. They are the face of the crew, navigating the treacherous political waters of Nexus 9.",
    domains: ["Codex", "Grace"],
    hp: 5,
    evasion: 10,
    hopeFeatureName: "Silver Tongue",
    hopeFeatureEffect: "Spend 1 Hope to gain Advantage on any Presence roll during a negotiation.",
    classFeatureName: "Web of Contacts",
    classFeatureEffect: "Once per session, you can declare that you know an NPC in your current location who owes you a favor.",
    subclasses: [
      {
        name: "Ambassador",
        description: "Focuses on de-escalation and building alliances.",
        foundation: { name: "Silver Tongue", effect: "You gain Advantage on all Presence rolls made to negotiate, de-escalate conflict, or forge alliances." },
        specialization: { name: "Diplomatic Weight", effect: "When you or an ally within Close range fails a social roll, you can mark 1 Stress to reroll the dice." },
        mastery: { name: "Galactic Treaty", effect: "Once per Long Rest, you can spend 4 Hope to force two warring factions or hostile groups in your presence to immediately cease hostilities and agree to a temporary truce." }
      },
      {
        name: "Provocateur",
        description: "Focuses on deception, disguise, and extracting secrets.",
        foundation: { name: "Sow Discord", effect: "You can spend 1 Hope to plant a rumor or lie that will be believed by the general public within a specific sector or station." },
        specialization: { name: "Incite Rebellion", effect: "You can mark 2 Stress to turn a crowd of civilians or low-level guards against their superiors for the duration of the scene." },
        mastery: { name: "Character Assassination", effect: "You can spend 3 Hope to completely destroy the reputation of a named NPC, stripping them of their rank, resources, and allies within their faction." }
      }
    ],
    starshipRole: "Communications Officer (Jamming, Intercepting Transmissions)",
    diplomacyRole: "Primary negotiator; reading motives and uncovering political leverage.",
    recommendedTraits: ["Presence", "Knowledge"],
    starterGear: "Diplomatic credentials (forged or real), formal attire, encrypted datapad"
  },
  {
    name: "Operative",
    role: "Striker / Infiltrator",
    description: "The Operative is a specialist in stealth, sabotage, and targeted elimination. They operate in the shadows, dealing with problems before they become public.",
    domains: ["Midnight", "Grace"],
    hp: 6,
    evasion: 12,
    hopeFeatureName: "Vanish",
    hopeFeatureEffect: "Spend 1 Hope to immediately enter stealth, even if you are being observed.",
    classFeatureName: "Sneak Attack",
    classFeatureEffect: "If you attack an enemy who is unaware of your presence, you deal an additional 1d8 damage.",
    subclasses: [
      {
        name: "Ghost",
        description: "Focuses on absolute stealth and bypassing security systems.",
        foundation: { name: "Active Camouflage", effect: "When you are in dim light or darkness, you can spend 1 Hope to become completely invisible until you attack or take damage." },
        specialization: { name: "Silent Takedown", effect: "When you attack an unaware target from Melee range, you deal an additional 2d6 damage." },
        mastery: { name: "Shadow Walk", effect: "You can teleport between areas of shadow or darkness up to Far range as a Free Action once per turn." }
      },
      {
        name: "Saboteur",
        description: "Focuses on explosives, traps, and disabling enemy technology.",
        foundation: { name: "Data Spike", effect: "You gain Advantage on all Finesse rolls to hack terminals, bypass security doors, or disable alarms." },
        specialization: { name: "Rigged to Blow", effect: "You can turn any small electronic device into an explosive. It deals 3d6 energy damage to anyone within Very Close range when triggered." },
        mastery: { name: "Systemic Collapse", effect: "Once per Long Rest, you can spend 4 Hope to completely disable the security grid, lighting, and automated defenses of an entire facility or ship for the duration of the scene." }
      }
    ],
    starshipRole: "Electronic Warfare (Hacking enemy systems, spoofing sensors)",
    diplomacyRole: "Breaking and entering; acquiring physical evidence; intimidation.",
    recommendedTraits: ["Finesse", "Agility"],
    starterGear: "Lockpick set, holo-disguise emitter (1 use), smoke grenade (x2)"
  },
  {
    name: "Pilot",
    role: "Skirmisher / Vehicle Specialist",
    description: "The Pilot is an ace flyer and navigator, most comfortable behind the stick of a starship or a support vehicle.",
    domains: ["Bone", "Sage"],
    hp: 6,
    evasion: 12,
    hopeFeatureName: "Evasive Action",
    hopeFeatureEffect: "Spend 1 Hope to force an enemy to reroll a successful attack against you or your vehicle.",
    classFeatureName: "Ace in the Hole",
    classFeatureEffect: "You gain Advantage on all Agility rolls related to piloting or driving.",
    subclasses: [
      {
        name: "Ace",
        description: "Focuses on dogfighting and pushing vehicles beyond their limits.",
        foundation: { name: "Evasive Maneuvers", effect: "When you are piloting a vehicle or ship, its Evasion increases by +2." },
        specialization: { name: "Target Lock", effect: "When you attack with a vehicle weapon, you can mark 1 Stress to gain Advantage on the roll." },
        mastery: { name: "The Needle Threader", effect: "You can navigate your ship or vehicle through impossible hazards (asteroid fields, closing blast doors) without needing to make a roll." }
      },
      {
        name: "Frontier Scout",
        description: "Focuses on exploration and surviving hostile environments.",
        foundation: { name: "Survivalist", effect: "You gain Advantage on all Instinct rolls to track targets, find safe paths, or survive in hostile environments." },
        specialization: { name: "Ambush Predator", effect: "In the first round of combat, your movement speed is doubled, and your first attack deals an additional 1d8 damage." },
        mastery: { name: "Unseen Observer", effect: "You can spend 2 Hope to perfectly blend into any natural or urban environment, becoming undetectable by sight, sound, or thermal sensors as long as you remain motionless." }
      }
    ],
    starshipRole: "Helm (Evasive Maneuvers, Pursuit)",
    diplomacyRole: "Extraction planning; analyzing flight logs and navigation data.",
    recommendedTraits: ["Agility", "Instinct"],
    starterGear: "Flight helmet with HUD, emergency beacon, star chart datapad"
  },
  {
    name: "Marine",
    role: "Frontline Combatant",
    description: "The Marine is a shock trooper, trained for zero-G boarding actions and heavy firefights. They are the crew's primary physical deterrent.",
    domains: ["Blade", "Bone"],
    hp: 6,
    evasion: 11,
    hopeFeatureName: "Adrenaline Surge",
    hopeFeatureEffect: "Spend 1 Hope to immediately clear 2 Stress or heal 1d4 HP.",
    classFeatureName: "Combat Veteran",
    classFeatureEffect: "You ignore the \"Pinned Down\" condition from suppressive fire.",
    subclasses: [
      {
        name: "Shock Trooper",
        description: "Focuses on close-quarters combat and breaching tactics.",
        foundation: { name: "Breach & Clear", effect: "When you move into Melee range of an enemy, your first attack against them deals an additional 1d6 kinetic damage." },
        specialization: { name: "Unstoppable Momentum", effect: "When you reduce an enemy to 0 HP, you can immediately move up to Close range without triggering reactions." },
        mastery: { name: "Juggernaut", effect: "Once per Long Rest, you can spend 3 Hope to ignore all damage from a single attack, regardless of its severity." }
      },
      {
        name: "Heavy Gunner",
        description: "Focuses on suppressive fire and area-of-effect weapons.",
        foundation: { name: "Suppressive Fire", effect: "When you attack with a two-handed ranged weapon, you can mark 1 Stress to force the target and all enemies within Very Close range of them to roll their next attack with Disadvantage." },
        specialization: { name: "Overcharge", effect: "When you roll maximum damage on any damage die with a ranged weapon, you can reroll that die and add the new result to the total." },
        mastery: { name: "Walking Artillery", effect: "You can wield two-handed heavy weapons with one hand, allowing you to carry a shield or a secondary weapon without penalty." }
      }
    ],
    starshipRole: "Tactical Officer (Firing weapons, Target Lock)",
    diplomacyRole: "Physical intimidation; analyzing combat scenes and ballistics.",
    recommendedTraits: ["Strength", "Agility"],
    starterGear: "Extra ammo pack, combat stim (x1, clears 2 Stress), breaching charge"
  },
  {
    name: "Engineer",
    role: "Protector / Support Tank",
    description: "The Engineer is a technical savant, capable of keeping a crippled ship flying or turning scavenged parts into a deadly weapon.",
    domains: ["Valor", "Blade"],
    hp: 7,
    evasion: 9,
    hopeFeatureName: "Jury-Rig",
    hopeFeatureEffect: "Spend 1 Hope to temporarily repair a broken piece of equipment or bypass a locked door.",
    classFeatureName: "Shield-Bearer",
    classFeatureEffect: "You can use your action to grant an ally in cover an additional +2 to their Evasion.",
    subclasses: [
      {
        name: "Void Warden",
        description: "Focuses on personal armor and protecting allies.",
        foundation: { name: "Defensive Grid", effect: "You can project a localized energy shield. Allies within Melee range of you gain +1 to their Armor Score." },
        specialization: { name: "Reactive Shielding", effect: "When an ally within Close range takes damage, you can mark 1 Stress to reduce that damage by your Armor Score." },
        mastery: { name: "Aegis Protocol", effect: "Once per Long Rest, you can spend 4 Hope to make yourself and all allies within Close range immune to all damage for 1 round." }
      },
      {
        name: "Combat Technician",
        description: "Focuses on hacking, drones, and modifying weapons.",
        foundation: { name: "Jury-Rig", effect: "During a Short Rest, you can repair one broken piece of equipment or restore 1 Armor Slot to an ally for free." },
        specialization: { name: "Drone Swarm", effect: "You deploy a permanent companion drone. It can take the Help action once per round without consuming your action economy." },
        mastery: { name: "System Overload", effect: "You can spend 2 Hope to force any technological device, weapon, or vehicle within Far range to immediately shut down or malfunction for 1d4 rounds." }
      }
    ],
    starshipRole: "Chief Engineer (Rerouting power, Emergency Repairs)",
    diplomacyRole: "Analyzing technology; recovering corrupted data; bypassing security.",
    recommendedTraits: ["Knowledge", "Strength"],
    starterGear: "Portable toolkit, welding torch, diagnostic scanner"
  },
  {
    name: "Mystic",
    role: "Ranged Damage / Telepathy",
    description: "The Mystic is a telepath or a spiritual adept, capable of manipulating the minds of others or sensing the metaphysical currents of the universe.",
    domains: ["Arcana", "Midnight"],
    hp: 6,
    evasion: 10,
    hopeFeatureName: "Mind Trick",
    hopeFeatureEffect: "Spend 1 Hope to plant a brief, harmless suggestion in an NPC's mind.",
    classFeatureName: "Psychic Resonance",
    classFeatureEffect: "You can communicate telepathically with any willing ally within line of sight.",
    subclasses: [
      {
        name: "Telepath",
        description: "Focuses on precognition, sensing danger, and reading emotional residue.",
        foundation: { name: "Mind Reading", effect: "You can spend 1 Hope to read the surface thoughts of a target within Close range for one minute." },
        specialization: { name: "Psychic Assault", effect: "When you deal energy damage with a Domain Card, you can mark 1 Stress to change the damage type to psychic and force the target to mark 1 Stress." },
        mastery: { name: "Mind Control", effect: "Once per Long Rest, you can spend 5 Hope to take complete control of an NPC's actions for the duration of the scene." }
      },
      {
        name: "Technomancer",
        description: "Focuses on telekinetic force and interfacing with machines.",
        foundation: { name: "Machine Whisperer", effect: "You can interface with computers and droids using your mind, requiring no physical connection or terminal." },
        specialization: { name: "Construct Override", effect: "You can spend 2 Hope to take control of an enemy drone, turret, or synthetic for 1d4 rounds." },
        mastery: { name: "Ghost in the Machine", effect: "You can permanently transfer your consciousness into a ship's mainframe or a secure network, allowing you to operate its systems as if they were your own body." }
      }
    ],
    starshipRole: "Sensor Operator (Sensor Sweeps, detecting cloaked ships)",
    diplomacyRole: "Reading surface thoughts; detecting lies; sensing emotional imprints.",
    recommendedTraits: ["Knowledge", "Instinct"],
    starterGear: "Meditation focus crystal, psi-dampener (blocks telepathic detection for 1 hour), journal"
  },
  {
    name: "Broker",
    role: "Utility / Controller",
    description: "The Broker is a fixer, a smuggler, and a master of logistics. They know how to acquire rare goods and move them without attracting attention.",
    domains: ["Sage", "Arcana"],
    hp: 6,
    evasion: 10,
    hopeFeatureName: "Hidden Cache",
    hopeFeatureEffect: "Spend 1 Hope to produce a common item that you \"happened\" to have on you.",
    classFeatureName: "Black Market Ties",
    classFeatureEffect: "You can always find a buyer or a seller for illegal goods, regardless of your location.",
    subclasses: [
      {
        name: "Smuggler",
        description: "Focuses on hiding contraband and bypassing customs inspections.",
        foundation: { name: "Hidden Compartments", effect: "You can conceal up to 3 small items on your person or in your ship that cannot be found by standard security scans or physical searches." },
        specialization: { name: "The Right Price", effect: "You can spend 1 Hope to automatically succeed on a Persuasion roll to bribe a guard, official, or informant." },
        mastery: { name: "Untraceable", effect: "Your ship and your personal comms cannot be tracked, intercepted, or recorded by any faction, regardless of their technological superiority." }
      },
      {
        name: "Information Broker",
        description: "Focuses on acquiring information, forging documents, and bribery.",
        foundation: { name: "A Guy Who Knows A Guy", effect: "Once per session, you can declare that you have a contact in your current location who owes you a favor." },
        specialization: { name: "Blackmail", effect: "When you interact with a named NPC, you can mark 2 Stress to reveal a piece of damaging information you hold over them, forcing them to comply with a reasonable request." },
        mastery: { name: "The Spider's Web", effect: "You can spend 3 Hope to instantly know the location, current status, and immediate plans of any single individual in the galaxy, provided you have met them before." }
      }
    ],
    starshipRole: "Quartermaster (Managing cargo, optimizing fuel consumption)",
    diplomacyRole: "Following the money; identifying black-market origins; bribery.",
    recommendedTraits: ["Presence", "Finesse"],
    starterGear: "Concealed credit chip (500 Credits hidden), forged transit papers, encrypted commlink"
  },
  {
    name: "Medic",
    role: "Healer / Support",
    description: "The Medic is a trauma surgeon and xenobiologist, essential for keeping the crew alive in a hostile galaxy.",
    domains: ["Splendor", "Valor"],
    hp: 7,
    evasion: 9,
    hopeFeatureName: "Combat Triage",
    hopeFeatureEffect: "Spend 1 Hope to heal an ally for 1d8 HP as a free action.",
    classFeatureName: "Xenobiology",
    classFeatureEffect: "You gain Advantage on rolls to identify alien toxins, diseases, or biological weaknesses.",
    subclasses: [
      {
        name: "Combat Surgeon",
        description: "Focuses on rapid healing and stabilizing critically injured allies.",
        foundation: { name: "Triage", effect: "When you heal an ally who is at 0 HP, they clear an additional 1d6 HP." },
        specialization: { name: "Stim-Pack", effect: "When you heal an ally, you can mark 1 Stress to also grant them Advantage on their next action roll." },
        mastery: { name: "Miracle Worker", effect: "Once per Long Rest, you can spend 5 Hope to completely restore an ally to full HP and clear all their Stress, even if they have just died (within the last minute)." }
      },
      {
        name: "Xenobiologist",
        description: "Focuses on analyzing alien lifeforms and synthesizing antidotes.",
        foundation: { name: "Anatomical Insight", effect: "You gain Advantage on all Knowledge rolls related to alien biology, toxins, and diseases." },
        specialization: { name: "Targeted Strike", effect: "When you attack an organic enemy, you can mark 1 Stress to ignore their Armor Score by striking a vital nerve cluster or organ." },
        mastery: { name: "Bio-Manipulation", effect: "You can spend 3 Hope to alter the biology of a willing ally for the scene, granting them immunity to a specific damage type (e.g., acid, radiation, poison)." }
      }
    ],
    starshipRole: "Chief Medical Officer (Treating injuries during combat, managing life support)",
    diplomacyRole: "Autopsies; identifying toxins; analyzing biological evidence.",
    recommendedTraits: ["Knowledge", "Presence"],
    starterGear: "Advanced med-kit (heals 1d6+2 HP, 3 uses), surgical tools, bioscanner"
  }
];

export const ARMOR_OPTIONS: Armor[] = [
  { name: "Flight Suit", type: "Light", minor: 5, major: 11, severe: 20, armorScore: 3, evasionMod: 1, agilityMod: 0 },
  { name: "Light Combat Rig", type: "Medium", minor: 6, major: 13, severe: 23, armorScore: 3, evasionMod: 0, agilityMod: 0 },
  { name: "Marine Hardsuit", type: "Heavy", minor: 7, major: 15, severe: 26, armorScore: 4, evasionMod: -1, agilityMod: 0 },
  { name: "Assault Exoskeleton", type: "Powered", minor: 8, major: 17, severe: 29, armorScore: 4, evasionMod: -2, agilityMod: -1 }
];

export const WEAPON_OPTIONS: Weapon[] = [
  { name: "Pulse Pistol", type: "Sidearm", trait: "Agility", damage: "1d6 energy", range: "Close", feature: "Light, reliable" },
  { name: "Kinetic Revolver", type: "Sidearm", trait: "Agility", damage: "1d8 kinetic", range: "Close", feature: "Loud, high stopping power" },
  { name: "Vibro-Blade", type: "Melee", trait: "Strength", damage: "1d8 kinetic", range: "Melee", feature: "Can cut through light armor" },
  { name: "Combat Knife", type: "Melee", trait: "Finesse", damage: "1d6 kinetic", range: "Melee", feature: "Concealable, throwable (Close)" },
  { name: "Assault Carbine", type: "Carbine", trait: "Agility", damage: "1d8 kinetic", range: "Far", feature: "Versatile, standard military issue" },
  { name: "Plasma Caster", type: "Carbine", trait: "Agility", damage: "1d8 energy", range: "Far", feature: "Ignores 1 point of Armor Score" },
  { name: "Shotcaster", type: "Carbine", trait: "Strength", damage: "1d10 kinetic", range: "Close", feature: "Devastating at close range, -2 at Far" },
  { name: "Shock Baton", type: "Melee", trait: "Strength", damage: "1d6 energy", range: "Melee", feature: "On hit, target marks 1 Stress" },
  { name: "Sniper Lens", type: "Rifle", trait: "Agility", damage: "1d10 kinetic", range: "Very Far", feature: "Requires setup (1 action), +2 damage from Hidden" },
  { name: "Stun Gauntlet", type: "Melee", trait: "Finesse", damage: "1d4 energy", range: "Melee", feature: "Non-lethal, target is Disoriented on crit" }
];

export interface DomainCardEntry {
  domain: string;
  domainTheme: string;
  level: number;
  name: string;
  type: string; // Passive, Action, Reaction, Downtime
  cost: string; // e.g. "Spend 1 Hope", "Mark 1 Stress", "—"
  effect: string;
}

export const DOMAIN_CARDS: DomainCardEntry[] = [
  // ─── Arcana Domain (Telepathy & Technomancy) ───
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Rune Ward", type: "Action", cost: "Spend 1 Hope", effect: "You place a psychic or energy ward on an ally within Close range, granting them +2 Armor Score for the scene." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Unleash Chaos", type: "Action", cost: "Mark 1 Stress", effect: "You project a burst of raw telekinetic force. Make an attack against a target within Far range for 1d10 energy damage." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Wall Walk", type: "Action", cost: "Spend 1 Hope", effect: "You manipulate local gravity fields, allowing you to walk on walls and ceilings for the rest of the scene." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 2, name: "Cinder Grasp", type: "Action", cost: "Mark 1 Stress", effect: "You ignite the air around a target within Close range. They take 1d8 energy damage and are Burning." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 2, name: "Floating Eye", type: "Action", cost: "Spend 1 Hope", effect: "You create an invisible, intangible sensor that you can move up to Very Far range and see through." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 3, name: "Counterspell", type: "Reaction", cost: "—", effect: "When an enemy uses a special ability or tech feature, mark 2 Stress to cancel the effect entirely." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 3, name: "Flight", type: "Action", cost: "Spend 2 Hope", effect: "You gain a fly speed equal to your normal movement speed for the rest of the scene." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 4, name: "Blink Out", type: "Reaction", cost: "—", effect: "When you are attacked, spend 2 Hope to instantly teleport up to Close range, causing the attack to miss." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 4, name: "Preservation Blast", type: "Action", cost: "Mark 2 Stress", effect: "You fire a concussive wave. All enemies within Close range take 2d8 kinetic damage and are pushed back to Far range." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 5, name: "Chain Lightning", type: "Action", cost: "Spend 3 Hope", effect: "You unleash an arc of electricity. Target an enemy within Far range (3d8 energy damage), then target a second enemy within Close range of the first (2d8), and a third (1d8)." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 5, name: "Premonition", type: "Passive", cost: "—", effect: "You cannot be surprised, and you always act first in the first round of combat." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 6, name: "Rift Walker", type: "Action", cost: "Mark 3 Stress", effect: "You tear a hole in spacetime, instantly teleporting yourself and all allies within Close range to any location you can see within Very Far range." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 6, name: "Telekinesis", type: "Action", cost: "Spend 2 Hope", effect: "You can move objects or creatures up to the size of a small vehicle with your mind (Difficulty 14 Knowledge roll for unwilling targets)." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 7, name: "Arcana-Touched", type: "Passive", cost: "—", effect: "Your connection to the universe is profound. You gain a permanent +1 to your Knowledge trait, and your maximum Hope increases by 1." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 7, name: "Cloaking Blast", type: "Action", cost: "Mark 3 Stress", effect: "You deal 3d8 energy damage to a target within Far range, and you immediately become Hidden." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 8, name: "Arcane Reflection", type: "Reaction", cost: "—", effect: "When you are targeted by a ranged attack or special ability, spend 3 Hope to reflect the attack back at the sender." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 8, name: "Confusing Aura", type: "Action", cost: "Mark 3 Stress", effect: "You project a field of psychic static. All enemies within Close range have Disadvantage on all rolls for 1d4 rounds." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 9, name: "Earthquake", type: "Action", cost: "Spend 4 Hope", effect: "You manipulate gravity to crush an area. All enemies within Far range take 4d10 kinetic damage and are knocked prone." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 9, name: "Sensory Projection", type: "Action", cost: "Mark 4 Stress", effect: "You project your consciousness across the galaxy, allowing you to see and hear events on another planet or station in real-time." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 10, name: "Adjust Reality", type: "Action", cost: "Spend 5 Hope", effect: "You alter a fundamental law of physics in the current scene (e.g., turning off gravity, making fire freeze, turning lasers into light breezes)." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 10, name: "Falling Sky", type: "Action", cost: "Mark 5 Stress", effect: "You pull a meteor, satellite, or massive debris from orbit, dealing 6d12 kinetic damage to a massive area." },

  // ─── Blade Domain (Close Quarters Combat) ───
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Get Back Up", type: "Reaction", cost: "—", effect: "When you are reduced to 0 HP, spend 1 Hope to immediately clear 1 HP and stand up." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Not Good Enough", type: "Reaction", cost: "—", effect: "When an enemy hits you with a melee attack, mark 1 Stress to reduce the damage by your Armor Score without marking an Armor Slot." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Whirlwind", type: "Action", cost: "Mark 1 Stress", effect: "Make a melee attack against every enemy within Melee range." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 2, name: "A Soldier's Bond", type: "Passive", cost: "—", effect: "When you are adjacent to an ally, you both gain +1 to your Armor Score." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 2, name: "Reckless", type: "Action", cost: "Spend 1 Hope", effect: "You make an attack with Advantage, but all attacks against you have Advantage until your next turn." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 3, name: "Scramble", type: "Action", cost: "Mark 1 Stress", effect: "You immediately move up to Close range and make a melee attack. This movement ignores difficult terrain." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 3, name: "Versatile Fighter", type: "Passive", cost: "—", effect: "You can use two-handed weapons with one hand, allowing you to carry a shield or a secondary weapon." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 4, name: "Deadly Focus", type: "Action", cost: "Spend 2 Hope", effect: "Your next attack ignores the target's Armor Score and deals an additional 1d8 damage." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 4, name: "Fortified Armor", type: "Passive", cost: "—", effect: "When you mark an Armor Slot, you reduce the severity of the incoming damage by two thresholds instead of one." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 5, name: "Champion's Edge", type: "Passive", cost: "—", effect: "You gain a +2 bonus to all damage rolls with melee weapons." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 5, name: "Vitality", type: "Downtime", cost: "Spend 1 Hope", effect: "You clear all your marked Stress." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 6, name: "Battle-Hardened", type: "Passive", cost: "—", effect: "You are immune to the Frightened and Intimidated conditions." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 6, name: "Rage Up", type: "Action", cost: "Mark 2 Stress", effect: "For the rest of the scene, you deal an additional 1d6 damage on all attacks, but you cannot use Hope features." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 7, name: "Blade-Touched", type: "Passive", cost: "—", effect: "You are a master of warfare. You gain a permanent +1 to your Strength trait, and your maximum HP increases by 1." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 7, name: "Glancing Blow", type: "Reaction", cost: "—", effect: "When you take Severe damage, spend 2 Hope to reduce it to Major damage." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 8, name: "Battle Cry", type: "Action", cost: "Mark 3 Stress", effect: "You let out a terrifying roar. All enemies within Far range must make a Difficulty 16 Presence roll or become Frightened." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 8, name: "Frenzy", type: "Action", cost: "Spend 3 Hope", effect: "You make three melee attacks against a single target." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 9, name: "Gore and Glory", type: "Passive", cost: "—", effect: "Whenever you defeat an enemy, you immediately clear 1 Stress or 1 HP." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 9, name: "Reaper's Strike", type: "Action", cost: "Mark 4 Stress", effect: "Make a melee attack. If it hits, it deals an additional 4d10 damage." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 10, name: "Battle Monster", type: "Passive", cost: "—", effect: "Your melee attacks deal double damage to vehicles, structures, and heavy armor." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 10, name: "Onslaught", type: "Action", cost: "Spend 5 Hope", effect: "You enter an unstoppable state. For 1d4 rounds, you cannot be reduced below 1 HP, and all your attacks have Advantage." },

  // ─── Bone Domain (Tactics & Evasion) ───
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "Deft Maneuvers", type: "Passive", cost: "—", effect: "You gain +1 Evasion against ranged attacks." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "I See It Coming", type: "Reaction", cost: "—", effect: "When an enemy attacks you, mark 1 Stress to force them to roll with Disadvantage." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "Untouchable", type: "Action", cost: "Spend 1 Hope", effect: "For the rest of the round, you do not trigger reactions or opportunity attacks when moving through enemy threat zones." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 2, name: "Ferocity", type: "Passive", cost: "—", effect: "When you roll maximum damage on a damage die, you can reroll that die and add the new result to the total." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 2, name: "Strategic Approach", type: "Action", cost: "Mark 1 Stress", effect: "You analyze the battlefield. You and all allies gain +1 to attack rolls against a specific target for the rest of the scene." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 3, name: "Brace", type: "Reaction", cost: "—", effect: "When you take physical damage, spend 1 Hope to reduce the damage by 1d6." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 3, name: "Tactician", type: "Action", cost: "Spend 2 Hope", effect: "You immediately reposition up to three allies, moving them up to Close range without triggering reactions." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 4, name: "Boost", type: "Action", cost: "Mark 1 Stress", effect: "You push your physical limits or your vehicle's engines, doubling your movement speed for the round." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 4, name: "Redirect", type: "Reaction", cost: "—", effect: "When an enemy misses you with a melee attack, spend 1 Hope to force them to attack another target of your choice within their range." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 5, name: "Know Thy Enemy", type: "Action", cost: "Mark 2 Stress", effect: "You identify a critical weakness in an enemy's armor or shielding. The next attack against them ignores their Armor Score." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 5, name: "Signature Move", type: "Action", cost: "Spend 2 Hope", effect: "You perform a complex maneuver. Make an attack roll with Advantage; if it hits, it deals an additional 1d10 damage." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 6, name: "Rapid Riposte", type: "Reaction", cost: "—", effect: "When an enemy misses you with an attack, mark 1 Stress to immediately make a free attack against them." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 6, name: "Recovery", type: "Action", cost: "Spend 3 Hope", effect: "You catch your breath and clear 1d4 Stress and 1d4 HP." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 7, name: "Bone-Touched", type: "Passive", cost: "—", effect: "Your reflexes are superhuman. You gain a permanent +1 to your Agility trait, and your Evasion increases by 1." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 7, name: "Cruel Precision", type: "Passive", cost: "—", effect: "Your attacks score a critical hit on a roll of 11 or 12 on the Hope die (if the total succeeds)." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 8, name: "Breaking Blow", type: "Action", cost: "Mark 3 Stress", effect: "Make a melee attack. If it hits, the target's Armor Score is permanently reduced by 2." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 8, name: "Wrangle", type: "Action", cost: "Spend 3 Hope", effect: "You grapple and completely immobilize a target of your size or smaller. They cannot take actions until they break free (Difficulty 16 Strength)." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 9, name: "On The Brink", type: "Passive", cost: "—", effect: "When you are at 1 HP, you gain Advantage on all attack rolls and Evasion rolls." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 9, name: "Splintering Strike", type: "Action", cost: "Mark 4 Stress", effect: "Make an attack. If it hits, the damage splashes to all enemies within Very Close range of the target." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 10, name: "Deathrun", type: "Action", cost: "Spend 5 Hope", effect: "You move up to Far range, making a free melee attack against every enemy you pass." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 10, name: "Swift Step", type: "Passive", cost: "—", effect: "You can move up to Close range as a Free Action once per turn." },

  // ─── Codex Domain (Law, Lore & Bureaucracy) ───
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Bureaucratic Loophole", type: "Action", cost: "Spend 1 Hope", effect: "You bypass a minor legal, administrative, or security obstacle by citing a obscure regulation." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Diplomatic Immunity", type: "Action", cost: "—", effect: "Declare your official status. Until you take a hostile action, adversaries will not target you first in a combat encounter." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Historical Precedent", type: "Reaction", cost: "—", effect: "When you make a Knowledge roll to recall lore, you can mark 1 Stress to gain Advantage on the roll." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 2, name: "Call in a Favor", type: "Downtime", cost: "Spend 2 Hope", effect: "You acquire a Tier 1 or Tier 2 item for free by leveraging your political connections." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 2, name: "Red Tape", type: "Action", cost: "Mark 1 Stress", effect: "Target one adversary within Close range; they must make a Difficulty 14 Instinct roll or lose their next action due to confusion or hesitation." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 3, name: "Censor's Edict", type: "Action", cost: "Mark 2 Stress", effect: "Target one adversary within Far range. They cannot use any special abilities or features for 1d4 rounds." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 3, name: "Sanctuary Protocol", type: "Action", cost: "Spend 1 Hope", effect: "You designate a Close area as a neutral zone. Any creature that initiates violence within this zone immediately marks 2 Stress." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 4, name: "Filibuster", type: "Reaction", cost: "—", effect: "When an adversary attempts to activate a major ability or call for reinforcements, spend 2 Hope to delay that action by one round." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 4, name: "Subpoena", type: "Action", cost: "Mark 1 Stress", effect: "You force an NPC to answer one question truthfully, compelled by legal or political pressure." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 5, name: "Embargo", type: "Action", cost: "Mark 2 Stress", effect: "You temporarily disable a specific piece of technology or weapon system within Far range for the duration of the scene." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 5, name: "Extradition", type: "Action", cost: "Spend 3 Hope", effect: "You instantly teleport yourself and one willing ally within Close range to your ship or a designated safehouse." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 6, name: "Exile", type: "Action", cost: "Mark 3 Stress", effect: "Target one adversary within Close range. They are banished from the current scene, forced to flee or physically removed by security forces." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 6, name: "Retributive Sanction", type: "Reaction", cost: "—", effect: "When you take damage, spend 1 Hope to deal half that damage (rounded down) back to the attacker as psychic or political backlash." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 7, name: "Codex-Touched", type: "Passive", cost: "—", effect: "Your mastery of galactic law is absolute. You gain a permanent +1 to your Knowledge trait, and your maximum Stress increases by 1." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 7, name: "Total Information Awareness", type: "Action", cost: "Spend 2 Hope", effect: "You gain complete access to the local security grid, sensor network, or data archive for the remainder of the scene." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 8, name: "Executive Override", type: "Action", cost: "Mark 3 Stress", effect: "You completely rewrite the parameters of a local system (e.g., turning automated defenses against their owners, changing life support settings)." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 8, name: "Safe Harbor", type: "Action", cost: "Spend 3 Hope", effect: "You create an impenetrable energy barrier around yourself and your allies within Close range. Nothing can pass through the barrier for 1d4 rounds." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 9, name: "Declassification", type: "Action", cost: "Mark 4 Stress", effect: "You uncover the deepest, most heavily guarded secret of a target NPC or faction, gaining immense leverage over them." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 9, name: "Systemic Collapse", type: "Action", cost: "Spend 4 Hope", effect: "You trigger a cascading failure in the local infrastructure, causing massive environmental damage and chaos." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 10, name: "Galactic Mandate", type: "Action", cost: "Mark 5 Stress", effect: "You issue a command that carries the weight of the major powers. All NPCs in the scene must obey a single, non-suicidal command." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 10, name: "Transcendent Union", type: "Passive", cost: "—", effect: "You are a living symbol of unity. Allies within Far range of you gain +1 to all action rolls." },

  // ─── Grace Domain (Diplomacy & Deception) ───
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Charming Demeanor", type: "Passive", cost: "—", effect: "You gain Advantage on your first Persuasion roll in any new social scene." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Enrapture", type: "Action", cost: "Mark 1 Stress", effect: "Target one NPC within Close range. They are captivated by your presence and will ignore obvious distractions for a few minutes." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Inspirational Words", type: "Action", cost: "Spend 1 Hope", effect: "Target one ally within Far range. They clear 1 Stress and gain +1 to their next action roll." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 2, name: "Tell No Lies", type: "Reaction", cost: "—", effect: "When an NPC speaks to you, spend 1 Hope to know with absolute certainty if they are lying." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 2, name: "Troublemaker", type: "Action", cost: "Mark 1 Stress", effect: "You subtly instigate a conflict between two NPCs, causing them to argue or fight each other." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 3, name: "Hypnotic Shimmer", type: "Action", cost: "Spend 2 Hope", effect: "You activate a personal holofield that makes you incredibly difficult to target. Gain +3 Evasion for the rest of the scene." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 3, name: "Social Chameleon", type: "Action", cost: "Mark 1 Stress", effect: "You perfectly mimic the mannerisms, accent, and etiquette of a specific faction or social class." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 4, name: "Soothing Speech", type: "Action", cost: "Spend 2 Hope", effect: "You de-escalate a tense situation. All hostile NPCs within Far range must make a Difficulty 15 Presence roll or cease hostilities." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 4, name: "Through Your Eyes", type: "Action", cost: "Mark 2 Stress", effect: "You establish a temporary empathic link with a target, seeing what they see and feeling what they feel for a few minutes." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 5, name: "Thought Delver", type: "Action", cost: "Mark 2 Stress", effect: "You ask a target a question; they must answer truthfully, though they may not realize they are doing so." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 5, name: "Words of Discord", type: "Action", cost: "Spend 2 Hope", effect: "You sow doubt and confusion among a group of enemies. They suffer a -2 penalty to all attack rolls for 1d4 rounds." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 6, name: "Never Upstaged", type: "Reaction", cost: "—", effect: "When an ally fails a Presence roll, spend 1 Hope to immediately make the same roll yourself, using your own modifiers." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 6, name: "Share The Burden", type: "Reaction", cost: "—", effect: "When an ally takes Stress, you can choose to take that Stress instead." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 7, name: "Endless Charisma", type: "Passive", cost: "—", effect: "Whenever you roll a critical success on a Presence roll, you immediately gain 2 Hope." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 7, name: "Grace-Touched", type: "Passive", cost: "—", effect: "Your charisma is legendary. You gain a permanent +1 to your Presence trait, and your maximum Hope increases by 1." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 8, name: "Holographic Projection", type: "Action", cost: "Spend 3 Hope", effect: "You create a perfect, interactive holographic duplicate of yourself that can move and speak independently for the scene." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 8, name: "Mass Enrapture", type: "Action", cost: "Mark 3 Stress", effect: "All NPCs within Far range are captivated by you, halting their actions to listen to you speak." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 9, name: "Copycat", type: "Action", cost: "Mark 2 Stress", effect: "You perfectly replicate a Domain card ability you have seen an ally use in the current scene." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 9, name: "Master of The Craft", type: "Passive", cost: "—", effect: "You can no longer critically fail on Presence rolls. A critical failure is treated as a standard failure." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 10, name: "Encore", type: "Action", cost: "Spend 4 Hope", effect: "You immediately take another full turn." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 10, name: "Notorious", type: "Passive", cost: "—", effect: "Your reputation precedes you everywhere. You can demand an audience with any faction leader or high-ranking official, and they cannot refuse." },

  // ─── Midnight Domain (Stealth & Sabotage) ───
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Pick and Pull", type: "Action", cost: "—", effect: "Make a Finesse roll to steal a small item from a target within Melee range without them noticing." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Rain of Blades", type: "Action", cost: "Mark 1 Stress", effect: "Make a ranged attack with a thrown weapon against up to three targets within Close range." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Uncanny Disguise", type: "Action", cost: "Spend 1 Hope", effect: "You quickly alter your appearance using a holo-emitter or physical props, becoming unrecognizable." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 2, name: "Midnight Spirit", type: "Passive", cost: "—", effect: "You gain Advantage on all Agility rolls made to move silently or hide in shadows." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 2, name: "Shadowbind", type: "Action", cost: "Mark 1 Stress", effect: "You pin a target's shadow to the floor (or use a grav-cuff). They are Restrained until they make a Difficulty 14 Strength roll to break free." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 3, name: "Chokehold", type: "Action", cost: "Mark 2 Stress", effect: "Make a Melee attack against an unaware target. On a success, they are Restrained and cannot speak or call for help." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 3, name: "Veil of Night", type: "Action", cost: "Spend 2 Hope", effect: "You deploy a localized darkness field. The area within Close range of you becomes pitch black, blocking all vision except thermal/night vision." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 4, name: "Glyph of Nightfall", type: "Action", cost: "Mark 2 Stress", effect: "You place a trap on a surface. The first enemy to step on it is Blinded for 1d4 rounds." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 4, name: "Stealth Expertise", type: "Passive", cost: "—", effect: "When you are Hidden, your first attack against an unaware target deals an additional 1d8 damage." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 5, name: "Hush", type: "Action", cost: "Spend 2 Hope", effect: "You create a zone of absolute silence within Close range of you. No sound can enter or leave the zone." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 5, name: "Phantom Retreat", type: "Reaction", cost: "—", effect: "When you are attacked, spend 1 Hope to immediately move to Close range and become Hidden, forcing the attack to miss." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 6, name: "Dark Whispers", type: "Action", cost: "Mark 2 Stress", effect: "You project your voice into the minds of enemies within Far range, causing them to mark 1 Stress and become distracted." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 6, name: "Mass Disguise", type: "Action", cost: "Spend 3 Hope", effect: "You project a holo-disguise over yourself and all allies within Close range, making you appear as a squad of enemy guards or civilians." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 7, name: "Midnight-Touched", type: "Passive", cost: "—", effect: "You are one with the shadows. You gain a permanent +1 to your Finesse trait, and your Evasion increases by 1." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 7, name: "Vanishing Dodge", type: "Reaction", cost: "—", effect: "When you take damage, mark 2 Stress to completely negate the damage and teleport to a safe location within Close range." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 8, name: "Shadowhunter", type: "Passive", cost: "—", effect: "You can see perfectly in absolute darkness, and you ignore the Evasion bonuses of enemies in cover." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 8, name: "Spellcharge", type: "Action", cost: "Spend 3 Hope", effect: "Your next attack deals an additional 3d8 energy damage and ignores Armor." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 9, name: "Night Terror", type: "Action", cost: "Mark 3 Stress", effect: "You manifest the worst fears of an enemy within Close range. They must make a Difficulty 18 Instinct roll or flee in terror." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 9, name: "Twilight Toll", type: "Action", cost: "Spend 4 Hope", effect: "You mark a target for death. For the rest of the scene, all attacks against that target by you and your allies have Advantage." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 10, name: "Eclipse", type: "Action", cost: "Mark 5 Stress", effect: "You plunge the entire scene into absolute, impenetrable darkness. Only you and your allies can see." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 10, name: "Specter of The Dark", type: "Passive", cost: "—", effect: "You are permanently Hidden from electronic sensors, cameras, and thermal imaging." },

  // ─── Sage Domain (Survival & Logistics) ───
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "Gifted Tracker", type: "Passive", cost: "—", effect: "You gain Advantage on Instinct rolls to track targets, navigate asteroid fields, or survive in hostile environments." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "Jury-Rigged Snare", type: "Action", cost: "Mark 1 Stress", effect: "You deploy a quick trap. The next enemy to enter Melee range of you is Restrained for 1 round." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "System Diagnostics", type: "Action", cost: "Spend 1 Hope", effect: "You instantly identify the exact mechanical or software issue with a vehicle, ship, or terminal." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 2, name: "Drone Companion", type: "Action", cost: "Mark 1 Stress", effect: "You deploy a small recon drone. It can fly up to Far range and transmit video/audio back to you." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 2, name: "Scavenger's Eye", type: "Downtime", cost: "Spend 1 Hope", effect: "You find 1d4 x 100 Credits worth of salvage, fuel, or spare parts in your current location." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 3, name: "Corrosive Projectile", type: "Action", cost: "Spend 2 Hope", effect: "Your next ranged attack deals acid damage. If it hits, the target takes an additional 1d6 damage at the start of their next turn." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 3, name: "Environmental Adaptation", type: "Passive", cost: "—", effect: "You ignore the negative effects of extreme heat, cold, low gravity, or high radiation." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 4, name: "Death Grip", type: "Action", cost: "Mark 2 Stress", effect: "You lock onto a target with a tractor beam or grapple. They cannot move further away from you until they break the lock." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 4, name: "Healing Field", type: "Action", cost: "Spend 2 Hope", effect: "You deploy a medical beacon. All allies within Close range clear 1 HP at the start of their turn for 1d4 rounds." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 5, name: "Thorn Skin", type: "Action", cost: "Mark 2 Stress", effect: "You activate an electrified defense grid. Any enemy that hits you with a melee attack takes 1d6 energy damage." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 5, name: "Wild Fortress", type: "Action", cost: "Spend 3 Hope", effect: "You rapidly construct a barricade out of local materials or deploy a heavy energy shield, providing full cover to allies within Close range." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 6, name: "Forager", type: "Downtime", cost: "Spend 1 Hope", effect: "You automatically secure enough food, water, and breathable air for your entire crew for one week." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 6, name: "Overdrive", type: "Action", cost: "Mark 2 Stress", effect: "You push a vehicle or weapon past its safety limits. For the rest of the scene, it deals +1d8 damage but takes 1 Stress after every use." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 7, name: "Sage-Touched", type: "Passive", cost: "—", effect: "Your survival instincts are unmatched. You gain a permanent +1 to your Instinct trait, and your maximum HP increases by 1." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 7, name: "Wild Surge", type: "Action", cost: "Mark 3 Stress", effect: "You unleash a burst of raw energy. All enemies within Close range take 3d8 energy damage and are pushed back to Far range." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 8, name: "Rejuvenation Barrier", type: "Action", cost: "Mark 3 Stress", effect: "You create a zone of restorative energy. Allies inside the zone cannot be reduced below 1 HP." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 8, name: "Swarm Drones", type: "Action", cost: "Spend 3 Hope", effect: "You deploy a swarm of micro-drones that harass enemies. All enemies within Far range suffer Disadvantage on attack rolls for 1d4 rounds." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 9, name: "Fane of The Wilds", type: "Action", cost: "Spend 4 Hope", effect: "You completely alter the local environment (e.g., venting atmosphere, disabling gravity, flooding the area with radiation) while protecting your allies from the effects." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 9, name: "System Override", type: "Action", cost: "Mark 4 Stress", effect: "You take complete control of an enemy vehicle, drone, or automated defense system for the rest of the scene." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 10, name: "Force of Nature", type: "Passive", cost: "—", effect: "Your attacks ignore all environmental penalties and cover bonuses." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 10, name: "Tempest", type: "Action", cost: "Mark 5 Stress", effect: "You summon a massive environmental hazard (a localized asteroid strike, a plasma storm, a hull breach) that deals 5d12 damage to everything in the scene except you and your allies." },

  // ─── Splendor Domain (Medicine & Morale) ───
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Bolt Beacon", type: "Action", cost: "Mark 1 Stress", effect: "You fire a flare or tracer round at a target. The next attack against that target has Advantage." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Mending Touch", type: "Action", cost: "Spend 1 Hope", effect: "You stabilize a wounded ally within Melee range, clearing 1d6 HP." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Reassurance", type: "Action", cost: "Spend 1 Hope", effect: "You offer words of comfort or a mild sedative. An ally within Close range clears 1d4 Stress." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 2, name: "Final Words", type: "Reaction", cost: "—", effect: "When an ally is reduced to 0 HP, mark 1 Stress to allow them to immediately take one full action before falling unconscious." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 2, name: "Healing Hands", type: "Passive", cost: "—", effect: "Whenever you heal an ally, they clear an additional 1 HP." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 3, name: "Second Wind", type: "Action", cost: "Spend 2 Hope", effect: "Target an ally within Close range. They immediately clear 1d8 HP and 1 Stress." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 3, name: "Voice of Reason", type: "Action", cost: "Mark 1 Stress", effect: "You automatically de-escalate a non-combat social conflict, forcing all parties to stand down and talk." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 4, name: "Divination", type: "Downtime", cost: "Spend 2 Hope", effect: "You run a complex medical or predictive algorithm, allowing you to ask the GM one question about the future that they must answer truthfully." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 4, name: "Life Ward", type: "Action", cost: "Mark 2 Stress", effect: "You place a protective bio-monitor on an ally. The next time they would take damage, the damage is reduced to 0." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 5, name: "Shape Material", type: "Action", cost: "Spend 2 Hope", effect: "You use a fabricator to instantly create any non-weapon, non-armor item worth 1 Bag of Credits or less." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 5, name: "Smite", type: "Action", cost: "Mark 2 Stress", effect: "You overload a medical tool or weapon. Your next melee attack deals an additional 3d8 energy damage." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 6, name: "Restoration", type: "Action", cost: "Spend 3 Hope", effect: "You cure an ally of all diseases, toxins, and negative conditions." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 6, name: "Zone of Protection", type: "Action", cost: "Mark 3 Stress", effect: "You deploy a medical shield generator. Allies within Close range gain +2 to all defense rolls and Evasion." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 7, name: "Healing Strike", type: "Action", cost: "Mark 3 Stress", effect: "Make a melee attack. If it hits, you and all allies within Close range clear 2d6 HP." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 7, name: "Splendor-Touched", type: "Passive", cost: "—", effect: "Your healing abilities are miraculous. You gain a permanent +1 to your Presence trait, and your maximum Hope increases by 1." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 8, name: "Shield Aura", type: "Passive", cost: "—", effect: "You project a constant, low-level energy shield. You and all allies within Close range gain +1 Armor Score." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 8, name: "Stunning Sunlight", type: "Action", cost: "Spend 3 Hope", effect: "You unleash a blinding flash of radiation. All enemies within Far range are Blinded and take 2d8 energy damage." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 9, name: "Overwhelming Aura", type: "Action", cost: "Mark 4 Stress", effect: "You project an aura of absolute authority. Enemies cannot attack you or allies within Close range of you unless they pass a Difficulty 18 Presence roll." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 9, name: "Salvation Beam", type: "Action", cost: "Spend 4 Hope", effect: "You fire a concentrated beam of restorative nanites. One ally within Far range clears all marked HP and Stress." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 10, name: "Invigoration", type: "Passive", cost: "—", effect: "Allies within Far range of you cannot be reduced below 1 HP by any single attack." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 10, name: "Resurrection", type: "Action", cost: "Mark 5 Stress", effect: "and spend 5 Hope. You use experimental, forbidden tech to bring a recently deceased ally back to life with 1 HP." },

  // ─── Valor Domain (Protection & Heavy Weapons) ───
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "Bare Bones", type: "Passive", cost: "—", effect: "When you are not wearing armor, your Armor Score is equal to your Strength trait." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "Forceful Push", type: "Action", cost: "Mark 1 Stress", effect: "Make a melee attack. If it hits, you push the target back to Close range and knock them prone." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "I Am Your Shield", type: "Reaction", cost: "—", effect: "When an ally within Melee range is attacked, spend 1 Hope to become the target of the attack instead." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 2, name: "Body Basher", type: "Passive", cost: "—", effect: "When you successfully push or grapple an enemy, they take 1d6 kinetic damage." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 2, name: "Bold Presence", type: "Action", cost: "Mark 1 Stress", effect: "You draw the attention of all enemies within Close range. They have Disadvantage on attacks against anyone other than you for 1 round." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 3, name: "Critical Inspiration", type: "Passive", cost: "—", effect: "When you score a critical hit, you and all allies within Close range clear 1 Stress." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 3, name: "Lean on Me", type: "Action", cost: "Spend 2 Hope", effect: "You stabilize a dying ally within Melee range, immediately clearing 1 of their Death marks." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 4, name: "Goad Them On", type: "Action", cost: "Mark 2 Stress", effect: "Target an enemy within Far range. They must attack you on their next turn or take 2d8 psychic damage." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 4, name: "Support Tank", type: "Passive", cost: "—", effect: "While you are adjacent to an ally, any healing or Stress relief applied to you also applies to them." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 5, name: "Armorer", type: "Downtime", cost: "Spend 2 Hope", effect: "You reinforce an ally's armor, granting them a temporary Armor Slot that lasts until their next rest." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 5, name: "Rousing Strike", type: "Action", cost: "Mark 2 Stress", effect: "Make a melee attack. If it hits, one ally within Close range can immediately make a free attack." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 6, name: "Inevitable", type: "Passive", cost: "—", effect: "You ignore difficult terrain and cannot be Restrained or grappled by enemies smaller than a vehicle." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 6, name: "Rise Up", type: "Action", cost: "Spend 3 Hope", effect: "You and all allies within Close range immediately stand up from prone and clear 1 Stress." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 7, name: "Shrug It Off", type: "Reaction", cost: "—", effect: "When you take damage, mark 3 Stress to completely ignore the damage and any associated conditions." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 7, name: "Valor-Touched", type: "Passive", cost: "—", effect: "Your resilience is legendary. You gain a permanent +1 to your Strength trait, and your maximum Armor Slots increase by 1." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 8, name: "Full Surge", type: "Action", cost: "Spend 3 Hope", effect: "You regain all your marked Armor Slots." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 8, name: "Ground Pound", type: "Action", cost: "Mark 3 Stress", effect: "You strike the ground with immense force. All enemies within Close range take 3d8 kinetic damage and are knocked prone." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 9, name: "Hold the Line", type: "Passive", cost: "—", effect: "Enemies cannot move past you or through your Melee range without your permission." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 9, name: "Lead by Example", type: "Action", cost: "Mark 4 Stress", effect: "You make an attack. If it hits, all allies gain Advantage on their next attack against that target." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 10, name: "Unbreakable", type: "Passive", cost: "—", effect: "When you are reduced to 0 HP, you do not fall unconscious. You can continue fighting for 3 rounds before collapsing." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 10, name: "Unyielding Armor", type: "Action", cost: "Spend 5 Hope", effect: "For the rest of the scene, you reduce all incoming damage by half (rounded down) before applying Armor." },
];

export const STANDARD_KIT = [
  "Commlink (personal communicator, station-wide range)",
  "Datapad (portable computer, can access public networks)",
  "Emergency Med-Patch (x2) — Heal 1 HP as a Free Action; single use",
  "Ration Pack (x3) — One day of food and water",
  "Utility Knife (non-combat tool for cutting, prying, etc.)",
  "200 Credits"
];
