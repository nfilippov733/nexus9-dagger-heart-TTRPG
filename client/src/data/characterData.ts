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
  // ─── Codex Domain (Law, Lore & Bureaucracy) ───
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Bureaucratic Loophole", type: "Action", cost: "Spend 1 Hope", effect: "You bypass a minor legal, administrative, or security obstacle by citing an obscure regulation." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Historical Precedent", type: "Reaction", cost: "Mark 1 Stress", effect: "When you make a Knowledge roll to recall lore, you gain Advantage on the roll." },
  { domain: "Codex", domainTheme: "Law, Lore & Bureaucracy", level: 1, name: "Diplomatic Immunity", type: "Action", cost: "—", effect: "Declare your official status. Until you take a hostile action, adversaries will not target you first in a combat encounter." },

  // ─── Grace Domain (Diplomacy & Deception) ───
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Charming Demeanor", type: "Passive", cost: "—", effect: "You gain Advantage on your first Persuasion roll in any new social scene." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Enrapture", type: "Action", cost: "Mark 1 Stress", effect: "Target one NPC within Close range. They are captivated by your presence and will ignore obvious distractions for a few minutes." },
  { domain: "Grace", domainTheme: "Diplomacy & Deception", level: 1, name: "Inspirational Words", type: "Action", cost: "Spend 1 Hope", effect: "Target one ally within Far range. They clear 1 Stress and gain +1 to their next action roll." },

  // ─── Midnight Domain (Stealth & Sabotage) ───
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Pick and Pull", type: "Action", cost: "—", effect: "Make a Finesse roll to steal a small item from a target within Melee range without them noticing." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Rain of Blades", type: "Action", cost: "Mark 1 Stress", effect: "Make a ranged attack with a thrown weapon against up to three targets within Close range." },
  { domain: "Midnight", domainTheme: "Stealth & Sabotage", level: 1, name: "Uncanny Disguise", type: "Action", cost: "Spend 1 Hope", effect: "You quickly alter your appearance using a holo-emitter or physical props, becoming unrecognizable." },

  // ─── Bone Domain (Tactics & Evasion) ───
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "Deft Maneuvers", type: "Passive", cost: "—", effect: "You gain +1 Evasion against ranged attacks." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "I See It Coming", type: "Reaction", cost: "Mark 1 Stress", effect: "When an enemy attacks you, force them to roll with Disadvantage." },
  { domain: "Bone", domainTheme: "Tactics & Evasion", level: 1, name: "Untouchable", type: "Action", cost: "Spend 1 Hope", effect: "For the rest of the round, you do not trigger reactions or opportunity attacks when moving through enemy threat zones." },

  // ─── Sage Domain (Survival & Logistics) ───
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "Gifted Tracker", type: "Passive", cost: "—", effect: "You gain Advantage on Instinct rolls to track targets, navigate asteroid fields, or survive in hostile environments." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "System Diagnostics", type: "Action", cost: "Spend 1 Hope", effect: "You instantly identify the exact mechanical or software issue with a vehicle, ship, or terminal." },
  { domain: "Sage", domainTheme: "Survival & Logistics", level: 1, name: "Jury-Rigged Snare", type: "Action", cost: "Mark 1 Stress", effect: "You deploy a quick trap. The next enemy to enter Melee range of you is Restrained for 1 round." },

  // ─── Blade Domain (Close Quarters Combat) ───
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Get Back Up", type: "Reaction", cost: "Spend 1 Hope", effect: "When you are reduced to 0 HP, immediately clear 1 HP and stand up." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Not Good Enough", type: "Reaction", cost: "Mark 1 Stress", effect: "When an enemy hits you with a melee attack, reduce the damage by your Armor Score without marking an Armor Slot." },
  { domain: "Blade", domainTheme: "Close Quarters Combat", level: 1, name: "Whirlwind", type: "Action", cost: "Mark 1 Stress", effect: "Make a melee attack against every enemy within Melee range." },

  // ─── Valor Domain (Protection & Heavy Weapons) ───
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "Bare Bones", type: "Passive", cost: "—", effect: "When you are not wearing armor, your Armor Score is equal to your Strength trait." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "Forceful Push", type: "Action", cost: "Mark 1 Stress", effect: "Make a melee attack. If it hits, you push the target back to Close range and knock them prone." },
  { domain: "Valor", domainTheme: "Protection & Heavy Weapons", level: 1, name: "I Am Your Shield", type: "Reaction", cost: "Spend 1 Hope", effect: "When an ally within Melee range is attacked, become the target of the attack instead." },

  // ─── Arcana Domain (Telepathy & Technomancy) ───
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Rune Ward", type: "Action", cost: "Spend 1 Hope", effect: "You place a psychic or energy ward on an ally within Close range, granting them +2 Armor Score for the scene." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Unleash Chaos", type: "Action", cost: "Mark 1 Stress", effect: "You project a burst of raw telekinetic force. Make an attack against a target within Far range for 1d10 energy damage." },
  { domain: "Arcana", domainTheme: "Telepathy & Technomancy", level: 1, name: "Wall Walk", type: "Action", cost: "Spend 1 Hope", effect: "You manipulate local gravity fields, allowing you to walk on walls and ceilings for the rest of the scene." },

  // ─── Splendor Domain (Medicine & Morale) ───
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Bolt Beacon", type: "Action", cost: "Mark 1 Stress", effect: "You fire a flare or tracer round at a target. The next attack against that target has Advantage." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Mending Touch", type: "Action", cost: "Spend 1 Hope", effect: "You stabilize a wounded ally within Melee range, clearing 1d6 HP." },
  { domain: "Splendor", domainTheme: "Medicine & Morale", level: 1, name: "Reassurance", type: "Action", cost: "Spend 1 Hope", effect: "You offer words of comfort or a mild sedative. An ally within Close range clears 1d4 Stress." },
];

export const STANDARD_KIT = [
  "Commlink (personal communicator, station-wide range)",
  "Datapad (portable computer, can access public networks)",
  "Emergency Med-Patch (x2) — Heal 1 HP as a Free Action; single use",
  "Ration Pack (x3) — One day of food and water",
  "Utility Knife (non-combat tool for cutting, prying, etc.)",
  "200 Credits"
];
