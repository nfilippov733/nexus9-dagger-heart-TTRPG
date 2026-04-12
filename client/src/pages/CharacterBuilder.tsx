import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ANCESTRIES, COMMUNITIES, CLASSES, TRAITS, TRAIT_DESCRIPTIONS,
  STANDARD_ARRAY, EXPERIENCES, ARMOR_OPTIONS, WEAPON_OPTIONS, STANDARD_KIT,
  DOMAIN_CARDS,
  type TraitName, type GameClass, type Ancestry, type Community, type Subclass,
  type DomainCardEntry
} from "@/data/characterData";

/* ─── Design: Nexus 9 Station Terminal ─── */
// Colors: deep-space navy (#0B1120), teal accent (#00D4AA), nebula purple (#6B21A8)
// Fonts: Rajdhani headings, Source Serif 4 body
// Layout: stepped wizard with animated transitions

type Step = "name" | "ancestry" | "community" | "class" | "subclass" | "domainCards" | "traits" | "experience" | "gear" | "review";

const STEPS: { id: Step; label: string; num: number }[] = [
  { id: "name", label: "Identity", num: 1 },
  { id: "ancestry", label: "Ancestry", num: 2 },
  { id: "community", label: "Community", num: 3 },
  { id: "class", label: "Class", num: 4 },
  { id: "subclass", label: "Subclass", num: 5 },
  { id: "domainCards", label: "Domains", num: 6 },
  { id: "traits", label: "Traits", num: 7 },
  { id: "experience", label: "Experience", num: 8 },
  { id: "gear", label: "Equipment", num: 9 },
  { id: "review", label: "Review", num: 10 },
];

interface CharacterState {
  name: string;
  pronouns: string;
  ancestry: Ancestry | null;
  community: Community | null;
  gameClass: GameClass | null;
  subclass: Subclass | null;
  domainCards: string[]; // selected domain card names (one per class domain)
  traits: Record<TraitName, number>;
  traitsComplete: boolean;
  experiences: string[];
  armor: string;
  weapons: string[];
  notes: string;
}

const initialCharacter: CharacterState = {
  name: "",
  pronouns: "",
  ancestry: null,
  community: null,
  gameClass: null,
  subclass: null,
  domainCards: [],
  traits: { Agility: 0, Strength: 0, Finesse: 0, Instinct: 0, Presence: 0, Knowledge: 0 },
  traitsComplete: false,
  experiences: [],
  armor: "",
  weapons: [],
  notes: "",
};

const STORAGE_KEY = "nexus9_character_builder";

function saveToStorage(character: CharacterState, step: Step) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ character, step, savedAt: Date.now() }));
  } catch { /* ignore quota errors */ }
}

function loadFromStorage(): { character: CharacterState; step: Step } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.character && parsed?.step) {
      // Rehydrate ancestry/community/class/subclass from data arrays
      const c = parsed.character as CharacterState;
      if (c.ancestry) c.ancestry = ANCESTRIES.find(a => a.name === c.ancestry?.name) || null;
      if (c.community) c.community = COMMUNITIES.find(co => co.name === c.community?.name) || null;
      if (c.gameClass) {
        c.gameClass = CLASSES.find(cl => cl.name === c.gameClass?.name) || null;
        if (c.subclass && c.gameClass) {
          c.subclass = c.gameClass.subclasses.find(s => s.name === c.subclass?.name) || null;
        }
      }
      return { character: c, step: parsed.step };
    }
  } catch { /* ignore parse errors */ }
  return null;
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

function StepIndicator({ steps, current }: { steps: typeof STEPS; current: Step }) {
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1 shrink-0">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            i < idx ? "bg-[#00D4AA] text-[#0B1120]" :
            i === idx ? "bg-[#00D4AA] text-[#0B1120] ring-2 ring-[#00D4AA]/40 ring-offset-2 ring-offset-[#0B1120]" :
            "bg-[#1a2744] text-[#4a6a8a]"
          }`}>
            {i < idx ? "✓" : step.num}
          </div>
          <span className={`text-xs hidden sm:inline transition-colors ${
            i <= idx ? "text-[#00D4AA]" : "text-[#4a6a8a]"
          }`}>{step.label}</span>
          {i < steps.length - 1 && (
            <div className={`w-4 h-px transition-colors ${i < idx ? "bg-[#00D4AA]" : "bg-[#1a2744]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectionCard({ title, subtitle, selected, onClick, children }: {
  title: string; subtitle?: string; selected: boolean; onClick: () => void; children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-4 rounded-lg border-2 transition-all duration-200 ${
        selected
          ? "border-[#00D4AA] bg-[#00D4AA]/10 shadow-[0_0_12px_rgba(0,212,170,0.15)]"
          : "border-[#1a2744] bg-[#0d1628] hover:border-[#2a4060] hover:bg-[#111d35]"
      }`}
    >
      <div className="font-['Rajdhani'] font-bold text-lg text-[#e0e8f0]">{title}</div>
      {subtitle && <div className="text-sm text-[#7a9ab8] mt-1">{subtitle}</div>}
      {children}
    </button>
  );
}

function FeatureBox({ label, name, effect }: { label: string; name: string; effect: string }) {
  return (
    <div className="mt-2 p-2 rounded bg-[#0B1120]/60 border border-[#1a2744]">
      <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider">{label}</span>
      <span className="text-xs text-[#c0d0e0] ml-2 font-semibold">{name}:</span>
      <span className="text-xs text-[#8aa0b8] ml-1">{effect}</span>
    </div>
  );
}

/* ─── Trait Assignment Component ─── */
function TraitAssigner({ traits, onChange, onComplete, recommendedTraits }: {
  traits: Record<TraitName, number>;
  onChange: (t: Record<TraitName, number>) => void;
  onComplete: (complete: boolean) => void;
  recommendedTraits?: string[];
}) {
  const [pool, setPool] = useState<number[]>(() => {
    // Initialize pool from what's NOT yet assigned
    const assigned = Object.values(traits).filter(v => v !== 0);
    if (assigned.length === 0) return [...STANDARD_ARRAY];
    // Reconstruct pool by removing assigned values from standard array
    const remaining = [...STANDARD_ARRAY];
    for (const t of TRAITS) {
      const val = traits[t];
      if (val !== 0) {
        const idx = remaining.indexOf(val);
        if (idx >= 0) remaining.splice(idx, 1);
      }
    }
    return remaining.sort((a, b) => b - a);
  });
  const [assigned, setAssigned] = useState<Record<TraitName, number | null>>(() => {
    const init: Record<string, number | null> = {};
    TRAITS.forEach(t => { init[t] = traits[t] !== 0 ? traits[t] : null; });
    return init as Record<TraitName, number | null>;
  });

  const assignValue = (trait: TraitName, value: number, poolIndex: number) => {
    const newAssigned = { ...assigned };
    const newPool = [...pool];
    // If trait already has a value, return it to pool
    if (newAssigned[trait] !== null) {
      newPool.push(newAssigned[trait]!);
    }
    newAssigned[trait] = value;
    newPool.splice(poolIndex, 1);
    setAssigned(newAssigned);
    setPool(newPool.sort((a, b) => b - a));
    // Update parent
    const result: Record<TraitName, number> = {} as any;
    TRAITS.forEach(t => { result[t] = newAssigned[t] ?? 0; });
    onChange(result);
    onComplete(TRAITS.every(t => newAssigned[t] !== null));
  };

  const unassign = (trait: TraitName) => {
    if (assigned[trait] === null) return;
    const newPool = [...pool, assigned[trait]!].sort((a, b) => b - a);
    const newAssigned = { ...assigned, [trait]: null };
    setPool(newPool);
    setAssigned(newAssigned);
    const result: Record<TraitName, number> = {} as any;
    TRAITS.forEach(t => { result[t] = newAssigned[t] ?? 0; });
    onChange(result);
    onComplete(false);
  };

  const allAssigned = TRAITS.every(t => assigned[t] !== null);

  return (
    <div>
      <div className="mb-4">
        <div className="text-sm text-[#7a9ab8] mb-2">Standard Array — click a value then assign to a trait:</div>
        <div className="flex gap-2 flex-wrap">
          {pool.map((val, i) => (
            <div key={`pool-${i}`} className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
              val > 0 ? "border-[#00D4AA] text-[#00D4AA] bg-[#00D4AA]/10" :
              val === 0 ? "border-[#4a6a8a] text-[#4a6a8a] bg-[#1a2744]" :
              "border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10"
            }`}>
              {val > 0 ? `+${val}` : val}
            </div>
          ))}
          {pool.length === 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="text-sm text-[#00D4AA] font-semibold">All values assigned!</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRAITS.map(trait => {
          const isRecommended = recommendedTraits?.includes(trait);
          return (
            <div key={trait} className={`flex items-center gap-3 p-3 rounded-lg bg-[#0d1628] border ${
              isRecommended && assigned[trait] === null ? "border-[#c084fc]/40" : "border-[#1a2744]"
            }`}>
              <div className="flex-1">
                <div className="font-['Rajdhani'] font-bold text-[#e0e8f0] flex items-center gap-2">
                  {trait}
                  {isRecommended && <span className="text-[9px] bg-[#6B21A8]/30 text-[#c084fc] px-1.5 py-0.5 rounded">REC</span>}
                </div>
                <div className="text-xs text-[#6a8aa8]">{TRAIT_DESCRIPTIONS[trait]}</div>
              </div>
              {assigned[trait] !== null ? (
                <button
                  onClick={() => unassign(trait)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                    assigned[trait]! > 0 ? "border-[#00D4AA] text-[#00D4AA] bg-[#00D4AA]/10" :
                    assigned[trait]! === 0 ? "border-[#4a6a8a] text-[#4a6a8a] bg-[#1a2744]" :
                    "border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10"
                  }`}
                  title="Click to unassign"
                >
                  {assigned[trait]! > 0 ? `+${assigned[trait]}` : assigned[trait]}
                </button>
              ) : (
                <div className="flex gap-1">
                  {pool.length > 0 ? Array.from(new Set(pool)).slice(0, 4).map((val) => {
                    const poolIdx = pool.indexOf(val);
                    return (
                      <button
                        key={`assign-${trait}-${val}`}
                        onClick={() => assignValue(trait, val, poolIdx)}
                        className={`w-9 h-9 rounded flex items-center justify-center text-sm font-bold border cursor-pointer transition-all hover:scale-110 ${
                          val > 0 ? "border-[#00D4AA]/50 text-[#00D4AA] hover:bg-[#00D4AA]/20" :
                          val === 0 ? "border-[#4a6a8a]/50 text-[#4a6a8a] hover:bg-[#4a6a8a]/20" :
                          "border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/20"
                        }`}
                      >
                        {val > 0 ? `+${val}` : val}
                      </button>
                    );
                  }) : (
                    <div className="w-12 h-9 rounded bg-[#1a2744] flex items-center justify-center text-xs text-[#4a6a8a]">—</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {allAssigned && (
        <div className="mt-3 p-3 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-center">
          <span className="text-sm text-[#00D4AA] font-semibold">Trait assignment complete — proceed to the next step.</span>
        </div>
      )}
    </div>
  );
}

/* ─── Print Sheet Component ─── */
function PrintSheet({ character }: { character: CharacterState }) {
  const c = character;
  const cls = c.gameClass;
  const armorData = ARMOR_OPTIONS.find(a => a.name === c.armor);
  const weaponData = c.weapons.map(w => WEAPON_OPTIONS.find(o => o.name === w)).filter(Boolean);

  return (
    <div id="print-sheet" className="bg-white text-black p-8 max-w-[8.5in] mx-auto" style={{ fontFamily: "'Source Serif 4', serif" }}>
      {/* Header */}
      <div className="border-b-4 border-black pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {c.name || "Unnamed Character"}
            </h1>
            <div className="text-sm text-gray-600">{c.pronouns}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              NEXUS 9
            </div>
            <div className="text-xs text-gray-500">The Fraying Dark</div>
          </div>
        </div>
        <div className="flex gap-6 mt-2 text-sm">
          <span><strong>Ancestry:</strong> {c.ancestry?.name || "—"}</span>
          <span><strong>Community:</strong> {c.community?.name || "—"}</span>
          <span><strong>Class:</strong> {cls?.name || "—"}</span>
          <span><strong>Subclass:</strong> {c.subclass?.name || "—"}</span>
          <span><strong>Level:</strong> 1</span>
        </div>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="border-2 border-black rounded p-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider">Hit Points</div>
          <div className="text-3xl font-bold">{cls?.hp || "—"}</div>
        </div>
        <div className="border-2 border-black rounded p-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider">Evasion</div>
          <div className="text-3xl font-bold">{cls ? cls.evasion + (armorData?.evasionMod || 0) : "—"}</div>
        </div>
        <div className="border-2 border-black rounded p-3 text-center">
          <div className="text-xs font-bold uppercase tracking-wider">Armor Score</div>
          <div className="text-3xl font-bold">{armorData?.armorScore || "—"}</div>
        </div>
      </div>

      {/* Traits */}
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>TRAITS</h2>
        <div className="grid grid-cols-6 gap-2">
          {TRAITS.map(t => (
            <div key={t} className="border border-black rounded p-2 text-center">
              <div className="text-xs font-bold uppercase">{t.slice(0, 3)}</div>
              <div className="text-xl font-bold">{c.traits[t] > 0 ? `+${c.traits[t]}` : c.traits[t]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Damage Thresholds */}
      {armorData && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>DAMAGE THRESHOLDS</h2>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="border border-black rounded p-2">
              <div className="text-xs font-bold">GLANCING</div>
              <div>Below {armorData.minor}</div>
              <div className="text-xs text-gray-600">0 HP lost</div>
            </div>
            <div className="border border-black rounded p-2">
              <div className="text-xs font-bold">MINOR</div>
              <div>{armorData.minor}–{armorData.major - 1}</div>
              <div className="text-xs text-gray-600">1 HP lost</div>
            </div>
            <div className="border border-black rounded p-2">
              <div className="text-xs font-bold">MAJOR</div>
              <div>{armorData.major}–{armorData.severe - 1}</div>
              <div className="text-xs text-gray-600">2 HP lost</div>
            </div>
            <div className="border border-black rounded p-2">
              <div className="text-xs font-bold">SEVERE</div>
              <div>{armorData.severe}+</div>
              <div className="text-xs text-gray-600">3 HP lost</div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>FEATURES</h2>
        <div className="space-y-2 text-sm">
          {c.ancestry && (
            <div><strong>Ancestry — {c.ancestry.featureName}:</strong> {c.ancestry.featureEffect}</div>
          )}
          {c.community && (
            <div><strong>Community — {c.community.featureName}:</strong> {c.community.featureEffect}</div>
          )}
          {cls && (
            <>
              <div><strong>Hope — {cls.hopeFeatureName}:</strong> {cls.hopeFeatureEffect}</div>
              <div><strong>Class — {cls.classFeatureName}:</strong> {cls.classFeatureEffect}</div>
            </>
          )}
          {c.subclass && (
            <div><strong>Foundation — {c.subclass.foundation.name}:</strong> {c.subclass.foundation.effect}</div>
          )}
        </div>
      </div>

      {/* Domain Cards */}
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>DOMAIN CARDS (LOADOUT)</h2>
        {c.domainCards.length > 0 ? (
          <div className="space-y-2">
            {c.domainCards.map(cardName => {
              const card = DOMAIN_CARDS.find(dc => dc.name === cardName);
              if (!card) return <div key={cardName} className="text-sm">{cardName}</div>;
              return (
                <div key={cardName} className="border border-black rounded p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase bg-gray-200 px-1.5 py-0.5 rounded">{card.type}</span>
                    <span className="font-bold">{card.name}</span>
                    <span className="text-xs text-gray-500">({card.domain})</span>
                  </div>
                  {card.cost !== "\u2014" && <div className="text-xs font-semibold mt-0.5">{card.cost}</div>}
                  <div className="text-sm mt-0.5">{card.effect}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm">{cls?.domains.join(", ") || "—"}</div>
        )}
      </div>

      {/* Experiences */}
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>EXPERIENCES</h2>
        <div className="text-sm">{c.experiences.length > 0 ? c.experiences.join(", ") : "—"}</div>
      </div>

      {/* Equipment */}
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>EQUIPMENT</h2>
        <div className="text-sm space-y-1">
          {c.armor && <div><strong>Armor:</strong> {c.armor}</div>}
          {weaponData.map((w, i) => (
            <div key={i}><strong>{w!.name}:</strong> {w!.damage} ({w!.range}) — {w!.feature}</div>
          ))}
          <div className="mt-2"><strong>Standard Kit:</strong></div>
          <ul className="list-disc list-inside text-xs">
            {STANDARD_KIT.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          {cls && <div className="mt-1"><strong>Class Gear:</strong> {cls.starterGear}</div>}
        </div>
      </div>

      {/* Starship & Diplomacy Roles */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>STARSHIP ROLE</h2>
          <div className="text-sm">{cls?.starshipRole || "—"}</div>
        </div>
        <div>
          <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>DIPLOMACY ROLE</h2>
          <div className="text-sm">{cls?.diplomacyRole || "—"}</div>
        </div>
      </div>

      {/* Notes */}
      {c.notes && (
        <div>
          <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>NOTES</h2>
          <div className="text-sm whitespace-pre-wrap">{c.notes}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Character Builder ─── */
export default function CharacterBuilder() {
  const [step, setStep] = useState<Step>("name");
  const [character, setCharacter] = useState<CharacterState>({ ...initialCharacter });
  const [direction, setDirection] = useState(1);
  const [showPrint, setShowPrint] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.character.name) {
      setShowResumePrompt(true);
    }
    setLoaded(true);
  }, []);

  const resumeSaved = () => {
    const saved = loadFromStorage();
    if (saved) {
      setCharacter(saved.character);
      setStep(saved.step);
    }
    setShowResumePrompt(false);
  };

  const startFresh = () => {
    clearStorage();
    setCharacter({ ...initialCharacter });
    setStep("name");
    setShowResumePrompt(false);
  };

  // Auto-save on every change
  useEffect(() => {
    if (loaded && !showResumePrompt) {
      saveToStorage(character, step);
    }
  }, [character, step, loaded, showResumePrompt]);

  const stepIdx = STEPS.findIndex(s => s.id === step);

  const goNext = useCallback(() => {
    if (stepIdx < STEPS.length - 1) {
      setDirection(1);
      setStep(STEPS[stepIdx + 1].id);
      contentRef.current?.scrollTo(0, 0);
    }
  }, [stepIdx]);

  const goBack = useCallback(() => {
    if (stepIdx > 0) {
      setDirection(-1);
      setStep(STEPS[stepIdx - 1].id);
      contentRef.current?.scrollTo(0, 0);
    }
  }, [stepIdx]);

  const update = (partial: Partial<CharacterState>) => {
    setCharacter(prev => ({ ...prev, ...partial }));
  };

  // Auto-add community experience when community changes
  useEffect(() => {
    if (character.community) {
      const commExp = character.community.experience;
      if (!character.experiences.includes(commExp)) {
        update({ experiences: [commExp, ...character.experiences.filter(e => e !== commExp)] });
      }
    }
  }, [character.community?.name]);

  const canProceed = (): boolean => {
    switch (step) {
      case "name": return character.name.trim().length > 0;
      case "ancestry": return character.ancestry !== null;
      case "community": return character.community !== null;
      case "class": return character.gameClass !== null;
      case "subclass": return character.subclass !== null;
      case "domainCards": {
        if (!character.gameClass) return false;
        const d1 = character.gameClass.domains[0];
        const d2 = character.gameClass.domains[1];
        const hasD1 = character.domainCards.some(n => DOMAIN_CARDS.find(c => c.name === n && c.domain === d1));
        const hasD2 = character.domainCards.some(n => DOMAIN_CARDS.find(c => c.name === n && c.domain === d2));
        return hasD1 && hasD2;
      }
      case "traits": return character.traitsComplete;
      case "experience": return character.experiences.length >= 3; // community + 2 chosen
      case "gear": return character.armor !== "" && character.weapons.length > 0;
      case "review": return true;
      default: return true;
    }
  };

  const handlePrint = () => {
    setShowPrint(true);
    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 300);
  };

  const renderStep = () => {
    switch (step) {
      case "name":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Who Are You?</h2>
              <p className="text-[#7a9ab8] text-sm">Every legend begins with a name. Who steps aboard Nexus 9?</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#8aa0b8] mb-1">Character Name</label>
              <input
                type="text"
                value={character.name}
                onChange={e => update({ name: e.target.value })}
                placeholder="Enter your character's name..."
                className="w-full p-3 rounded-lg bg-[#0d1628] border-2 border-[#1a2744] text-[#e0e8f0] placeholder-[#4a6a8a] focus:border-[#00D4AA] focus:outline-none transition-colors text-lg"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#8aa0b8] mb-1">Pronouns (optional)</label>
              <input
                type="text"
                value={character.pronouns}
                onChange={e => update({ pronouns: e.target.value })}
                placeholder="e.g., she/her, he/him, they/them..."
                className="w-full p-3 rounded-lg bg-[#0d1628] border-2 border-[#1a2744] text-[#e0e8f0] placeholder-[#4a6a8a] focus:border-[#00D4AA] focus:outline-none transition-colors"
              />
            </div>
          </div>
        );

      case "ancestry":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Ancestry</h2>
              <p className="text-[#7a9ab8] text-sm">Your ancestry determines your species and grants a unique biological or cultural feature.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {ANCESTRIES.map(a => (
                <SelectionCard
                  key={a.name}
                  title={a.name}
                  subtitle={a.description}
                  selected={character.ancestry?.name === a.name}
                  onClick={() => update({ ancestry: a })}
                >
                  <FeatureBox label="Feature" name={a.featureName} effect={a.featureEffect} />
                </SelectionCard>
              ))}
            </div>
          </div>
        );

      case "community":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Community</h2>
              <p className="text-[#7a9ab8] text-sm">Where you grew up shapes your skills and worldview. Your community grants a feature and a bonus Experience.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {COMMUNITIES.map(c => (
                <SelectionCard
                  key={c.name}
                  title={c.name}
                  subtitle={c.description}
                  selected={character.community?.name === c.name}
                  onClick={() => update({ community: c })}
                >
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-0.5 rounded">+{c.experience}</span>
                  </div>
                  <FeatureBox label="Feature" name={c.featureName} effect={c.featureEffect} />
                </SelectionCard>
              ))}
            </div>
          </div>
        );

      case "class":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Class</h2>
              <p className="text-[#7a9ab8] text-sm">Your class defines your combat role, starship station, and core abilities.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {CLASSES.map(cls => (
                <SelectionCard
                  key={cls.name}
                  title={`The ${cls.name}`}
                  subtitle={cls.description}
                  selected={character.gameClass?.name === cls.name}
                  onClick={() => update({ gameClass: cls, subclass: null, domainCards: [] })}
                >
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-[#00D4AA]/15 text-[#00D4AA] px-2 py-0.5 rounded">{cls.role}</span>
                    <span className="text-xs bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">HP {cls.hp}</span>
                    <span className="text-xs bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">Evasion {cls.evasion}</span>
                    <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-0.5 rounded">{cls.domains[0]}</span>
                    <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-0.5 rounded">{cls.domains[1]}</span>
                  </div>
                  <FeatureBox label="Hope" name={cls.hopeFeatureName} effect={cls.hopeFeatureEffect} />
                  <FeatureBox label="Class" name={cls.classFeatureName} effect={cls.classFeatureEffect} />
                </SelectionCard>
              ))}
            </div>
          </div>
        );

      case "subclass":
        if (!character.gameClass) return null;
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Subclass</h2>
              <p className="text-[#7a9ab8] text-sm">
                Each {character.gameClass.name} walks one of two paths. You gain the Foundation feature at Level 1.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {character.gameClass.subclasses.map(sc => (
                <SelectionCard
                  key={sc.name}
                  title={sc.name}
                  subtitle={sc.description}
                  selected={character.subclass?.name === sc.name}
                  onClick={() => update({ subclass: sc })}
                >
                  <FeatureBox label="Foundation (Lv 1)" name={sc.foundation.name} effect={sc.foundation.effect} />
                  <FeatureBox label="Specialization (Lv 3+)" name={sc.specialization.name} effect={sc.specialization.effect} />
                  <FeatureBox label="Mastery (Lv 7+)" name={sc.mastery.name} effect={sc.mastery.effect} />
                </SelectionCard>
              ))}
            </div>
          </div>
        );

      case "domainCards":
        if (!character.gameClass) return null;
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Domain Cards</h2>
              <p className="text-[#7a9ab8] text-sm">
                At Level 1, you choose <strong className="text-[#e0e8f0]">one card from each</strong> of your class's two Domains.
                These form the start of your <strong className="text-[#e0e8f0]">Loadout</strong> — the abilities you can use in play.
              </p>
            </div>

            {character.gameClass.domains.map((domainName, domIdx) => {
              const domainCards = DOMAIN_CARDS.filter(c => c.domain === domainName && c.level === 1);
              const selectedInDomain = character.domainCards.find(n => domainCards.some(c => c.name === n));
              const domainTheme = domainCards[0]?.domainTheme || "";

              return (
                <div key={domainName}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selectedInDomain ? "bg-[#00D4AA] text-[#0B1120]" : "bg-[#6B21A8]/30 text-[#c084fc]"
                    }`}>
                      {domIdx + 1}
                    </div>
                    <div>
                      <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0]">{domainName} Domain</h3>
                      <p className="text-xs text-[#6a8aa8]">{domainTheme}</p>
                    </div>
                    {selectedInDomain && (
                      <span className="ml-auto text-xs bg-[#00D4AA]/15 text-[#00D4AA] px-2 py-1 rounded-full font-semibold">1 selected</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {domainCards.map(card => {
                      const isSelected = character.domainCards.includes(card.name);
                      const otherDomainSelected = selectedInDomain && selectedInDomain !== card.name;

                      // Color coding for card type
                      const typeColor = card.type === "Passive" ? "bg-[#22c55e]/15 text-[#4ade80]" :
                        card.type === "Reaction" ? "bg-[#f59e0b]/15 text-[#fbbf24]" :
                        card.type === "Action" ? "bg-[#3b82f6]/15 text-[#60a5fa]" :
                        "bg-[#8b5cf6]/15 text-[#a78bfa]";

                      const costColor = card.cost.includes("Hope") ? "text-[#00D4AA]" :
                        card.cost.includes("Stress") ? "text-[#f87171]" : "text-[#7a9ab8]";

                      return (
                        <button
                          key={card.name}
                          onClick={() => {
                            if (isSelected) {
                              // Deselect
                              update({ domainCards: character.domainCards.filter(n => n !== card.name) });
                            } else {
                              // Select: replace any existing selection from this domain
                              const otherDomainCards = character.domainCards.filter(n =>
                                !domainCards.some(dc => dc.name === n)
                              );
                              update({ domainCards: [...otherDomainCards, card.name] });
                            }
                          }}
                          className={`text-left w-full rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                            isSelected
                              ? "border-[#00D4AA] bg-gradient-to-br from-[#00D4AA]/10 to-[#0d1628] shadow-[0_0_20px_rgba(0,212,170,0.12)]"
                              : otherDomainSelected
                              ? "border-[#1a2744] bg-[#0d1628] opacity-50 hover:opacity-70"
                              : "border-[#1a2744] bg-[#0d1628] hover:border-[#2a4060] hover:bg-[#111d35]"
                          }`}
                        >
                          {/* Card Header */}
                          <div className={`px-4 py-2.5 flex items-center justify-between ${
                            isSelected ? "bg-[#00D4AA]/8" : "bg-[#0a0f1a]/60"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor}`}>{card.type}</span>
                              <span className="font-['Rajdhani'] font-bold text-[#e0e8f0] text-lg">{card.name}</span>
                            </div>
                            {isSelected && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="px-4 py-3">
                            {card.cost !== "\u2014" && (
                              <div className={`text-xs font-semibold mb-1.5 ${costColor}`}>
                                {card.cost}
                              </div>
                            )}
                            <p className="text-sm text-[#8aa0b8] leading-relaxed">{card.effect}</p>
                          </div>

                          {/* Card Footer */}
                          <div className="px-4 py-2 bg-[#0a0f1a]/40 border-t border-[#1a2744]/50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#4a6a8a]">Level {card.level} · {domainName}</span>
                              {!isSelected && !otherDomainSelected && (
                                <span className="text-xs text-[#00D4AA]/60">Click to select</span>
                              )}
                              {isSelected && (
                                <span className="text-xs text-[#00D4AA]">Click to deselect</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Completion indicator */}
            {character.gameClass && (() => {
              const d1 = character.gameClass!.domains[0];
              const d2 = character.gameClass!.domains[1];
              const hasD1 = character.domainCards.some(n => DOMAIN_CARDS.find(c => c.name === n && c.domain === d1));
              const hasD2 = character.domainCards.some(n => DOMAIN_CARDS.find(c => c.name === n && c.domain === d2));
              if (hasD1 && hasD2) {
                return (
                  <div className="p-3 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-center">
                    <span className="text-sm text-[#00D4AA] font-semibold">Both domain cards selected — proceed to the next step.</span>
                  </div>
                );
              }
              return (
                <div className="p-3 rounded-lg bg-[#1a2744]/50 border border-[#1a2744] text-center">
                  <span className="text-sm text-[#4a6a8a]">
                    Select {!hasD1 && !hasD2 ? "one card from each domain" : hasD1 ? `one card from ${d2}` : `one card from ${d1}`} to continue.
                  </span>
                </div>
              );
            })()}
          </div>
        );

      case "traits":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Assign Your Traits</h2>
              <p className="text-[#7a9ab8] text-sm">
                Assign the Standard Array (+2, +1, +1, 0, 0, -1) to your six traits. Click a value on a trait to assign it; click an assigned value to unassign.
              </p>
            </div>
            <TraitAssigner
              traits={character.traits}
              onChange={t => update({ traits: t })}
              onComplete={c => update({ traitsComplete: c })}
              recommendedTraits={character.gameClass?.recommendedTraits}
            />
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Experiences</h2>
              <p className="text-[#7a9ab8] text-sm">
                Select 2 additional Experiences that represent your character's background training.
                {character.community && (
                  <span className="text-[#c084fc]"> Your community grants <strong>{character.community.experience}</strong> automatically.</span>
                )}
              </p>
              <p className="text-xs text-[#4a6a8a] mt-1">
                Total: {character.experiences.length} of 3 (1 community + 2 chosen)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXPERIENCES.map(exp => {
                const isCommunity = character.community?.experience === exp.name;
                const isSelected = character.experiences.includes(exp.name);
                const nonCommunityCount = character.experiences.filter(e => e !== character.community?.experience).length;
                const canSelect = !isCommunity && !isSelected && nonCommunityCount < 2;
                return (
                  <button
                    key={exp.name}
                    onClick={() => {
                      if (isCommunity) return;
                      if (isSelected) {
                        update({ experiences: character.experiences.filter(e => e !== exp.name) });
                      } else if (canSelect) {
                        update({ experiences: [...character.experiences, exp.name] });
                      }
                    }}
                    disabled={!isCommunity && !isSelected && !canSelect}
                    className={`text-left p-3 rounded-lg border-2 transition-all ${
                      isCommunity ? "border-[#c084fc] bg-[#6B21A8]/15 cursor-default" :
                      isSelected ? "border-[#00D4AA] bg-[#00D4AA]/10" :
                      canSelect ? "border-[#1a2744] bg-[#0d1628] hover:border-[#2a4060]" :
                      "border-[#1a2744] bg-[#0d1628] opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-['Rajdhani'] font-bold text-[#e0e8f0]">{exp.name}</span>
                      {isCommunity && <span className="text-xs bg-[#6B21A8]/40 text-[#c084fc] px-1.5 py-0.5 rounded">Community</span>}
                      {isSelected && !isCommunity && <span className="text-xs bg-[#00D4AA]/20 text-[#00D4AA] px-1.5 py-0.5 rounded">Selected</span>}
                    </div>
                    <div className="text-xs text-[#6a8aa8] mt-1">{exp.examples}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "gear":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Equipment</h2>
              <p className="text-[#7a9ab8] text-sm">Select one armor and up to 2 weapons. You also receive the Standard Kit and your class gear.</p>
            </div>

            <div>
              <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0] mb-2">Armor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARMOR_OPTIONS.map(a => (
                  <SelectionCard
                    key={a.name}
                    title={a.name}
                    subtitle={`${a.type} Armor`}
                    selected={character.armor === a.name}
                    onClick={() => update({ armor: a.name })}
                  >
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">Score {a.armorScore}</span>
                      <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">Evasion {a.evasionMod >= 0 ? `+${a.evasionMod}` : a.evasionMod}</span>
                      <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">Minor {a.minor}+ | Major {a.major}+ | Severe {a.severe}+</span>
                    </div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0] mb-2">
                Weapons <span className="text-sm font-normal text-[#7a9ab8]">(select up to 2)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WEAPON_OPTIONS.map(w => {
                  const isSelected = character.weapons.includes(w.name);
                  return (
                    <SelectionCard
                      key={w.name}
                      title={w.name}
                      subtitle={`${w.type} — ${w.trait}`}
                      selected={isSelected}
                      onClick={() => {
                        if (isSelected) {
                          update({ weapons: character.weapons.filter(n => n !== w.name) });
                        } else if (character.weapons.length < 2) {
                          update({ weapons: [...character.weapons, w.name] });
                        }
                      }}
                    >
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="bg-[#ef4444]/15 text-[#f87171] px-2 py-0.5 rounded">{w.damage}</span>
                        <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">{w.range}</span>
                        <span className="text-[#6a8aa8]">{w.feature}</span>
                      </div>
                    </SelectionCard>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0] mb-2">Standard Kit (included)</h3>
              <div className="p-3 rounded-lg bg-[#0d1628] border border-[#1a2744]">
                <ul className="text-sm text-[#8aa0b8] space-y-1">
                  {STANDARD_KIT.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            </div>

            {character.gameClass && (
              <div>
                <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0] mb-2">Class Gear ({character.gameClass.name})</h3>
                <div className="p-3 rounded-lg bg-[#0d1628] border border-[#1a2744]">
                  <p className="text-sm text-[#8aa0b8]">{character.gameClass.starterGear}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Character Complete</h2>
              <p className="text-[#7a9ab8] text-sm">Review your character below. You can go back to any step to make changes.</p>
            </div>

            {/* Summary Card */}
            <div className="p-5 rounded-lg bg-[#0d1628] border-2 border-[#00D4AA]/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-['Rajdhani'] text-3xl font-bold text-[#e0e8f0]">{character.name}</h3>
                  {character.pronouns && <div className="text-sm text-[#6a8aa8]">{character.pronouns}</div>}
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#7a9ab8]">Level 1</div>
                  <div className="font-['Rajdhani'] text-lg font-bold text-[#c084fc]">
                    {character.gameClass?.name} — {character.subclass?.name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Ancestry</span>
                  <div className="text-[#e0e8f0] font-semibold">{character.ancestry?.name}</div>
                </div>
                <div>
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Community</span>
                  <div className="text-[#e0e8f0] font-semibold">{character.community?.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">HP</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">{character.gameClass?.hp}</div>
                </div>
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">Evasion</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {character.gameClass ? character.gameClass.evasion + (ARMOR_OPTIONS.find(a => a.name === character.armor)?.evasionMod || 0) : "—"}
                  </div>
                </div>
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">Armor</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {ARMOR_OPTIONS.find(a => a.name === character.armor)?.armorScore || "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 mb-4">
                {TRAITS.map(t => (
                  <div key={t} className="text-center p-2 rounded bg-[#0B1120] border border-[#1a2744]">
                    <div className="text-xs text-[#4a6a8a]">{t.slice(0, 3)}</div>
                    <div className={`text-lg font-bold ${character.traits[t] > 0 ? "text-[#00D4AA]" : character.traits[t] < 0 ? "text-[#f87171]" : "text-[#7a9ab8]"}`}>
                      {character.traits[t] > 0 ? `+${character.traits[t]}` : character.traits[t]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Experiences</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {character.experiences.map(e => (
                    <span key={e} className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-1 rounded">{e}</span>
                  ))}
                </div>
              </div>

              {/* Domain Cards */}
              {character.domainCards.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Domain Cards (Loadout)</span>
                  <div className="mt-2 space-y-2">
                    {character.domainCards.map(cardName => {
                      const card = DOMAIN_CARDS.find(c => c.name === cardName);
                      if (!card) return null;
                      const typeColor = card.type === "Passive" ? "bg-[#22c55e]/15 text-[#4ade80]" :
                        card.type === "Reaction" ? "bg-[#f59e0b]/15 text-[#fbbf24]" :
                        "bg-[#3b82f6]/15 text-[#60a5fa]";
                      const costColor = card.cost.includes("Hope") ? "text-[#00D4AA]" :
                        card.cost.includes("Stress") ? "text-[#f87171]" : "text-[#7a9ab8]";
                      return (
                        <div key={cardName} className="p-2.5 rounded-lg bg-[#0B1120]/60 border border-[#1a2744]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${typeColor}`}>{card.type}</span>
                            <span className="text-sm font-bold text-[#e0e8f0] font-['Rajdhani']">{card.name}</span>
                            <span className="text-[10px] text-[#6B21A8] bg-[#6B21A8]/20 px-1.5 py-0.5 rounded">{card.domain}</span>
                          </div>
                          {card.cost !== "\u2014" && <div className={`text-xs font-semibold mb-0.5 ${costColor}`}>{card.cost}</div>}
                          <div className="text-xs text-[#8aa0b8]">{card.effect}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Equipment</span>
                <div className="text-sm text-[#8aa0b8] mt-1">
                  <strong className="text-[#e0e8f0]">{character.armor}</strong>
                  {character.weapons.map(w => {
                    const wd = WEAPON_OPTIONS.find(o => o.name === w);
                    return wd ? <span key={w}> · <strong className="text-[#e0e8f0]">{wd.name}</strong> ({wd.damage})</span> : null;
                  })}
                </div>
              </div>

              {/* Features summary */}
              <div className="mb-4">
                <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Key Features</span>
                <div className="mt-1 space-y-1 text-xs text-[#8aa0b8]">
                  {character.ancestry && <div><span className="text-[#00D4AA]">{character.ancestry.featureName}:</span> {character.ancestry.featureEffect}</div>}
                  {character.community && <div><span className="text-[#00D4AA]">{character.community.featureName}:</span> {character.community.featureEffect}</div>}
                  {character.subclass && <div><span className="text-[#00D4AA]">{character.subclass.foundation.name}:</span> {character.subclass.foundation.effect}</div>}
                </div>
              </div>

              {/* Starship & Diplomacy roles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Starship Role</span>
                  <div className="text-xs text-[#8aa0b8] mt-1">{character.gameClass?.starshipRole}</div>
                </div>
                <div>
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Diplomacy Role</span>
                  <div className="text-xs text-[#8aa0b8] mt-1">{character.gameClass?.diplomacyRole}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-[#8aa0b8] mb-1">Character Notes (optional)</label>
              <textarea
                value={character.notes}
                onChange={e => update({ notes: e.target.value })}
                placeholder="Backstory, personality, goals, bonds..."
                rows={4}
                className="w-full p-3 rounded-lg bg-[#0d1628] border-2 border-[#1a2744] text-[#e0e8f0] placeholder-[#4a6a8a] focus:border-[#00D4AA] focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-lg bg-[#00D4AA] text-[#0B1120] font-['Rajdhani'] font-bold text-lg hover:bg-[#00e8bb] transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print Character Sheet
              </button>
              <button
                onClick={() => {
                  // Build export object with resolved domain cards
                  const exportData = {
                    ...character,
                    domainCards: character.domainCards.map(name => {
                      const card = DOMAIN_CARDS.find(c => c.name === name);
                      return card ? { name: card.name, domain: card.domain, type: card.type, cost: card.cost, effect: card.effect } : name;
                    })
                  };
                  const json = JSON.stringify(exportData, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${character.name || "character"}_nexus9.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-3 rounded-lg border-2 border-[#00D4AA] text-[#00D4AA] font-['Rajdhani'] font-bold text-lg hover:bg-[#00D4AA]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export JSON
              </button>
              <button
                onClick={() => {
                  if (confirm("Start a new character? This will clear your current progress.")) {
                    clearStorage();
                    setCharacter({ ...initialCharacter });
                    setStep("name");
                  }
                }}
                className="py-3 px-6 rounded-lg border-2 border-[#ef4444]/40 text-[#f87171] font-['Rajdhani'] font-bold hover:bg-[#ef4444]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                New Character
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Resume prompt modal
  if (showResumePrompt) {
    const saved = loadFromStorage();
    return (
      <div className="min-h-screen bg-[#0B1120] text-[#e0e8f0] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-lg bg-[#0d1628] border-2 border-[#00D4AA]/30 shadow-2xl">
          <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-3">Resume Character?</h2>
          <p className="text-[#7a9ab8] text-sm mb-4">
            You have a saved character in progress:
          </p>
          {saved && (
            <div className="p-3 rounded bg-[#0B1120] border border-[#1a2744] mb-4">
              <div className="font-bold text-[#e0e8f0]">{saved.character.name || "Unnamed"}</div>
              <div className="text-xs text-[#7a9ab8] mt-1">
                {saved.character.gameClass?.name || "No class"} · Step: {STEPS.find(s => s.id === saved.step)?.label || saved.step}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={resumeSaved} className="flex-1 py-2.5 rounded-lg bg-[#00D4AA] text-[#0B1120] font-['Rajdhani'] font-bold hover:bg-[#00e8bb] transition-colors">
              Resume
            </button>
            <button onClick={startFresh} className="flex-1 py-2.5 rounded-lg border-2 border-[#1a2744] text-[#7a9ab8] font-['Rajdhani'] font-bold hover:border-[#2a4060] transition-colors">
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPrint) {
    return <PrintSheet character={character} />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#e0e8f0] flex flex-col">
      {/* Header */}
      <header className="bg-[#0a0f1a] border-b border-[#1a2744] px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#7a9ab8] hover:text-[#00D4AA] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span className="text-sm">Back to Book</span>
          </Link>
          <h1 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0]">
            <span className="text-[#00D4AA]">NEXUS 9</span> Character Builder
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-[#0a0f1a] border-b border-[#1a2744] px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto">
          <StepIndicator steps={STEPS} current={step} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 h-1 bg-[#0a0f1a]">
        <div className="h-full bg-[#00D4AA] transition-all duration-300" style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
      </div>

      {/* Content — takes remaining space minus footer */}
      <main ref={contentRef} className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.25 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Nav — fixed at bottom */}
      <footer className="shrink-0 bg-[#0a0f1a] border-t border-[#1a2744] px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={goBack}
            disabled={stepIdx === 0}
            className="px-6 py-2 rounded-lg border border-[#1a2744] text-[#7a9ab8] font-['Rajdhani'] font-bold disabled:opacity-30 hover:border-[#2a4060] hover:text-[#e0e8f0] transition-all"
          >
            ← Back
          </button>
          <div className="text-sm text-[#4a6a8a]">
            Step {stepIdx + 1} of {STEPS.length}
          </div>
          {step !== "review" ? (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="px-6 py-2 rounded-lg bg-[#00D4AA] text-[#0B1120] font-['Rajdhani'] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00e8bb] transition-all"
            >
              Next →
            </button>
          ) : (
            <div className="w-24" />
          )}
        </div>
      </footer>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-sheet, #print-sheet * { visibility: visible; }
          #print-sheet { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
