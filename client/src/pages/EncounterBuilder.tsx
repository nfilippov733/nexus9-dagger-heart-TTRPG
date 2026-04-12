/**
 * GM Encounter Builder — Interactive tool for building balanced encounters
 * Design: Station Terminal aesthetic, matching the book's visual language
 * 
 * v2.0 — Full stat block display with features, Fear Moves, and expandable cards
 * 
 * Mechanics:
 * - Party Level determines Fear Budget
 * - Difficulty (Easy/Standard/Hard/Deadly) scales the budget
 * - Adversaries are drawn from the complete adversaryData database
 * - Fear Budget = Party Level × Difficulty Multiplier × Party Size modifier
 * - Each adversary costs Fear based on Tier: T1=1, T2=2, T3=4, T4=8+
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, Shield, Swords,
  AlertTriangle, Skull, Users, Zap, Info, Heart, Target, Eye,
  Flame, Brain, Crosshair, Copy, X
} from "lucide-react";
import { ADVERSARY_DB, ALL_FACTIONS, type Adversary, type AdversaryFeature, type FearMove } from "../data/adversaryData";
import { ADVERSARY_IMAGE_MAP } from "../data/images";

// Helper to find adversary image by name
function getAdversaryImage(name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(ADVERSARY_IMAGE_MAP)) {
    if (lower.includes(key)) return url;
  }
  return undefined;
}

// ─── Difficulty Tiers ─────────────────────────────────────────────────────────

const DIFFICULTY_TIERS = [
  { label: "Easy", multiplier: 0.5, icon: Shield, color: "text-emerald-400", bgColor: "bg-emerald-900/30", borderColor: "border-emerald-700/50", description: "A warm-up. PCs should win without spending major resources." },
  { label: "Standard", multiplier: 1.0, icon: Swords, color: "text-cyan-400", bgColor: "bg-cyan-900/30", borderColor: "border-cyan-700/50", description: "A fair fight. PCs will need to use abilities and spend some Hope." },
  { label: "Hard", multiplier: 1.5, icon: AlertTriangle, color: "text-amber-400", bgColor: "bg-amber-900/30", borderColor: "border-amber-700/50", description: "Dangerous. PCs may need to retreat or sacrifice resources." },
  { label: "Deadly", multiplier: 2.0, icon: Skull, color: "text-red-400", bgColor: "bg-red-900/30", borderColor: "border-red-700/50", description: "Potentially lethal. Death Moves are likely. Use sparingly." },
];

// ─── Fear Budget Calculation ──────────────────────────────────────────────────

function calculateFearBudget(partyLevel: number, partySize: number, difficultyMultiplier: number): number {
  const base = partyLevel * 2;
  const sizeModifier = partySize >= 5 ? 1.25 : partySize <= 3 ? 0.75 : 1.0;
  return Math.round(base * difficultyMultiplier * sizeModifier);
}

// ─── Tier Color Helper ───────────────────────────────────────────────────────

function tierColor(tier: number): string {
  switch (tier) {
    case 1: return "bg-emerald-800/40 text-emerald-300 border-emerald-700/50";
    case 2: return "bg-cyan-800/40 text-cyan-300 border-cyan-700/50";
    case 3: return "bg-amber-800/40 text-amber-300 border-amber-700/50";
    case 4: return "bg-red-800/40 text-red-300 border-red-700/50";
    default: return "bg-gray-800/40 text-gray-300 border-gray-700/50";
  }
}

function tierAccent(tier: number): string {
  switch (tier) {
    case 1: return "border-emerald-700/50";
    case 2: return "border-cyan-700/50";
    case 3: return "border-amber-700/50";
    case 4: return "border-red-700/50";
    default: return "border-gray-700/50";
  }
}

function featureTypeColor(type: AdversaryFeature["type"]): string {
  switch (type) {
    case "Passive": return "bg-blue-900/40 text-blue-300 border-blue-700/50";
    case "Action": return "bg-amber-900/40 text-amber-300 border-amber-700/50";
    case "Reaction": return "bg-purple-900/40 text-purple-300 border-purple-700/50";
    case "Movement": return "bg-emerald-900/40 text-emerald-300 border-emerald-700/50";
  }
}

// ─── Stat Block Modal Component ──────────────────────────────────────────────

function StatBlockModal({ adversary, onClose }: { adversary: Adversary; onClose: () => void }) {
  const copyStatBlock = () => {
    const text = [
      `# ${adversary.name}`,
      `*${adversary.faction} — ${adversary.type} (Tier ${adversary.tier})*`,
      ``,
      `**HP:** ${adversary.hp} | **Evasion:** ${adversary.evasion} | **Difficulty:** ${adversary.difficulty}`,
      `**Attack:** +${adversary.attackMod} | **Damage:** ${adversary.damage} ${adversary.damageType}`,
      `**Thresholds:** Major ${adversary.thresholds.major} / Severe ${adversary.thresholds.severe}`,
      `**Fear Cost:** ${adversary.fearCost}${adversary.stressInflict > 0 ? ` | **Stress:** ${adversary.stressInflict}` : ""}`,
      ``,
      adversary.description,
      ``,
      `## Features`,
      ...adversary.features.map(f => `- **${f.name}** (${f.type}): ${f.description}`),
      ...(adversary.fearMoves.length > 0 ? [
        ``,
        `## Fear Moves`,
        ...adversary.fearMoves.map(fm => `- **${fm.name}** (${fm.fearCost} Fear): ${fm.description}`),
      ] : []),
    ].join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-[#0d1220] border-2 ${tierAccent(adversary.tier)} rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-[#0d1220] border-b ${tierAccent(adversary.tier)} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const img = getAdversaryImage(adversary.name);
                return img ? (
                  <img src={img} alt={adversary.name} className="w-12 h-12 rounded-lg object-cover border border-gray-700" />
                ) : null;
              })()}
              <span className={`text-xs font-mono px-2 py-1 rounded border ${tierColor(adversary.tier)}`}>
                T{adversary.tier}
              </span>
              <div>
                <h2 className="font-['Rajdhani',sans-serif] text-xl font-bold text-gray-100">{adversary.name}</h2>
                <p className="text-xs text-gray-400">{adversary.faction} — {adversary.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyStatBlock}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                title="Copy stat block as Markdown"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-red-900/30 hover:border-red-700/50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Portrait + Lore */}
          {(() => {
            const img = getAdversaryImage(adversary.name);
            return img ? (
              <div className="flex gap-4">
                <img src={img} alt={adversary.name} className="w-32 h-32 rounded-lg object-cover border border-gray-700 flex-shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-gray-700 pl-4">
                  {adversary.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-gray-700 pl-4">
                {adversary.description}
              </p>
            );
          })()}

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
              <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">HP</p>
              <p className="font-mono text-lg font-bold text-red-300">{adversary.hp}</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
              <Eye className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Evasion</p>
              <p className="font-mono text-lg font-bold text-cyan-300">{adversary.evasion}</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
              <Crosshair className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Attack</p>
              <p className="font-mono text-lg font-bold text-amber-300">+{adversary.attackMod}</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-center">
              <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Difficulty</p>
              <p className="font-mono text-lg font-bold text-purple-300">{adversary.difficulty}</p>
            </div>
          </div>

          {/* Damage & Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Damage</p>
              </div>
              <p className="font-mono text-base text-orange-300">{adversary.damage} <span className="text-gray-500">{adversary.damageType}</span></p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Thresholds</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500">Major</p>
                  <p className="font-mono text-base text-amber-300">{adversary.thresholds.major}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Severe</p>
                  <p className="font-mono text-base text-red-300">{adversary.thresholds.severe}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stress & Fear Cost */}
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <Zap className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Fear Cost</p>
                <p className="font-mono text-sm font-bold text-red-300">{adversary.fearCost}</p>
              </div>
            </div>
            {adversary.stressInflict > 0 && (
              <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
                <Brain className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Stress Inflict</p>
                  <p className="font-mono text-sm font-bold text-purple-300">{adversary.stressInflict}</p>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <h3 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">
              Features
            </h3>
            <div className="space-y-2">
              {adversary.features.map((f, i) => (
                <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${featureTypeColor(f.type)}`}>
                      {f.type}
                    </span>
                    <span className="text-sm font-semibold text-gray-200">{f.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fear Moves */}
          {adversary.fearMoves.length > 0 && (
            <div>
              <h3 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-red-400 uppercase mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Fear Moves
              </h3>
              <div className="space-y-2">
                {adversary.fearMoves.map((fm, i) => (
                  <div key={i} className="bg-red-900/10 border border-red-900/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-red-900/40 text-red-300 border-red-700/50">
                        {fm.fearCost} Fear
                      </span>
                      <span className="text-sm font-semibold text-red-200">{fm.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{fm.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline Stat Block (for Encounter Roster) ───────────────────────────────

function InlineStatBlock({ adversary }: { adversary: Adversary }) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
      {/* Quick stats row */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-red-300">HP {adversary.hp}</span>
        <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-cyan-300">Eva {adversary.evasion}</span>
        <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-amber-300">+{adversary.attackMod} Atk</span>
        <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-orange-300">{adversary.damage}</span>
        <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-gray-400">Maj {adversary.thresholds.major} / Sev {adversary.thresholds.severe}</span>
      </div>
      {/* Features summary */}
      <div className="space-y-1">
        {adversary.features.map((f, i) => (
          <p key={i} className="text-xs text-gray-400">
            <span className={`inline-block text-[9px] font-mono px-1 py-0 rounded mr-1 ${featureTypeColor(f.type)}`}>{f.type[0]}</span>
            <span className="text-gray-300 font-medium">{f.name}:</span> {f.description.length > 100 ? f.description.slice(0, 100) + "…" : f.description}
          </p>
        ))}
      </div>
      {/* Fear Moves summary */}
      {adversary.fearMoves.length > 0 && (
        <div className="space-y-1">
          {adversary.fearMoves.map((fm, i) => (
            <p key={i} className="text-xs text-red-400/80">
              <span className="font-mono text-[9px] bg-red-900/30 px-1 rounded mr-1">{fm.fearCost}F</span>
              <span className="text-red-300 font-medium">{fm.name}:</span> {fm.description.length > 80 ? fm.description.slice(0, 80) + "…" : fm.description}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface SelectedAdversary {
  adversary: Adversary;
  count: number;
}

export default function EncounterBuilder() {
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize] = useState(4);
  const [difficultyIdx, setDifficultyIdx] = useState(1);
  const [selected, setSelected] = useState<SelectedAdversary[]>([]);
  const [factionFilter, setFactionFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRoster, setExpandedRoster] = useState<Set<string>>(new Set());
  const [modalAdversary, setModalAdversary] = useState<Adversary | null>(null);

  const difficulty = DIFFICULTY_TIERS[difficultyIdx];
  const fearBudget = calculateFearBudget(partyLevel, partySize, difficulty.multiplier);

  const totalFearSpent = useMemo(
    () => selected.reduce((sum, s) => sum + s.adversary.fearCost * s.count, 0),
    [selected]
  );

  const fearRemaining = fearBudget - totalFearSpent;

  const allTypes = useMemo(() => {
    const set = new Set(ADVERSARY_DB.map(a => a.type));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const filteredAdversaries = useMemo(() => {
    return ADVERSARY_DB.filter((a) => {
      if (factionFilter !== "all" && a.faction !== factionFilter) return false;
      if (tierFilter > 0 && a.tier !== tierFilter) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return a.name.toLowerCase().includes(q) ||
          a.faction.toLowerCase().includes(q) ||
          a.signature.toLowerCase().includes(q) ||
          a.features.some(f => f.name.toLowerCase().includes(q));
      }
      return true;
    });
  }, [factionFilter, tierFilter, typeFilter, searchQuery]);

  const addAdversary = useCallback((adversary: Adversary) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.adversary.name === adversary.name);
      if (existing) {
        return prev.map((s) =>
          s.adversary.name === adversary.name ? { ...s, count: s.count + 1 } : s
        );
      }
      return [...prev, { adversary, count: 1 }];
    });
  }, []);

  const removeAdversary = useCallback((name: string) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.adversary.name === name);
      if (existing && existing.count > 1) {
        return prev.map((s) =>
          s.adversary.name === name ? { ...s, count: s.count - 1 } : s
        );
      }
      return prev.filter((s) => s.adversary.name !== name);
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelected([]);
    setExpandedRoster(new Set());
  }, []);

  const toggleRosterExpand = useCallback((name: string) => {
    setExpandedRoster(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Encounter assessment
  const assessment = useMemo(() => {
    if (selected.length === 0) return null;
    const ratio = totalFearSpent / fearBudget;
    if (ratio <= 0.5) return { label: "Trivial", color: "text-gray-400", note: "This encounter poses little threat. Consider adding more adversaries." };
    if (ratio <= 0.8) return { label: "Easy", color: "text-emerald-400", note: "A manageable fight. Good for opening encounters or resource-drain." };
    if (ratio <= 1.1) return { label: "Balanced", color: "text-cyan-400", note: "Well-balanced for the selected difficulty. Good encounter." };
    if (ratio <= 1.4) return { label: "Tough", color: "text-amber-400", note: "Above budget. PCs will be pushed hard. Ensure they have resources." };
    return { label: "Overwhelming", color: "text-red-400", note: "Significantly over budget. Risk of TPK. Use only for climactic moments." };
  }, [totalFearSpent, fearBudget, selected.length]);

  // Total stress potential
  const totalStress = useMemo(() => {
    return selected.reduce((sum, s) => sum + s.adversary.stressInflict * s.count, 0);
  }, [selected]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-200">
      {/* Stat Block Modal */}
      {modalAdversary && (
        <StatBlockModal adversary={modalAdversary} onClose={() => setModalAdversary(null)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d1220]/95 backdrop-blur border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Book
            </button>
          </Link>
          <div className="h-5 w-px bg-cyan-900/50" />
          <h1 className="font-['Rajdhani',sans-serif] text-lg font-bold tracking-wide text-cyan-300">
            GM ENCOUNTER BUILDER
          </h1>
          <span className="text-xs text-gray-500 font-mono hidden sm:inline">NEXUS 9 — THE FRAYING DARK</span>
          <span className="ml-auto text-xs text-gray-600 font-mono">{ADVERSARY_DB.length} adversaries</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Column: Party & Difficulty Settings ─── */}
        <div className="lg:col-span-1 space-y-5">
          {/* Party Configuration */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Party Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Party Level</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPartyLevel(Math.max(1, partyLevel - 1))}
                    className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-xl font-bold text-cyan-300 w-8 text-center">{partyLevel}</span>
                  <button
                    onClick={() => setPartyLevel(Math.min(10, partyLevel + 1))}
                    className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Party Size</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPartySize(Math.max(2, partySize - 1))}
                    className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-xl font-bold text-cyan-300 w-8 text-center">{partySize}</span>
                  <button
                    onClick={() => setPartySize(Math.min(7, partySize + 1))}
                    className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Difficulty
            </h2>
            <div className="space-y-2">
              {DIFFICULTY_TIERS.map((tier, idx) => {
                const Icon = tier.icon;
                return (
                  <button
                    key={tier.label}
                    onClick={() => setDifficultyIdx(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      idx === difficultyIdx
                        ? `${tier.bgColor} ${tier.borderColor} ring-1 ring-inset ${tier.borderColor}`
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${idx === difficultyIdx ? tier.color : "text-gray-500"}`} />
                      <span className={`font-['Rajdhani',sans-serif] font-bold text-sm ${idx === difficultyIdx ? tier.color : "text-gray-400"}`}>
                        {tier.label}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">{tier.multiplier}x</span>
                    </div>
                    {idx === difficultyIdx && (
                      <p className="text-xs text-gray-400 mt-1 ml-6">{tier.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fear Budget Display */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">
              Fear Budget
            </h2>
            <div className="flex items-end gap-2 mb-3">
              <span className={`font-mono text-4xl font-bold ${fearRemaining < 0 ? "text-red-400" : fearRemaining === 0 ? "text-amber-400" : "text-cyan-300"}`}>
                {fearRemaining}
              </span>
              <span className="text-gray-500 text-sm mb-1">/ {fearBudget} remaining</span>
            </div>
            {/* Budget bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalFearSpent > fearBudget
                    ? "bg-red-500"
                    : totalFearSpent > fearBudget * 0.8
                    ? "bg-amber-500"
                    : "bg-cyan-500"
                }`}
                style={{ width: `${Math.min(100, (totalFearSpent / fearBudget) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {partySize} PCs x Level {partyLevel} x {difficulty.label} ({difficulty.multiplier}x)
            </p>
          </div>

          {/* Encounter Assessment */}
          {assessment && (
            <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
              <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Assessment
              </h2>
              <p className={`font-['Rajdhani',sans-serif] font-bold text-lg ${assessment.color}`}>
                {assessment.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">{assessment.note}</p>
              {totalStress > 0 && (
                <p className="text-xs text-purple-400 mt-2 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Potential Stress: {totalStress} marks across all adversaries
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─── Right Column: Adversary Browser & Selected ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Selected Adversaries (Encounter Roster) */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                <Swords className="w-4 h-4" /> Encounter Roster
              </h2>
              {selected.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {selected.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-4 text-center">
                Add adversaries from the browser below to build your encounter.
              </p>
            ) : (
              <div className="space-y-2">
                {selected.map((s) => (
                  <div key={s.adversary.name} className={`bg-gray-900/50 border ${tierAccent(s.adversary.tier)} rounded-lg px-4 py-3`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${tierColor(s.adversary.tier)}`}>
                        T{s.adversary.tier}
                      </span>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => toggleRosterExpand(s.adversary.name)}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-200 hover:text-cyan-300 transition-colors"
                        >
                          {s.adversary.name}
                          {expandedRoster.has(s.adversary.name) ? (
                            <ChevronUp className="w-3 h-3 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                        <p className="text-xs text-gray-500">{s.adversary.faction} · {s.adversary.type} · {s.adversary.damage} {s.adversary.damageType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeAdversary(s.adversary.name)}
                          className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-red-900/30 hover:border-red-700/50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-sm font-bold text-cyan-300 w-6 text-center">{s.count}</span>
                        <button
                          onClick={() => addAdversary(s.adversary)}
                          className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-cyan-900/30 hover:border-cyan-700/50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-500 font-mono w-12 text-right">
                          {s.adversary.fearCost * s.count} Fear
                        </span>
                        <button
                          onClick={() => setModalAdversary(s.adversary)}
                          className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-cyan-900/30 hover:border-cyan-700/50 transition-colors"
                          title="View full stat block"
                        >
                          <Info className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    {/* Expandable inline stat block */}
                    {expandedRoster.has(s.adversary.name) && (
                      <InlineStatBlock adversary={s.adversary} />
                    )}
                  </div>
                ))}
                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <span className="text-xs text-gray-400">
                    {selected.reduce((sum, s) => sum + s.count, 0)} adversaries total
                  </span>
                  <span className={`font-mono text-sm font-bold ${totalFearSpent > fearBudget ? "text-red-400" : "text-cyan-300"}`}>
                    {totalFearSpent} / {fearBudget} Fear
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Adversary Browser */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4">
              Adversary Browser ({filteredAdversaries.length} of {ADVERSARY_DB.length})
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Search adversaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-700 transition-colors"
              />
              <select
                value={factionFilter}
                onChange={(e) => setFactionFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-700 transition-colors"
              >
                <option value="all">All Factions</option>
                {ALL_FACTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(Number(e.target.value))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-700 transition-colors"
              >
                <option value={0}>All Tiers</option>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
                <option value={4}>Tier 4</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-700 transition-colors"
              >
                {allTypes.map((t) => (
                  <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>
                ))}
              </select>
            </div>

            {/* Adversary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredAdversaries.map((a) => (
                <div
                  key={a.name}
                  className={`text-left bg-gray-900/50 border ${tierAccent(a.tier)} rounded-lg px-4 py-3 hover:border-cyan-700/50 hover:bg-cyan-900/10 transition-all group`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const img = getAdversaryImage(a.name);
                      return img ? (
                        <img src={img} alt={a.name} className="w-8 h-8 rounded object-cover border border-gray-700 flex-shrink-0" />
                      ) : null;
                    })()}
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${tierColor(a.tier)}`}>
                      T{a.tier}
                    </span>
                    <button
                      onClick={() => setModalAdversary(a)}
                      className="text-sm font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors truncate text-left"
                    >
                      {a.name}
                    </button>
                    <span className="text-xs text-gray-600 ml-auto font-mono whitespace-nowrap">{a.fearCost} Fear</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{a.type}</span>
                    <span>·</span>
                    <span>+{a.attackMod} Atk</span>
                    <span>·</span>
                    <span>{a.damage}</span>
                    <span>·</span>
                    <span>{a.hp} HP</span>
                  </div>
                  <p className="text-xs text-gray-400 italic mb-2">{a.signature}</p>
                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {a.features.map((f, i) => (
                      <span key={i} className={`text-[9px] font-mono px-1 py-0 rounded ${featureTypeColor(f.type)}`}>
                        {f.name}
                      </span>
                    ))}
                    {a.fearMoves.map((fm, i) => (
                      <span key={`fm-${i}`} className="text-[9px] font-mono px-1 py-0 rounded bg-red-900/40 text-red-300 border border-red-700/50">
                        {fm.name}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => addAdversary(a)}
                    className="w-full text-center text-xs py-1.5 rounded bg-cyan-900/20 border border-cyan-800/30 text-cyan-400 hover:bg-cyan-900/40 hover:border-cyan-700/50 transition-colors"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add to Encounter
                  </button>
                </div>
              ))}
            </div>

            {filteredAdversaries.length === 0 && (
              <p className="text-gray-500 text-sm italic py-8 text-center">
                No adversaries match your filters.
              </p>
            )}
          </div>

          {/* Quick Reference */}
          <div className="bg-[#111827] border border-cyan-900/30 rounded-lg p-5">
            <h2 className="font-['Rajdhani',sans-serif] text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">
              Adversary Scaling Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 text-gray-400 font-normal">Tier</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Fear</th>
                    <th className="text-center py-2 text-gray-400 font-normal">HP</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Atk</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Damage</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Diff</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Major</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Severe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(1)}`}>T1</span></td>
                    <td className="text-center font-mono text-gray-300">1</td>
                    <td className="text-center font-mono text-gray-300">2-4</td>
                    <td className="text-center font-mono text-gray-300">+1</td>
                    <td className="text-center font-mono text-gray-300">1d6-1d12</td>
                    <td className="text-center font-mono text-gray-300">10-13</td>
                    <td className="text-center font-mono text-amber-300">7</td>
                    <td className="text-center font-mono text-red-300">12</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(2)}`}>T2</span></td>
                    <td className="text-center font-mono text-gray-300">2</td>
                    <td className="text-center font-mono text-gray-300">5-7</td>
                    <td className="text-center font-mono text-gray-300">+2</td>
                    <td className="text-center font-mono text-gray-300">2d6-2d12</td>
                    <td className="text-center font-mono text-gray-300">14-15</td>
                    <td className="text-center font-mono text-amber-300">10</td>
                    <td className="text-center font-mono text-red-300">20</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(3)}`}>T3</span></td>
                    <td className="text-center font-mono text-gray-300">4</td>
                    <td className="text-center font-mono text-gray-300">8-10</td>
                    <td className="text-center font-mono text-gray-300">+3</td>
                    <td className="text-center font-mono text-gray-300">3d8-3d12</td>
                    <td className="text-center font-mono text-gray-300">16-17</td>
                    <td className="text-center font-mono text-amber-300">20</td>
                    <td className="text-center font-mono text-red-300">32</td>
                  </tr>
                  <tr>
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(4)}`}>T4</span></td>
                    <td className="text-center font-mono text-gray-300">8-12</td>
                    <td className="text-center font-mono text-gray-300">12-15</td>
                    <td className="text-center font-mono text-gray-300">+4</td>
                    <td className="text-center font-mono text-gray-300">4d8-4d12</td>
                    <td className="text-center font-mono text-gray-300">18-20</td>
                    <td className="text-center font-mono text-amber-300">25</td>
                    <td className="text-center font-mono text-red-300">45</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
