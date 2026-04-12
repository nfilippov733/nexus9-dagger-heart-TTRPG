import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ANCESTRIES, COMMUNITIES, CLASSES, TRAITS, TRAIT_DESCRIPTIONS,
  STANDARD_ARRAY, EXPERIENCES, ARMOR_OPTIONS, WEAPON_OPTIONS, STANDARD_KIT,
  DOMAIN_CARDS, CLASS_TIER_STATS, getTierForLevel, getClassStatsForLevel,
  type TraitName, type GameClass, type Ancestry, type Community, type Subclass,
  type DomainCardEntry, type ClassTierStats, type Weapon, type Armor
} from "@/data/characterData";
import { CLASS_PORTRAIT_MAP, PREGEN_PORTRAIT_MAP } from "@/data/images";

// Helper to find a portrait for a saved character
function getCharacterPortrait(c: { name: string; gameClass: { name: string } | null }): string | null {
  // Check pregen portraits first (exact character names)
  const lowerName = c.name.toLowerCase();
  for (const [key, url] of Object.entries(PREGEN_PORTRAIT_MAP)) {
    if (lowerName.includes(key)) return url;
  }
  // Fall back to class portraits
  if (c.gameClass) {
    const className = c.gameClass.name.toLowerCase();
    for (const [key, url] of Object.entries(CLASS_PORTRAIT_MAP)) {
      if (className.includes(key)) return url;
    }
  }
  return null;
}

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
  level: number;
  ancestry: Ancestry | null;
  community: Community | null;
  gameClass: GameClass | null;
  subclass: Subclass | null;
  domainCards: string[]; // selected domain card names (one per level per domain)
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
  level: 1,
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

/* ─── Multi-Character Storage ─── */
interface SavedCharacterEntry {
  id: string;
  character: CharacterState;
  step: Step;
  savedAt: number;
}

const GALLERY_KEY = "nexus9_character_gallery";
const ACTIVE_KEY = "nexus9_active_character_id";
const STORAGE_KEY = "nexus9_character_builder"; // legacy single-char key

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadGallery(): SavedCharacterEntry[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) {
      // Migrate legacy single-character save
      const legacy = localStorage.getItem(STORAGE_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed?.character?.name) {
          const entry: SavedCharacterEntry = {
            id: generateId(),
            character: parsed.character,
            step: parsed.step || "name",
            savedAt: parsed.savedAt || Date.now(),
          };
          if (!entry.character.level) entry.character.level = 1;
          localStorage.setItem(GALLERY_KEY, JSON.stringify([entry]));
          localStorage.setItem(ACTIVE_KEY, entry.id);
          localStorage.removeItem(STORAGE_KEY);
          return [entry];
        }
      }
      return [];
    }
    return JSON.parse(raw);
  } catch { return []; }
}

function saveGallery(gallery: SavedCharacterEntry[]) {
  try { localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery)); } catch { /* quota */ }
}

function saveActiveId(id: string | null) {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch { /* ignore */ }
}

function getActiveId(): string | null {
  try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
}

function hydrateCharacter(c: CharacterState): CharacterState {
  if (!c.level) c.level = 1;
  if (c.ancestry) c.ancestry = ANCESTRIES.find(a => a.name === c.ancestry?.name) || null;
  if (c.community) c.community = COMMUNITIES.find(co => co.name === c.community?.name) || null;
  if (c.gameClass) {
    c.gameClass = CLASSES.find(cl => cl.name === c.gameClass?.name) || null;
    if (c.subclass && c.gameClass) {
      c.subclass = c.gameClass.subclasses.find(s => s.name === c.subclass?.name) || null;
    }
  }
  return c;
}

/* ─── Reusable Components ─── */

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

/* ─── Domain Card Component ─── */
function DomainCard({ card, isSelected, isDimmed, onClick, onDetail }: {
  card: DomainCardEntry; isSelected: boolean; isDimmed: boolean; onClick: () => void; onDetail?: () => void;
}) {
  const typeColor = card.type === "Passive" ? "bg-[#22c55e]/15 text-[#4ade80]" :
    card.type === "Reaction" ? "bg-[#f59e0b]/15 text-[#fbbf24]" :
    card.type === "Action" ? "bg-[#3b82f6]/15 text-[#60a5fa]" :
    "bg-[#8b5cf6]/15 text-[#a78bfa]";
  const costColor = card.cost.includes("Hope") ? "text-[#00D4AA]" :
    card.cost.includes("Stress") ? "text-[#f87171]" : "text-[#7a9ab8]";

  return (
    <div className={`text-left w-full rounded-xl border-2 transition-all duration-200 overflow-hidden ${
      isSelected
        ? "border-[#00D4AA] bg-gradient-to-br from-[#00D4AA]/10 to-[#0d1628] shadow-[0_0_20px_rgba(0,212,170,0.12)]"
        : isDimmed
        ? "border-[#1a2744] bg-[#0d1628] opacity-50 hover:opacity-70"
        : "border-[#1a2744] bg-[#0d1628] hover:border-[#2a4060] hover:bg-[#111d35]"
    }`}>
      <button onClick={onClick} className="w-full text-left">
        <div className={`px-4 py-2.5 flex items-center justify-between ${isSelected ? "bg-[#00D4AA]/8" : "bg-[#0a0f1a]/60"}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor}`}>{card.type}</span>
            <span className="font-['Rajdhani'] font-bold text-[#e0e8f0] text-lg">{card.name}</span>
          </div>
          {isSelected && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          )}
        </div>
        <div className="px-4 py-3">
          {card.cost !== "\u2014" && (
            <div className={`text-xs font-semibold mb-1.5 ${costColor}`}>{card.cost}</div>
          )}
          <p className="text-sm text-[#8aa0b8] leading-relaxed">{card.effect}</p>
        </div>
      </button>
      <div className="px-4 py-2 bg-[#0a0f1a]/40 border-t border-[#1a2744]/50 flex items-center justify-between">
        <span className="text-xs text-[#4a6a8a]">Level {card.level} · {card.domain}</span>
        <div className="flex items-center gap-3">
          {onDetail && (
            <button onClick={(e) => { e.stopPropagation(); onDetail(); }} className="text-xs text-[#6B21A8] hover:text-[#c084fc] transition-colors">
              Details
            </button>
          )}
          {!isSelected && !isDimmed && <span className="text-xs text-[#00D4AA]/60">Click to select</span>}
          {isSelected && <span className="text-xs text-[#00D4AA]">Click to deselect</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Domain Card Detail Modal ─── */
function DomainCardModal({ card, onClose }: { card: DomainCardEntry | null; onClose: () => void }) {
  if (!card) return null;
  const typeColor = card.type === "Passive" ? "bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30" :
    card.type === "Reaction" ? "bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30" :
    card.type === "Action" ? "bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30" :
    "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/30";
  const costColor = card.cost.includes("Hope") ? "text-[#00D4AA]" :
    card.cost.includes("Stress") ? "text-[#f87171]" : "text-[#7a9ab8]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border-2 border-[#00D4AA]/30 bg-[#0d1628] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a0f1a] to-[#0d1628] border-b border-[#1a2744]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-bold border ${typeColor}`}>{card.type}</span>
              <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-1 rounded border border-[#6B21A8]/30">{card.domain}</span>
            </div>
            <button onClick={onClose} className="text-[#4a6a8a] hover:text-[#e0e8f0] transition-colors p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#e0e8f0] mt-3">{card.name}</h2>
          <div className="text-xs text-[#4a6a8a] mt-1">Level {card.level} · {card.domainTheme}</div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {card.cost !== "\u2014" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#4a6a8a] uppercase tracking-wider">Cost</span>
              <span className={`text-sm font-bold ${costColor}`}>{card.cost}</span>
            </div>
          )}
          <div>
            <span className="text-xs font-bold text-[#4a6a8a] uppercase tracking-wider block mb-2">Effect</span>
            <p className="text-[#c0d0e0] leading-relaxed">{card.effect}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0a0f1a]/60 border-t border-[#1a2744] text-center">
          <button onClick={onClose} className="px-8 py-2 rounded-lg bg-[#00D4AA] text-[#0B1120] font-['Rajdhani'] font-bold hover:bg-[#00e8bb] transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Saved Characters Gallery ─── */
function CharacterGallery({ gallery, activeId, onLoad, onDelete, onNew, onClose }: {
  gallery: SavedCharacterEntry[];
  activeId: string | null;
  onLoad: (entry: SavedCharacterEntry) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] rounded-2xl border-2 border-[#00D4AA]/30 bg-[#0d1628] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 bg-[#0a0f1a] border-b border-[#1a2744] flex items-center justify-between shrink-0">
          <h2 className="font-['Rajdhani'] text-xl font-bold text-[#e0e8f0]">
            <span className="text-[#00D4AA]">SAVED</span> Characters ({gallery.length})
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={onNew} className="px-4 py-1.5 rounded-lg bg-[#00D4AA] text-[#0B1120] text-sm font-['Rajdhani'] font-bold hover:bg-[#00e8bb] transition-colors">
              + New
            </button>
            <button onClick={onClose} className="text-[#4a6a8a] hover:text-[#e0e8f0] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {gallery.length === 0 ? (
            <div className="text-center py-12 text-[#4a6a8a]">
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-sm">No saved characters yet. Create your first agent!</p>
            </div>
          ) : (
            gallery.sort((a, b) => b.savedAt - a.savedAt).map(entry => {
              const c = entry.character;
              const isActive = entry.id === activeId;
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive ? "border-[#00D4AA]/50 bg-[#00D4AA]/5" : "border-[#1a2744] bg-[#0B1120] hover:border-[#2a4060]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    {(() => {
                      const portrait = getCharacterPortrait(c as any);
                      return portrait ? (
                        <img src={portrait} alt={c.name || "Character"} className="w-12 h-12 rounded-lg object-cover border border-[#1a2744] mr-3 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#1a2744] border border-[#2a4060] mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6a8a" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-['Rajdhani'] font-bold text-lg text-[#e0e8f0] truncate">{c.name || "Unnamed"}</span>
                        {isActive && <span className="text-[10px] bg-[#00D4AA]/20 text-[#00D4AA] px-1.5 py-0.5 rounded font-bold shrink-0">ACTIVE</span>}
                      </div>
                      <div className="text-sm text-[#7a9ab8] mt-0.5">
                        Level {c.level} {c.gameClass?.name || "—"}{c.subclass ? ` · ${c.subclass.name}` : ""}
                      </div>
                      <div className="text-xs text-[#4a6a8a] mt-1">
                        {c.ancestry?.name || "—"} · {c.community?.name || "—"} · Step: {STEPS.find(s => s.id === entry.step)?.label || entry.step}
                      </div>
                      <div className="text-xs text-[#4a6a8a] mt-0.5">
                        Saved {new Date(entry.savedAt).toLocaleDateString()} {new Date(entry.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <button
                        onClick={() => onLoad(entry)}
                        className="px-3 py-1.5 rounded-lg bg-[#00D4AA] text-[#0B1120] text-xs font-['Rajdhani'] font-bold hover:bg-[#00e8bb] transition-colors"
                      >
                        {isActive ? "Continue" : "Load"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${c.name || "Unnamed"}"?`)) onDelete(entry.id);
                        }}
                        className="p-1.5 rounded-lg border border-[#ef4444]/30 text-[#f87171] hover:bg-[#ef4444]/10 transition-colors"
                        title="Delete character"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
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
    const assigned = Object.values(traits).filter(v => v !== 0);
    if (assigned.length === 0) return [...STANDARD_ARRAY];
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
    if (newAssigned[trait] !== null) {
      newPool.push(newAssigned[trait]!);
    }
    newAssigned[trait] = value;
    newPool.splice(poolIndex, 1);
    setAssigned(newAssigned);
    setPool(newPool.sort((a, b) => b - a));
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
            <div
              key={`pool-${i}`}
              className="w-12 h-12 rounded-lg bg-[#00D4AA]/15 border-2 border-[#00D4AA]/40 flex items-center justify-center font-bold text-lg text-[#00D4AA] cursor-pointer hover:bg-[#00D4AA]/25 transition-colors"
            >
              {val > 0 ? `+${val}` : val}
            </div>
          ))}
          {pool.length === 0 && allAssigned && (
            <div className="text-sm text-[#00D4AA] flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              All values assigned!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRAITS.map(trait => {
          const isRecommended = recommendedTraits?.includes(trait);
          return (
            <div key={trait} className={`p-3 rounded-lg border-2 transition-all ${
              assigned[trait] !== null ? "border-[#00D4AA]/40 bg-[#00D4AA]/5" : "border-[#1a2744] bg-[#0d1628]"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-['Rajdhani'] font-bold text-[#e0e8f0]">{trait}</span>
                {isRecommended && <span className="text-[10px] bg-[#6B21A8]/30 text-[#c084fc] px-1 py-0.5 rounded">REC</span>}
              </div>
              <div className="text-xs text-[#4a6a8a] mb-2">{TRAIT_DESCRIPTIONS[trait]}</div>
              {assigned[trait] !== null ? (
                <button
                  onClick={() => unassign(trait)}
                  className="w-full py-1.5 rounded bg-[#00D4AA]/15 text-[#00D4AA] font-bold text-lg hover:bg-[#00D4AA]/25 transition-colors"
                >
                  {assigned[trait]! > 0 ? `+${assigned[trait]}` : assigned[trait]}
                </button>
              ) : (
                <div className="flex gap-1 flex-wrap">
                  {pool.map((val, i) => (
                    <button
                      key={`assign-${trait}-${i}`}
                      onClick={() => assignValue(trait, val, i)}
                      className="px-2 py-1 rounded bg-[#1a2744] text-[#7a9ab8] text-sm hover:bg-[#2a4060] hover:text-[#e0e8f0] transition-colors"
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Print Sheet ─── */
function PrintSheet({ character }: { character: CharacterState }) {
  const c = character;
  const cls = c.gameClass;
  const tier = getTierForLevel(c.level);
  const tierStats = cls ? getClassStatsForLevel(cls.name, c.level) : null;
  const armorData = ARMOR_OPTIONS.find(a => a.name === c.armor);
  const weaponData = c.weapons.map(w => WEAPON_OPTIONS.find(o => o.name === w)).filter(Boolean);

  return (
    <div id="print-sheet" className="bg-white text-black p-8 max-w-[800px] mx-auto" style={{ fontFamily: "'Source Serif 4', serif" }}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>NEXUS 9: THE FRAYING DARK</h1>
        <div className="text-sm text-gray-500">Character Sheet</div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{c.name}</h2>
          {c.pronouns && <div className="text-sm text-gray-500">{c.pronouns}</div>}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">Level {c.level} {cls?.name}</div>
          <div className="text-sm">{c.subclass?.name} · Tier {tier}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4 text-center">
        <div className="border-2 border-black rounded p-2">
          <div className="text-xs font-bold uppercase">HP</div>
          <div className="text-2xl font-bold">{tierStats?.hp ?? cls?.hp ?? "—"}</div>
        </div>
        <div className="border-2 border-black rounded p-2">
          <div className="text-xs font-bold uppercase">Evasion</div>
          <div className="text-2xl font-bold">{tierStats ? tierStats.evasion + (armorData?.evasionMod || 0) : "—"}</div>
        </div>
        <div className="border-2 border-black rounded p-2">
          <div className="text-xs font-bold uppercase">Armor</div>
          <div className="text-2xl font-bold">{armorData?.armorScore ?? "—"}</div>
        </div>
        <div className="border-2 border-black rounded p-2">
          <div className="text-xs font-bold uppercase">Stress</div>
          <div className="text-2xl font-bold">{tierStats?.stressSlots ?? "—"}</div>
        </div>
      </div>

      {/* Damage Thresholds */}
      {tierStats && (
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="border border-gray-400 rounded p-2">
            <div className="text-xs font-bold uppercase">Minor</div>
            <div className="text-lg font-bold">{tierStats.minor}+</div>
          </div>
          <div className="border border-gray-400 rounded p-2">
            <div className="text-xs font-bold uppercase">Major</div>
            <div className="text-lg font-bold">{tierStats.major}+</div>
          </div>
          <div className="border border-gray-400 rounded p-2">
            <div className="text-xs font-bold uppercase">Severe</div>
            <div className="text-lg font-bold">{tierStats.severe}+</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm"><strong>Ancestry:</strong> {c.ancestry?.name}</div>
          <div className="text-xs text-gray-600">{c.ancestry?.featureName}: {c.ancestry?.featureEffect}</div>
        </div>
        <div>
          <div className="text-sm"><strong>Community:</strong> {c.community?.name}</div>
          <div className="text-xs text-gray-600">{c.community?.featureName}: {c.community?.featureEffect}</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-4 text-center">
        {TRAITS.map(t => (
          <div key={t} className="border border-gray-400 rounded p-2">
            <div className="text-xs font-bold">{t.slice(0, 3).toUpperCase()}</div>
            <div className="text-lg font-bold">{c.traits[t] > 0 ? `+${c.traits[t]}` : c.traits[t]}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>EXPERIENCES</h2>
        <div className="text-sm">{c.experiences.length > 0 ? c.experiences.join(", ") : "—"}</div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-black mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>EQUIPMENT</h2>
        <div className="text-sm space-y-1">
          {c.armor && <div><strong>Armor:</strong> {c.armor}</div>}
          {weaponData.map((w, i) => (
            <div key={i}><strong>{w!.name}:</strong> {w!.damage} ({w!.range}) — {w!.feature || "No special feature"}</div>
          ))}
          <div className="mt-2"><strong>Standard Kit:</strong></div>
          <ul className="list-disc list-inside text-xs">
            {STANDARD_KIT.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          {cls && <div className="mt-1"><strong>Class Gear:</strong> {cls.starterGear}</div>}
        </div>
      </div>

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
  const [loaded, setLoaded] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]));
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState<SavedCharacterEntry[]>([]);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [detailCard, setDetailCard] = useState<DomainCardEntry | null>(null);
  const [weaponFilter, setWeaponFilter] = useState<string>("all");
  const contentRef = useRef<HTMLDivElement>(null);

  // Load gallery on mount
  useEffect(() => {
    const g = loadGallery();
    setGallery(g);
    const activeId = getActiveId();
    if (activeId) {
      const entry = g.find(e => e.id === activeId);
      if (entry) {
        const hydrated = hydrateCharacter({ ...entry.character });
        setCharacter(hydrated);
        setStep(entry.step);
        setActiveCharId(entry.id);
        const levels = new Set<number>();
        hydrated.domainCards.forEach(name => {
          const card = DOMAIN_CARDS.find(c => c.name === name);
          if (card) levels.add(card.level);
        });
        if (levels.size === 0) levels.add(1);
        setExpandedLevels(levels);
      }
    }
    setLoaded(true);
  }, []);

  // Auto-save active character to gallery
  useEffect(() => {
    if (!loaded) return;
    if (activeCharId) {
      const updated = gallery.map(e =>
        e.id === activeCharId ? { ...e, character, step, savedAt: Date.now() } : e
      );
      setGallery(updated);
      saveGallery(updated);
    }
  }, [character, step, loaded, activeCharId]);

  const createNewCharacter = () => {
    // Save current if exists
    const newId = generateId();
    const newEntry: SavedCharacterEntry = {
      id: newId,
      character: { ...initialCharacter },
      step: "name",
      savedAt: Date.now(),
    };
    const newGallery = [...gallery, newEntry];
    setGallery(newGallery);
    saveGallery(newGallery);
    setActiveCharId(newId);
    saveActiveId(newId);
    setCharacter({ ...initialCharacter });
    setStep("name");
    setExpandedLevels(new Set([1]));
    setShowGallery(false);
  };

  const loadCharacter = (entry: SavedCharacterEntry) => {
    const hydrated = hydrateCharacter({ ...entry.character });
    setCharacter(hydrated);
    setStep(entry.step);
    setActiveCharId(entry.id);
    saveActiveId(entry.id);
    const levels = new Set<number>();
    hydrated.domainCards.forEach(name => {
      const card = DOMAIN_CARDS.find(c => c.name === name);
      if (card) levels.add(card.level);
    });
    if (levels.size === 0) levels.add(1);
    setExpandedLevels(levels);
    setShowGallery(false);
  };

  const deleteCharacter = (id: string) => {
    const newGallery = gallery.filter(e => e.id !== id);
    setGallery(newGallery);
    saveGallery(newGallery);
    if (id === activeCharId) {
      if (newGallery.length > 0) {
        loadCharacter(newGallery[0]);
      } else {
        createNewCharacter();
      }
    }
  };

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

  // Compute required domain card count based on level
  const requiredCardCount = useMemo(() => character.level * 2, [character.level]);

  // Compute domain card selection status per level per domain
  const domainCardStatus = useMemo(() => {
    if (!character.gameClass) return { complete: false, perLevel: {} as Record<number, Record<string, string | null>> };
    const d1 = character.gameClass.domains[0];
    const d2 = character.gameClass.domains[1];
    const perLevel: Record<number, Record<string, string | null>> = {};
    let complete = true;
    for (let lvl = 1; lvl <= character.level; lvl++) {
      perLevel[lvl] = { [d1]: null, [d2]: null };
      for (const cardName of character.domainCards) {
        const card = DOMAIN_CARDS.find(c => c.name === cardName);
        if (card && card.level === lvl) {
          if (card.domain === d1) perLevel[lvl][d1] = cardName;
          if (card.domain === d2) perLevel[lvl][d2] = cardName;
        }
      }
      if (!perLevel[lvl][d1] || !perLevel[lvl][d2]) complete = false;
    }
    return { complete, perLevel };
  }, [character.gameClass, character.domainCards, character.level]);

  // Tier-aware gear filtering
  const tier = getTierForLevel(character.level);
  const tierStats = character.gameClass ? getClassStatsForLevel(character.gameClass.name, character.level) : null;

  const filteredArmor = useMemo(() => ARMOR_OPTIONS.filter(a => a.tier === tier), [tier]);
  const filteredWeapons = useMemo(() => {
    let weapons = WEAPON_OPTIONS.filter(w => w.tier === tier);
    if (weaponFilter !== "all") {
      weapons = weapons.filter(w => w.type === weaponFilter);
    }
    return weapons;
  }, [tier, weaponFilter]);

  const weaponTypes = useMemo(() => {
    const types = new Set(WEAPON_OPTIONS.filter(w => w.tier === tier).map(w => w.type));
    return ["all", ...Array.from(types).sort()];
  }, [tier]);

  const canProceed = (): boolean => {
    switch (step) {
      case "name": return character.name.trim().length > 0;
      case "ancestry": return character.ancestry !== null;
      case "community": return character.community !== null;
      case "class": return character.gameClass !== null;
      case "subclass": return character.subclass !== null;
      case "domainCards": return domainCardStatus.complete;
      case "traits": return character.traitsComplete;
      case "experience": return character.experiences.length >= 3;
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

  // Toggle a domain card selection
  const toggleDomainCard = (card: DomainCardEntry) => {
    const isSelected = character.domainCards.includes(card.name);
    if (isSelected) {
      update({ domainCards: character.domainCards.filter(n => n !== card.name) });
    } else {
      const cardsAtThisLevelAndDomain = DOMAIN_CARDS.filter(c => c.domain === card.domain && c.level === card.level);
      const otherCards = character.domainCards.filter(n =>
        !cardsAtThisLevelAndDomain.some(dc => dc.name === n)
      );
      update({ domainCards: [...otherCards, card.name] });
    }
  };

  const toggleLevel = (lvl: number) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(lvl)) next.delete(lvl);
      else next.add(lvl);
      return next;
    });
  };

  const handleLevelChange = (newLevel: number) => {
    const pruned = character.domainCards.filter(name => {
      const card = DOMAIN_CARDS.find(c => c.name === name);
      return card && card.level <= newLevel;
    });
    // Also prune gear if tier changed
    const newTier = getTierForLevel(newLevel);
    const oldTier = getTierForLevel(character.level);
    let newArmor = character.armor;
    let newWeapons = character.weapons;
    if (newTier !== oldTier) {
      // Reset gear selections when tier changes
      newArmor = "";
      newWeapons = [];
    }
    update({ level: newLevel, domainCards: pruned, armor: newArmor, weapons: newWeapons });
    setExpandedLevels(prev => {
      const next = new Set(prev);
      next.add(newLevel);
      return next;
    });
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
            {/* Level Selector */}
            <div>
              <label className="block text-sm font-bold text-[#8aa0b8] mb-2">Character Level</label>
              <p className="text-xs text-[#4a6a8a] mb-3">
                New characters start at Level 1. Higher levels unlock stronger gear and more domain cards.
                {tier > 1 && <span className="text-[#c084fc] ml-1">Tier {tier} (Levels {tier === 2 ? "3-4" : tier === 3 ? "5-7" : "8-10"})</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => {
                  const lvlTier = getTierForLevel(lvl);
                  const tierBorder = lvl === 3 || lvl === 5 || lvl === 8;
                  return (
                    <div key={lvl} className={`${tierBorder ? "ml-2 pl-2 border-l-2 border-[#6B21A8]/40" : ""}`}>
                      <button
                        onClick={() => handleLevelChange(lvl)}
                        className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold border-2 transition-all duration-200 ${
                          character.level === lvl
                            ? "border-[#00D4AA] bg-[#00D4AA] text-[#0B1120] shadow-[0_0_12px_rgba(0,212,170,0.3)]"
                            : "border-[#1a2744] bg-[#0d1628] text-[#7a9ab8] hover:border-[#2a4060] hover:text-[#e0e8f0]"
                        }`}
                      >
                        <span className="text-lg leading-none">{lvl}</span>
                        <span className="text-[8px] leading-none opacity-60">T{lvlTier}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "ancestry":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Ancestry</h2>
              <p className="text-[#7a9ab8] text-sm">Your species and heritage define your biological capabilities and cultural roots.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <p className="text-[#7a9ab8] text-sm">Where you grew up shaped your skills and worldview. Your community grants a free Experience.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {COMMUNITIES.map(co => (
                <SelectionCard
                  key={co.name}
                  title={co.name}
                  subtitle={co.description}
                  selected={character.community?.name === co.name}
                  onClick={() => update({ community: co })}
                >
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-0.5 rounded">
                      Free Experience: {co.experience} (+{co.experienceBonus})
                    </span>
                  </div>
                  <FeatureBox label="Feature" name={co.featureName} effect={co.featureEffect} />
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
              <p className="text-[#7a9ab8] text-sm">Your class defines your combat role, special abilities, and place in the crew.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {CLASSES.map(cls => {
                const clsStats = getClassStatsForLevel(cls.name, character.level);
                return (
                  <SelectionCard
                    key={cls.name}
                    title={cls.name}
                    subtitle={cls.role}
                    selected={character.gameClass?.name === cls.name}
                    onClick={() => update({
                      gameClass: cls,
                      subclass: null,
                      domainCards: [],
                      armor: "",
                      weapons: [],
                    })}
                  >
                    <p className="text-xs text-[#6a8aa8] mt-1">{cls.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-[#00D4AA]/15 text-[#00D4AA] px-2 py-0.5 rounded">HP {clsStats?.hp ?? cls.hp}</span>
                      <span className="text-xs bg-[#3b82f6]/15 text-[#60a5fa] px-2 py-0.5 rounded">Evasion {clsStats?.evasion ?? cls.evasion}</span>
                      <span className="text-xs bg-[#6B21A8]/20 text-[#c084fc] px-2 py-0.5 rounded">{cls.domains[0]}</span>
                      <span className="text-xs bg-[#6B21A8]/20 text-[#c084fc] px-2 py-0.5 rounded">{cls.domains[1]}</span>
                      <span className="text-xs bg-[#f59e0b]/15 text-[#fbbf24] px-2 py-0.5 rounded">Stress {clsStats?.stressSlots ?? "6"}</span>
                    </div>
                    <FeatureBox label="Hope Feature" name={cls.hopeFeatureName} effect={cls.hopeFeatureEffect} />
                  </SelectionCard>
                );
              })}
            </div>
          </div>
        );

      case "subclass":
        if (!character.gameClass) return <div className="text-[#7a9ab8]">Please select a class first.</div>;
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Choose Your Subclass</h2>
              <p className="text-[#7a9ab8] text-sm">
                As a <strong className="text-[#e0e8f0]">{character.gameClass.name}</strong>, choose your specialization path.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {character.gameClass.subclasses.map(sub => (
                <SelectionCard
                  key={sub.name}
                  title={sub.name}
                  subtitle={sub.description}
                  selected={character.subclass?.name === sub.name}
                  onClick={() => update({ subclass: sub })}
                >
                  <div className="mt-3 space-y-2">
                    <FeatureBox label="Foundation (Lv 1)" name={sub.foundation.name} effect={sub.foundation.effect} />
                    {character.level >= 3 && <FeatureBox label="Specialization (Lv 3)" name={sub.specialization.name} effect={sub.specialization.effect} />}
                    {character.level >= 7 && <FeatureBox label="Mastery (Lv 7)" name={sub.mastery.name} effect={sub.mastery.effect} />}
                    {character.level < 3 && (
                      <div className="text-xs text-[#4a6a8a] italic mt-1">Specialization unlocks at Level 3 · Mastery at Level 7</div>
                    )}
                  </div>
                </SelectionCard>
              ))}
            </div>
          </div>
        );

      case "domainCards":
        if (!character.gameClass) return <div className="text-[#7a9ab8]">Please select a class first.</div>;
        const [domain1, domain2] = character.gameClass.domains;
        return (
          <div className="space-y-4">
            <div>
              <h2 className="font-['Rajdhani'] text-2xl font-bold text-[#00D4AA] mb-1">Select Domain Cards</h2>
              <p className="text-[#7a9ab8] text-sm">
                Choose 1 card from each domain per level. At Level {character.level}, you need {requiredCardCount} cards total.
              </p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-1 rounded">{domain1}</span>
                <span className="text-xs bg-[#6B21A8]/30 text-[#c084fc] px-2 py-1 rounded">{domain2}</span>
              </div>
            </div>

            {Array.from({ length: character.level }, (_, i) => i + 1).map(lvl => {
              const isExpanded = expandedLevels.has(lvl);
              const d1Selected = domainCardStatus.perLevel[lvl]?.[domain1];
              const d2Selected = domainCardStatus.perLevel[lvl]?.[domain2];
              const levelComplete = !!d1Selected && !!d2Selected;

              return (
                <div key={lvl} className={`rounded-lg border-2 transition-all ${
                  levelComplete ? "border-[#00D4AA]/30 bg-[#00D4AA]/5" : "border-[#1a2744] bg-[#0d1628]"
                }`}>
                  <button onClick={() => toggleLevel(lvl)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <span className={`font-['Rajdhani'] font-bold text-lg ${levelComplete ? "text-[#00D4AA]" : "text-[#e0e8f0]"}`}>
                        Level {lvl}
                      </span>
                      {levelComplete && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                      {d1Selected && <span className="text-xs text-[#8aa0b8] hidden sm:inline">{d1Selected}</span>}
                      {d2Selected && <span className="text-xs text-[#8aa0b8] hidden sm:inline">+ {d2Selected}</span>}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a9ab8" strokeWidth="2"
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4">
                      {[domain1, domain2].map(domain => {
                        const cards = DOMAIN_CARDS.filter(c => c.domain === domain && c.level === lvl);
                        const selectedName = domainCardStatus.perLevel[lvl]?.[domain];
                        return (
                          <div key={domain}>
                            <div className="text-xs font-bold text-[#6B21A8] uppercase tracking-wider mb-2">{domain}</div>
                            <div className="space-y-2">
                              {cards.map(card => (
                                <DomainCard
                                  key={card.name}
                                  card={card}
                                  isSelected={character.domainCards.includes(card.name)}
                                  isDimmed={!!selectedName && selectedName !== card.name}
                                  onClick={() => toggleDomainCard(card)}
                                  onDetail={() => setDetailCard(card)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {domainCardStatus.complete ? (
              <div className="p-3 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-center">
                <span className="text-sm text-[#00D4AA] font-semibold">
                  All {requiredCardCount} domain cards selected — proceed to the next step.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#1a2744]/50 border border-[#1a2744] text-center">
                <span className="text-sm text-[#4a6a8a]">
                  Select {requiredCardCount - character.domainCards.length} more card{requiredCardCount - character.domainCards.length !== 1 ? "s" : ""} to continue.
                </span>
              </div>
            )}
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
              <p className="text-[#7a9ab8] text-sm">
                Select one armor and up to 2 weapons. Showing <strong className="text-[#c084fc]">Tier {tier}</strong> gear for Level {character.level}.
              </p>
            </div>

            {/* Armor */}
            <div>
              <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0] mb-2">
                Armor <span className="text-sm font-normal text-[#4a6a8a]">Tier {tier}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {filteredArmor.map(a => (
                  <SelectionCard
                    key={a.name}
                    title={a.name}
                    subtitle={`${a.type} Armor`}
                    selected={character.armor === a.name}
                    onClick={() => update({ armor: a.name })}
                  >
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">AS {a.armorScore}</span>
                      <span className="bg-[#1a2744] text-[#7a9ab8] px-2 py-0.5 rounded">
                        Evasion {a.evasionMod >= 0 ? `+${a.evasionMod}` : a.evasionMod}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1 text-xs text-[#4a6a8a]">
                      <span>Minor {a.minor}+</span>
                      <span>Major {a.major}+</span>
                      <span>Severe {a.severe}+</span>
                    </div>
                  </SelectionCard>
                ))}
              </div>
            </div>

            {/* Weapons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-['Rajdhani'] text-lg font-bold text-[#e0e8f0]">
                  Weapons <span className="text-sm font-normal text-[#7a9ab8]">(select up to 2)</span>
                  <span className="text-sm font-normal text-[#4a6a8a] ml-2">Tier {tier}</span>
                </h3>
                <div className="flex gap-1 flex-wrap">
                  {weaponTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setWeaponFilter(t)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        weaponFilter === t
                          ? "bg-[#00D4AA] text-[#0B1120] font-bold"
                          : "bg-[#1a2744] text-[#7a9ab8] hover:bg-[#2a4060]"
                      }`}
                    >
                      {t === "all" ? "All" : t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredWeapons.map(w => {
                  const isSelected = character.weapons.includes(w.name);
                  return (
                    <SelectionCard
                      key={w.name}
                      title={w.name}
                      subtitle={`${w.type} · ${w.trait} · ${w.burden}`}
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
                        {w.origin && <span className="bg-[#6B21A8]/20 text-[#c084fc] px-2 py-0.5 rounded">{w.origin}</span>}
                      </div>
                      {w.feature && <div className="text-xs text-[#6a8aa8] mt-1">{w.feature}</div>}
                    </SelectionCard>
                  );
                })}
              </div>
              {filteredWeapons.length === 0 && (
                <div className="text-center py-6 text-[#4a6a8a] text-sm">No weapons match this filter.</div>
              )}
            </div>

            {/* Standard Kit */}
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

      case "review": {
        const reviewCardsByLevel: Record<number, DomainCardEntry[]> = {};
        character.domainCards.forEach(name => {
          const card = DOMAIN_CARDS.find(c => c.name === name);
          if (card) {
            if (!reviewCardsByLevel[card.level]) reviewCardsByLevel[card.level] = [];
            reviewCardsByLevel[card.level].push(card);
          }
        });

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
                  <div className="text-sm text-[#7a9ab8]">
                    Level <span className="text-[#00D4AA] font-bold text-lg">{character.level}</span>
                    <span className="text-xs text-[#4a6a8a] ml-1">Tier {tier}</span>
                  </div>
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

              {/* Combat Stats with tier-aware values */}
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">HP</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">{tierStats?.hp ?? character.gameClass?.hp ?? "—"}</div>
                </div>
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">Evasion</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {tierStats ? tierStats.evasion + (ARMOR_OPTIONS.find(a => a.name === character.armor)?.evasionMod || 0) : "—"}
                  </div>
                </div>
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">Armor</div>
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {ARMOR_OPTIONS.find(a => a.name === character.armor)?.armorScore || "—"}
                  </div>
                </div>
                <div className="text-center p-3 rounded bg-[#0B1120] border border-[#1a2744]">
                  <div className="text-xs text-[#4a6a8a] uppercase">Stress</div>
                  <div className="text-2xl font-bold text-[#f59e0b]">{tierStats?.stressSlots ?? "—"}</div>
                </div>
              </div>

              {/* Damage Thresholds */}
              {tierStats && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded bg-[#0B1120] border border-[#f59e0b]/20">
                    <div className="text-[10px] text-[#f59e0b] uppercase font-bold">Minor</div>
                    <div className="text-lg font-bold text-[#fbbf24]">{tierStats.minor}+</div>
                  </div>
                  <div className="text-center p-2 rounded bg-[#0B1120] border border-[#ef4444]/20">
                    <div className="text-[10px] text-[#ef4444] uppercase font-bold">Major</div>
                    <div className="text-lg font-bold text-[#f87171]">{tierStats.major}+</div>
                  </div>
                  <div className="text-center p-2 rounded bg-[#0B1120] border border-[#dc2626]/30">
                    <div className="text-[10px] text-[#dc2626] uppercase font-bold">Severe</div>
                    <div className="text-lg font-bold text-[#ef4444]">{tierStats.severe}+</div>
                  </div>
                </div>
              )}

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

              {/* Domain Cards grouped by level */}
              {character.domainCards.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-[#4a6a8a] uppercase tracking-wider">Domain Cards ({character.domainCards.length} total)</span>
                  <div className="mt-2 space-y-3">
                    {Object.keys(reviewCardsByLevel).sort((a, b) => Number(a) - Number(b)).map(lvl => (
                      <div key={lvl}>
                        <div className="text-xs font-semibold text-[#6a8aa8] mb-1.5 uppercase tracking-wider">Level {lvl}</div>
                        <div className="space-y-2">
                          {reviewCardsByLevel[Number(lvl)].map(card => {
                            const typeColor = card.type === "Passive" ? "bg-[#22c55e]/15 text-[#4ade80]" :
                              card.type === "Reaction" ? "bg-[#f59e0b]/15 text-[#fbbf24]" :
                              "bg-[#3b82f6]/15 text-[#60a5fa]";
                            const costColor = card.cost.includes("Hope") ? "text-[#00D4AA]" :
                              card.cost.includes("Stress") ? "text-[#f87171]" : "text-[#7a9ab8]";
                            return (
                              <button
                                key={card.name}
                                onClick={() => setDetailCard(card)}
                                className="w-full text-left p-2.5 rounded-lg bg-[#0B1120]/60 border border-[#1a2744] hover:border-[#2a4060] transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${typeColor}`}>{card.type}</span>
                                  <span className="text-sm font-bold text-[#e0e8f0] font-['Rajdhani']">{card.name}</span>
                                  <span className="text-[10px] text-[#6B21A8] bg-[#6B21A8]/20 px-1.5 py-0.5 rounded">{card.domain}</span>
                                  <span className="text-[10px] text-[#4a6a8a] ml-auto">tap for details</span>
                                </div>
                                {card.cost !== "\u2014" && <div className={`text-xs font-semibold mb-0.5 ${costColor}`}>{card.cost}</div>}
                                <div className="text-xs text-[#8aa0b8] line-clamp-2">{card.effect}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
                  {character.subclass && (
                    <>
                      <div><span className="text-[#00D4AA]">{character.subclass.foundation.name}:</span> {character.subclass.foundation.effect}</div>
                      {character.level >= 3 && <div><span className="text-[#c084fc]">{character.subclass.specialization.name}:</span> {character.subclass.specialization.effect}</div>}
                      {character.level >= 7 && <div><span className="text-[#c084fc]">{character.subclass.mastery.name}:</span> {character.subclass.mastery.effect}</div>}
                    </>
                  )}
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
                  const exportData = {
                    ...character,
                    tier,
                    tierStats,
                    domainCards: character.domainCards.map(name => {
                      const card = DOMAIN_CARDS.find(c => c.name === name);
                      return card ? { name: card.name, domain: card.domain, level: card.level, type: card.type, cost: card.cost, effect: card.effect } : name;
                    })
                  };
                  const json = JSON.stringify(exportData, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${character.name || "character"}_nexus9_lv${character.level}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-3 rounded-lg border-2 border-[#00D4AA] text-[#00D4AA] font-['Rajdhani'] font-bold text-lg hover:bg-[#00D4AA]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export JSON
              </button>
              <button
                onClick={() => setShowGallery(true)}
                className="py-3 px-6 rounded-lg border-2 border-[#6B21A8]/40 text-[#c084fc] font-['Rajdhani'] font-bold hover:bg-[#6B21A8]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                Gallery
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

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
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-1.5 text-[#7a9ab8] hover:text-[#c084fc] transition-colors text-sm"
            title="Saved Characters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            <span className="hidden sm:inline">{gallery.length} Saved</span>
          </button>
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

      {/* Content */}
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

      {/* Footer Nav */}
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

      {/* Modals */}
      <AnimatePresence>
        {showGallery && (
          <CharacterGallery
            gallery={gallery}
            activeId={activeCharId}
            onLoad={loadCharacter}
            onDelete={deleteCharacter}
            onNew={createNewCharacter}
            onClose={() => setShowGallery(false)}
          />
        )}
        {detailCard && (
          <DomainCardModal card={detailCard} onClose={() => setDetailCard(null)} />
        )}
      </AnimatePresence>

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
