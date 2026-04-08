/**
 * GM Encounter Builder — Interactive tool for building balanced encounters
 * Design: Station Terminal aesthetic, matching the book's visual language
 * 
 * Mechanics:
 * - Party Level determines Fear Budget
 * - Difficulty (Easy/Standard/Hard/Deadly) scales the budget
 * - Adversaries are drawn from Book Six stat blocks
 * - Fear Budget = Party Level × Difficulty Multiplier × Party Size modifier
 * - Each adversary costs Fear based on Tier: T1=1, T2=2, T3=4, T4=8
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, Plus, Minus, Shield, Swords, AlertTriangle, Skull, Users, Zap, Info } from "lucide-react";

// ─── Adversary Database (from Book Six corrected stat blocks) ─────────────────

interface Adversary {
  name: string;
  faction: string;
  tier: number;
  type: string;
  difficulty: number;
  hp: number;
  fearCost: number;
  signature: string; // one-line description of their threat
}

const ADVERSARY_DB: Adversary[] = [
  // Kaelen Syndicate
  { name: "Syndicate Enforcer", faction: "Kaelen Syndicate", tier: 1, type: "Minion", difficulty: 12, hp: 3, fearCost: 1, signature: "Cheap muscle, swarms in numbers" },
  { name: "Syndicate Fixer", faction: "Kaelen Syndicate", tier: 1, type: "Support", difficulty: 13, hp: 4, fearCost: 1, signature: "Buffs allies, debuffs PCs" },
  { name: "Syndicate Breacher", faction: "Kaelen Syndicate", tier: 2, type: "Bruiser", difficulty: 14, hp: 6, fearCost: 2, signature: "Heavy hitter, breaches cover" },
  { name: "Syndicate Cleaner", faction: "Kaelen Syndicate", tier: 3, type: "Skulk", difficulty: 16, hp: 8, fearCost: 4, signature: "Assassin, high single-target damage" },
  { name: "Syndicate Overlord", faction: "Kaelen Syndicate", tier: 4, type: "Boss", difficulty: 18, hp: 12, fearCost: 8, signature: "Commands minions, Fear Moves" },
  
  // Aurelian Empire
  { name: "Aurelian Legionnaire", faction: "Aurelian Empire", tier: 1, type: "Standard", difficulty: 13, hp: 4, fearCost: 1, signature: "Disciplined soldier, fights in formation" },
  { name: "Aurelian Centurion", faction: "Aurelian Empire", tier: 2, type: "Leader", difficulty: 15, hp: 6, fearCost: 2, signature: "Buffs Legionnaires, tactical commands" },
  { name: "Aurelian Praetorian Guard", faction: "Aurelian Empire", tier: 3, type: "Solo", difficulty: 17, hp: 9, fearCost: 4, signature: "Elite bodyguard, heavy armor" },
  { name: "Aurelian War-Priest", faction: "Aurelian Empire", tier: 3, type: "Leader", difficulty: 16, hp: 8, fearCost: 4, signature: "Healer and buffer for Imperial forces" },
  
  // Mindclave
  { name: "Mindclave Hound", faction: "Mindclave", tier: 1, type: "Skulk", difficulty: 12, hp: 3, fearCost: 1, signature: "Psychic tracker, flanker" },
  { name: "Mindclave Inquisitor", faction: "Mindclave", tier: 2, type: "Support", difficulty: 14, hp: 5, fearCost: 2, signature: "Psychic interrogator, mind control" },
  { name: "Mindclave Handler", faction: "Mindclave", tier: 3, type: "Leader", difficulty: 16, hp: 8, fearCost: 4, signature: "Commands Hounds, Command Thrall" },
  { name: "Mindclave High Councilor", faction: "Mindclave", tier: 4, type: "Boss", difficulty: 18, hp: 12, fearCost: 8, signature: "Mass telepathy, Fear Moves" },
  
  // Valari Collective
  { name: "Valari Skirmisher", faction: "Valari Collective", tier: 1, type: "Standard", difficulty: 13, hp: 4, fearCost: 1, signature: "Fast melee fighter" },
  { name: "Valari Templar", faction: "Valari Collective", tier: 2, type: "Bruiser", difficulty: 15, hp: 7, fearCost: 2, signature: "Heavy melee, sacred rage" },
  { name: "Valari Blademaster", faction: "Valari Collective", tier: 3, type: "Solo", difficulty: 17, hp: 9, fearCost: 4, signature: "Duelist, devastating single-target" },
  
  // Terran Republic
  { name: "Terran Marine", faction: "Terran Republic", tier: 1, type: "Standard", difficulty: 13, hp: 4, fearCost: 1, signature: "Reliable ranged soldier" },
  { name: "Terran Special Forces Operative", faction: "Terran Republic", tier: 2, type: "Skulk", difficulty: 15, hp: 5, fearCost: 2, signature: "Stealth specialist, ambusher" },
  { name: "Terran Heavy Assault Trooper", faction: "Terran Republic", tier: 3, type: "Solo", difficulty: 16, hp: 10, fearCost: 4, signature: "Powered exoskeleton, missile barrage" },
  
  // Eclipse-Touched
  { name: "Eclipse Void-Spawn", faction: "Eclipse", tier: 1, type: "Minion", difficulty: 11, hp: 2, fearCost: 1, signature: "Expendable swarm creature" },
  { name: "Eclipse Void-Stalker", faction: "Eclipse", tier: 2, type: "Skulk", difficulty: 14, hp: 5, fearCost: 2, signature: "Psychic ambusher, phase shift" },
  { name: "Eclipse Void-Caller", faction: "Eclipse", tier: 2, type: "Leader", difficulty: 15, hp: 7, fearCost: 2, signature: "Summons Void-Spawn, psychic attacks" },
  { name: "Eclipse Void-Shape", faction: "Eclipse", tier: 4, type: "Boss", difficulty: 19, hp: 15, fearCost: 8, signature: "Reality-warping entity" },
  { name: "The Eclipse Overmind", faction: "Eclipse", tier: 4, type: "Legendary Boss", difficulty: 20, hp: 15, fearCost: 12, signature: "Final boss, Legendary Actions" },
  
  // Station / Automated
  { name: "Station Security Drone", faction: "Nexus 9 Station", tier: 1, type: "Minion", difficulty: 11, hp: 2, fearCost: 1, signature: "Automated, hackable" },
  
  // Named Villains
  { name: "The Whisperer", faction: "Eclipse (Named)", tier: 4, type: "Boss", difficulty: 19, hp: 15, fearCost: 10, signature: "Primary Eclipse agent, Dominate, Reality Blur" },
  
  // Progenitor
  { name: "Progenitor Sentinel", faction: "Progenitor", tier: 3, type: "Bruiser", difficulty: 16, hp: 10, fearCost: 4, signature: "Ancient machine, adaptive shielding" },
  
  // Pirates & Rogues
  { name: "Void Pirate Raider", faction: "Pirates", tier: 1, type: "Standard", difficulty: 12, hp: 3, fearCost: 1, signature: "Aggressive, Bloodlust" },
  { name: "Void Pirate Captain", faction: "Pirates", tier: 2, type: "Leader", difficulty: 15, hp: 6, fearCost: 2, signature: "Commands raiders, boarding actions" },
  { name: "Rogue Technoseer", faction: "Rogue Technoseers", tier: 2, type: "Support", difficulty: 14, hp: 5, fearCost: 2, signature: "Tech sabotage, drone control" },
  
  // Creatures
  { name: "Void Leech", faction: "Creatures", tier: 1, type: "Minion", difficulty: 10, hp: 2, fearCost: 1, signature: "Attaches, drains HP" },
  { name: "Nebula Stalker", faction: "Creatures", tier: 2, type: "Skulk", difficulty: 14, hp: 5, fearCost: 2, signature: "Ambush predator, camouflage" },
  
  // Ship-Scale
  { name: "Eclipse Fighter Wing", faction: "Eclipse (Ship)", tier: 2, type: "Standard (Ship)", difficulty: 14, hp: 4, fearCost: 2, signature: "Swarm tactics, kamikaze" },
  { name: "Eclipse Capital Ship", faction: "Eclipse (Ship)", tier: 4, type: "Boss (Ship)", difficulty: 18, hp: 12, fearCost: 8, signature: "Regenerating hull, gravity tether" },
];

// ─── Difficulty Tiers ─────────────────────────────────────────────────────────

const DIFFICULTY_TIERS = [
  { label: "Easy", multiplier: 0.5, icon: Shield, color: "text-emerald-400", bgColor: "bg-emerald-900/30", borderColor: "border-emerald-700/50", description: "A warm-up. PCs should win without spending major resources." },
  { label: "Standard", multiplier: 1.0, icon: Swords, color: "text-cyan-400", bgColor: "bg-cyan-900/30", borderColor: "border-cyan-700/50", description: "A fair fight. PCs will need to use abilities and spend some Hope." },
  { label: "Hard", multiplier: 1.5, icon: AlertTriangle, color: "text-amber-400", bgColor: "bg-amber-900/30", borderColor: "border-amber-700/50", description: "Dangerous. PCs may need to retreat or sacrifice resources." },
  { label: "Deadly", multiplier: 2.0, icon: Skull, color: "text-red-400", bgColor: "bg-red-900/30", borderColor: "border-red-700/50", description: "Potentially lethal. Death Moves are likely. Use sparingly." },
];

// ─── Fear Budget Calculation ──────────────────────────────────────────────────

function calculateFearBudget(partyLevel: number, partySize: number, difficultyMultiplier: number): number {
  // Base budget = party level × 2, scaled by difficulty and party size
  const base = partyLevel * 2;
  const sizeModifier = partySize >= 5 ? 1.25 : partySize <= 3 ? 0.75 : 1.0;
  return Math.round(base * difficultyMultiplier * sizeModifier);
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [searchQuery, setSearchQuery] = useState("");

  const difficulty = DIFFICULTY_TIERS[difficultyIdx];
  const fearBudget = calculateFearBudget(partyLevel, partySize, difficulty.multiplier);

  const totalFearSpent = useMemo(
    () => selected.reduce((sum, s) => sum + s.adversary.fearCost * s.count, 0),
    [selected]
  );

  const fearRemaining = fearBudget - totalFearSpent;

  const factions = useMemo(() => {
    const set = new Set(ADVERSARY_DB.map((a) => a.faction));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const filteredAdversaries = useMemo(() => {
    return ADVERSARY_DB.filter((a) => {
      if (factionFilter !== "all" && a.faction !== factionFilter) return false;
      if (tierFilter > 0 && a.tier !== tierFilter) return false;
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [factionFilter, tierFilter, searchQuery]);

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

  const clearAll = useCallback(() => setSelected([]), []);

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

  // Tier color helper
  const tierColor = (tier: number) => {
    switch (tier) {
      case 1: return "bg-emerald-800/40 text-emerald-300 border-emerald-700/50";
      case 2: return "bg-cyan-800/40 text-cyan-300 border-cyan-700/50";
      case 3: return "bg-amber-800/40 text-amber-300 border-amber-700/50";
      case 4: return "bg-red-800/40 text-red-300 border-red-700/50";
      default: return "bg-gray-800/40 text-gray-300 border-gray-700/50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-200">
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
          <span className="text-xs text-gray-500 font-mono">NEXUS 9 — THE FRAYING DARK</span>
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
                      <span className="text-xs text-gray-500 ml-auto">×{tier.multiplier}</span>
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
              {partySize} PCs × Level {partyLevel} × {difficulty.label} ({difficulty.multiplier}×)
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
            </div>
          )}
        </div>

        {/* ─── Right Column: Adversary Browser & Selected ─── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Selected Adversaries */}
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
                  <div
                    key={s.adversary.name}
                    className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3"
                  >
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${tierColor(s.adversary.tier)}`}>
                      T{s.adversary.tier}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate">{s.adversary.name}</p>
                      <p className="text-xs text-gray-500">{s.adversary.faction} · {s.adversary.type}</p>
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
                    </div>
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
              Adversary Browser
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
                {factions.map((f) => (
                  <option key={f} value={f}>
                    {f === "all" ? "All Factions" : f}
                  </option>
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
            </div>

            {/* Adversary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredAdversaries.map((a) => (
                <button
                  key={a.name}
                  onClick={() => addAdversary(a)}
                  className="text-left bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 hover:border-cyan-700/50 hover:bg-cyan-900/10 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${tierColor(a.tier)}`}>
                      T{a.tier}
                    </span>
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors truncate">
                      {a.name}
                    </span>
                    <span className="text-xs text-gray-600 ml-auto font-mono whitespace-nowrap">{a.fearCost} Fear</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{a.faction}</span>
                    <span>·</span>
                    <span>{a.type}</span>
                    <span>·</span>
                    <span>Diff {a.difficulty}</span>
                    <span>·</span>
                    <span>{a.hp} HP</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 italic">{a.signature}</p>
                </button>
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
              Fear Budget Quick Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 text-gray-400 font-normal">Adversary Tier</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Fear Cost</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Typical HP</th>
                    <th className="text-center py-2 text-gray-400 font-normal">Typical Difficulty</th>
                    <th className="text-left py-2 text-gray-400 font-normal">Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(1)}`}>Tier 1</span></td>
                    <td className="text-center font-mono text-gray-300">1</td>
                    <td className="text-center font-mono text-gray-300">2–4</td>
                    <td className="text-center font-mono text-gray-300">10–13</td>
                    <td className="text-gray-400">Minions, fodder, swarm encounters</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(2)}`}>Tier 2</span></td>
                    <td className="text-center font-mono text-gray-300">2</td>
                    <td className="text-center font-mono text-gray-300">5–7</td>
                    <td className="text-center font-mono text-gray-300">14–15</td>
                    <td className="text-gray-400">Standard threats, lieutenants</td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(3)}`}>Tier 3</span></td>
                    <td className="text-center font-mono text-gray-300">4</td>
                    <td className="text-center font-mono text-gray-300">8–10</td>
                    <td className="text-center font-mono text-gray-300">16–17</td>
                    <td className="text-gray-400">Elite enemies, mini-bosses</td>
                  </tr>
                  <tr>
                    <td className="py-2"><span className={`font-mono px-1.5 py-0.5 rounded border ${tierColor(4)}`}>Tier 4</span></td>
                    <td className="text-center font-mono text-gray-300">8–12</td>
                    <td className="text-center font-mono text-gray-300">12–15</td>
                    <td className="text-center font-mono text-gray-300">18–20</td>
                    <td className="text-gray-400">Bosses, campaign villains</td>
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
