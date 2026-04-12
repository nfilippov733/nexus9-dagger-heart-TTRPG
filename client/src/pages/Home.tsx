/**
 * Nexus 9: The Fraying Dark — Interactive Book
 * Design: off-white content + deep space chrome + teal accents
 * Typography: Rajdhani headings, Source Serif 4 body, JetBrains Mono data
 * 
 * Market-standard features:
 * - Enhanced full-text search with highlighting and result counts
 * - Bookmark system with localStorage persistence
 * - Keyboard shortcut overlay (? key)
 * - Reading time estimates per chapter
 * - Accessibility: skip links, ARIA landmarks, focus management
 * - Deep-linking via URL routing
 * - Quick reference panel
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronRight, ChevronDown, Menu, X, BookOpen, ArrowUp, Search, Swords, User, Printer, Moon, Sun, Bookmark, BookmarkCheck, Keyboard, Clock, BookOpenCheck, Dice1 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useParams, useLocation } from "wouter";
import manuscript from "@/data/manuscript.json";
import { IMAGES, BOOK_IMAGES, FACTION_INSIGNIA_MAP, CLASS_PORTRAIT_MAP, RING_IMAGE_MAP } from "@/data/images";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Section { title: string; id: string; content: string; }
interface Chapter { title: string; id: string; content: string; sections: Section[]; }
interface Book { title: string; id: string; chapters: Chapter[]; }
const data = manuscript as { title: string; subtitle: string; books: Book[] };

/* ─── Image Mapping ─── */
const CHAPTER_IMAGES: Record<string, string> = {
  "Elevator Pitch": IMAGES.fullpage.title_page,
  "History of the Known Galaxy": IMAGES.maps.star_map,
  "Culture, Daily Life": IMAGES.halfpage.blue_ring,
  "Technology Principles": IMAGES.halfpage.gold_ring,
  "Metaphysical Principles": IMAGES.fullpage.eclipse_touched,
  "Faction Pressures": IMAGES.fullpage.aurelian_empire,
  "Starship Rules": IMAGES.halfpage.starship_combat,
  "Exploration and Ship": IMAGES.maps.station_schematic,
  "Station Ring Encounter": IMAGES.maps.blue_ring_map,
  "Off-Station Exploration": IMAGES.maps.grey_ring_map,
  "Station Event Generator": IMAGES.halfpage.green_ring,
  "Faction Turn": IMAGES.fullpage.kaelen_syndicate,
  "Introduction to the Campaign": IMAGES.fullpage.book7_attack,
  "ARC 1": IMAGES.halfpage.eclipse_corruption,
  "ARC 2": IMAGES.fullpage.mindclave,
  "ARC 3": IMAGES.fullpage.valari_collective,
  "Adversaries & Threats": IMAGES.fullpage.book6_rogues,
  "Campaign Promise": IMAGES.fullpage.book2_crew,
  "Core Mechanics": IMAGES.halfpage.red_ring,
};

function findChapterImage(t: string): string | null {
  for (const [k, u] of Object.entries(CHAPTER_IMAGES)) { if (t.includes(k)) return u; }
  return null;
}
function findInsignia(t: string): string | null {
  const l = t.toLowerCase();
  for (const [k, u] of Object.entries(FACTION_INSIGNIA_MAP)) { if (l.includes(k)) return u; }
  return null;
}
function findPortrait(t: string): string | null {
  const l = t.toLowerCase();
  for (const [k, u] of Object.entries(CLASS_PORTRAIT_MAP)) { if (l.includes("the " + k) || l.startsWith(k)) return u; }
  return null;
}
function findRingImage(t: string): string | null {
  const l = t.toLowerCase();
  for (const [k, u] of Object.entries(RING_IMAGE_MAP)) { if (l.includes(k)) return u; }
  return null;
}
function getBookImage(t: string): string | null {
  for (const [k, u] of Object.entries(BOOK_IMAGES)) { if (t.toUpperCase().includes(k)) return u; }
  return null;
}

/* ─── Utility Functions ─── */
const totalChapters = data.books.reduce((s, b) => s + b.chapters.length, 0);
function getGlobalIdx(bIdx: number, cIdx: number): number {
  let i = 0;
  for (let b = 0; b < bIdx; b++) i += data.books[b].chapters.length;
  return i + cIdx;
}

function estimateReadingTime(chapter: Chapter): number {
  let totalChars = (chapter.content || "").length;
  chapter.sections.forEach(s => { totalChars += (s.content || "").length; });
  const words = totalChars / 5.5; // average word length
  return Math.max(1, Math.round(words / 200)); // 200 wpm reading speed
}

/* ─── Bookmark System ─── */
const BOOKMARKS_KEY = "nexus9_bookmarks";
interface BookmarkEntry { bookIdx: number; chapterIdx: number; title: string; bookTitle: string; savedAt: number; }

function loadBookmarks(): BookmarkEntry[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveBookmarks(bookmarks: BookmarkEntry[]) {
  try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks)); } catch {}
}

/* ─── Reading Progress Persistence ─── */
const PROGRESS_KEY = "nexus9_reading_progress";
function saveReadingProgress(bIdx: number, cIdx: number) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ bookIdx: bIdx, chapterIdx: cIdx })); } catch {}
}
function loadReadingProgress(): { bookIdx: number; chapterIdx: number } | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ─── Dice Roller ─── */
function rollDice(): { hope: number; fear: number; result: "hope" | "fear" | "crit_hope" | "crit_fear" } {
  const hope = Math.floor(Math.random() * 12) + 1;
  const fear = Math.floor(Math.random() * 12) + 1;
  if (hope === fear && hope === 12) return { hope, fear, result: "crit_hope" };
  if (hope === fear && hope === 1) return { hope, fear, result: "crit_fear" };
  if (hope >= fear) return { hope, fear, result: "hope" };
  return { hope, fear, result: "fear" };
}

/* ─── Quick Reference Data ─── */
const CONDITIONS = [
  { name: "Vulnerable", effect: "Attacks against you gain advantage." },
  { name: "Restrained", effect: "You cannot move. Attacks against you gain advantage." },
  { name: "Frightened", effect: "You cannot willingly move closer to the source of fear. Disadvantage on attacks." },
  { name: "Hidden", effect: "You cannot be targeted by attacks. Attacking from hidden grants advantage." },
  { name: "Stunned", effect: "You cannot take actions or reactions until the end of your next turn." },
  { name: "Slowed", effect: "Your movement is halved. You cannot take reactions." },
];

const ACTIONS_REF = [
  { name: "Attack", desc: "Make a melee or ranged attack against a target." },
  { name: "Dash", desc: "Move up to your speed again this turn." },
  { name: "Help", desc: "Give an ally advantage on their next action roll." },
  { name: "Hide", desc: "Attempt to become Hidden from enemies." },
  { name: "Use an Item", desc: "Interact with an object, device, or consumable." },
  { name: "Protect", desc: "Reduce damage to a nearby ally by your armor score." },
];

/* ─── Main Component ─── */
export default function Home() {
  const params = useParams<{ bookId?: string; chapterId?: string }>();
  const [, setLocation] = useLocation();
  const [activeBookIdx, setActiveBookIdx] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [expandedBooks, setExpandedBooks] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>(loadBookmarks);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [diceResult, setDiceResult] = useState<ReturnType<typeof rollDice> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const activeBook = data.books[activeBookIdx];
  const activeChapter = activeBook?.chapters[activeChapterIdx];
  const globalProgress = useMemo(() => ((getGlobalIdx(activeBookIdx, activeChapterIdx) + 1) / totalChapters) * 100, [activeBookIdx, activeChapterIdx]);
  const readingTime = useMemo(() => activeChapter ? estimateReadingTime(activeChapter) : 0, [activeChapter]);

  // Handle URL-based navigation
  useEffect(() => {
    if (params.bookId) {
      const bIdx = parseInt(params.bookId, 10);
      const cIdx = params.chapterId ? parseInt(params.chapterId, 10) : 0;
      if (bIdx >= 0 && bIdx < data.books.length) {
        const book = data.books[bIdx];
        if (cIdx >= 0 && cIdx < book.chapters.length) {
          setActiveBookIdx(bIdx);
          setActiveChapterIdx(cIdx);
          setExpandedBooks(p => new Set(p).add(bIdx));
          setShowCover(false);
        }
      }
    } else {
      // Try to restore reading progress
      const saved = loadReadingProgress();
      if (saved && (saved.bookIdx > 0 || saved.chapterIdx > 0)) {
        // Don't auto-navigate, just remember for the cover
      }
    }
  }, []);

  useEffect(() => { const t = setTimeout(() => setCoverLoaded(true), 100); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0;
      setScrollProgress(pct);
      setShowBackToTop(el.scrollTop > 400);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeBookIdx, activeChapterIdx]);

  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  // Enhanced search with better snippets and result counting
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const res: { bIdx: number; cIdx: number; title: string; bookTitle: string; snippet: string; matchCount: number }[] = [];
    data.books.forEach((book, bI) => {
      book.chapters.forEach((ch, cI) => {
        let matchCount = 0;
        const allText = [ch.title, ch.content || "", ...ch.sections.map(s => s.title + " " + s.content)].join(" ");
        const lower = allText.toLowerCase();
        let pos = 0;
        while ((pos = lower.indexOf(q, pos)) !== -1) { matchCount++; pos += q.length; }
        
        if (matchCount > 0) {
          // Find best snippet
          let sn = "";
          const idx = lower.indexOf(q);
          if (idx >= 0) {
            const st = Math.max(0, idx - 60), en = Math.min(allText.length, idx + q.length + 60);
            sn = (st > 0 ? "\u2026" : "") + allText.slice(st, en) + (en < allText.length ? "\u2026" : "");
          }
          res.push({ bIdx: bI, cIdx: cI, title: ch.title, bookTitle: book.title, snippet: sn, matchCount });
        }
      });
    });
    // Sort by match count descending
    res.sort((a, b) => b.matchCount - a.matchCount);
    return res.slice(0, 25);
  }, [searchQuery]);

  const totalSearchMatches = useMemo(() => searchResults.reduce((s, r) => s + r.matchCount, 0), [searchResults]);

  const toggleBook = (idx: number) => setExpandedBooks(p => { const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  const navigateTo = useCallback((bIdx: number, cIdx: number) => {
    setActiveBookIdx(bIdx); setActiveChapterIdx(cIdx);
    setExpandedBooks(p => new Set(p).add(bIdx));
    setSidebarOpen(false); setShowCover(false); setSearchOpen(false); setSearchQuery("");
    setShowBookmarks(false); setShowQuickRef(false); setShowShortcuts(false); setShowDiceRoller(false);
    saveReadingProgress(bIdx, cIdx);
    setLocation(`/book/${bIdx}/${cIdx}`);
    setTimeout(() => { contentRef.current?.scrollTo({ top: 0, behavior: "instant" }); }, 50);
  }, [setLocation]);

  const goNext = useCallback(() => {
    if (!activeBook) return;
    if (activeChapterIdx < activeBook.chapters.length - 1) navigateTo(activeBookIdx, activeChapterIdx + 1);
    else if (activeBookIdx < data.books.length - 1) navigateTo(activeBookIdx + 1, 0);
  }, [activeBook, activeBookIdx, activeChapterIdx, navigateTo]);

  const goPrev = useCallback(() => {
    if (activeChapterIdx > 0) navigateTo(activeBookIdx, activeChapterIdx - 1);
    else if (activeBookIdx > 0) { const pb = data.books[activeBookIdx - 1]; navigateTo(activeBookIdx - 1, pb.chapters.length - 1); }
  }, [activeBookIdx, activeChapterIdx, navigateTo]);

  // Bookmark management
  const isBookmarked = useMemo(() => bookmarks.some(b => b.bookIdx === activeBookIdx && b.chapterIdx === activeChapterIdx), [bookmarks, activeBookIdx, activeChapterIdx]);
  
  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      const exists = prev.findIndex(b => b.bookIdx === activeBookIdx && b.chapterIdx === activeChapterIdx);
      let next: BookmarkEntry[];
      if (exists >= 0) {
        next = prev.filter((_, i) => i !== exists);
      } else {
        next = [...prev, {
          bookIdx: activeBookIdx,
          chapterIdx: activeChapterIdx,
          title: activeChapter?.title || "",
          bookTitle: activeBook?.title || "",
          savedAt: Date.now(),
        }];
      }
      saveBookmarks(next);
      return next;
    });
  }, [activeBookIdx, activeChapterIdx, activeChapter, activeBook]);

  // Close all overlays
  const closeOverlays = useCallback(() => {
    setSearchOpen(false); setShowShortcuts(false); setShowQuickRef(false); setShowBookmarks(false); setShowDiceRoller(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      // Close overlays on Escape
      if (e.key === "Escape") { closeOverlays(); return; }
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (searchOpen && e.key === "Enter" && searchResults.length > 0) {
          e.preventDefault();
          navigateTo(searchResults[0].bIdx, searchResults[0].cIdx);
        }
        return;
      }
      if (showCover) return;
      
      switch (e.key) {
        case "ArrowRight": goNext(); break;
        case "ArrowLeft": goPrev(); break;
        case "/": e.preventDefault(); closeOverlays(); setSearchOpen(true); break;
        case "?": if (e.shiftKey) { closeOverlays(); setShowShortcuts(true); } break;
        case "b": if (!e.ctrlKey && !e.metaKey) toggleBookmark(); break;
        case "d": if (!e.ctrlKey && !e.metaKey) { closeOverlays(); setShowDiceRoller(p => !p); } break;
        case "q": if (!e.ctrlKey && !e.metaKey) { closeOverlays(); setShowQuickRef(p => !p); } break;
        case "m": if (!e.ctrlKey && !e.metaKey) { closeOverlays(); setShowBookmarks(p => !p); } break;
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev, searchOpen, showCover, closeOverlays, toggleBookmark, navigateTo, searchResults]);

  // Highlight search terms in snippet
  const highlightSnippet = (snippet: string, query: string) => {
    if (!query || query.length < 2) return snippet;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = snippet.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-[#2ec4b6]/30 text-white rounded px-0.5">{part}</mark> : part
    );
  };

  /* ─── Cover Screen ─── */
  if (showCover) {
    const savedProgress = loadReadingProgress();
    return (
      <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#050d1a]">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#2ec4b6] focus:text-[#050d1a] focus:px-4 focus:py-2 focus:rounded">
          Skip to content
        </a>
        <div className="absolute inset-0">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/104030874/FespuBmXL5Vam8ZoX6zMyg/nexus9_cover_fraying_dark-C6cwuXsuZFJMsAWqJR7daE.webp" alt="Nexus 9 Station — The Fraying Dark"
            className={"w-full h-full object-cover transition-all duration-[2000ms] " + (coverLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105")} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050d1a]/20 via-[#050d1a]/40 to-[#050d1a]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050d1a]/30 via-transparent to-[#050d1a]/30" />
        </div>
        <div className={"absolute inset-0 pointer-events-none transition-opacity duration-1000 " + (coverLoaded ? "opacity-30" : "opacity-0")}>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(46,196,182,0.03)_2px,rgba(46,196,182,0.03)_4px)]" />
        </div>
        <div className={"relative z-10 text-center px-8 max-w-3xl transition-all duration-[1500ms] delay-500 " + (coverLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="mb-8">
            <img src={IMAGES.insignias.nexus9} alt="Nexus 9 Insignia"
              className="w-28 h-28 mx-auto rounded-full border-2 border-[#2ec4b6]/40 shadow-[0_0_40px_rgba(46,196,182,0.15)]" />
          </div>
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#2ec4b6]/60 block mb-3" style={{ fontFamily: "var(--font-mono)" }}>ORBITAL FOUNDRY PRESENTS</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.15em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>Nexus 9</h1>
          <h2 className="text-xl md:text-2xl tracking-[0.3em] uppercase text-[#2ec4b6] mb-6" style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}>The Fraying Dark</h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#2ec4b6]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#2ec4b6]/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#2ec4b6]/50" />
          </div>
          <p className="text-base text-[#8a9bb4] italic mb-2" style={{ fontFamily: "var(--font-body)" }}>A Cosmic-Opera Tabletop Roleplaying Game</p>
          <p className="text-xs tracking-[0.2em] uppercase text-[#4a5f7a] mb-8" style={{ fontFamily: "var(--font-heading)" }}>Compatible with the Daggerheart System</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setShowCover(false)}
              className="group inline-flex items-center gap-3 px-10 py-3.5 bg-[#2ec4b6]/5 border border-[#2ec4b6]/30 text-[#2ec4b6] rounded-sm hover:bg-[#2ec4b6]/15 hover:border-[#2ec4b6]/60 hover:shadow-[0_0_30px_rgba(46,196,182,0.1)] transition-all duration-500"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.15em" }}>
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> OPEN BOOK
            </button>
            {savedProgress && (savedProgress.bookIdx > 0 || savedProgress.chapterIdx > 0) && (
              <button onClick={() => navigateTo(savedProgress.bookIdx, savedProgress.chapterIdx)}
                className="group inline-flex items-center gap-3 px-8 py-3.5 bg-transparent border border-[#4a5f7a]/40 text-[#8a9bb4] rounded-sm hover:bg-[#2ec4b6]/5 hover:border-[#2ec4b6]/30 hover:text-[#2ec4b6] transition-all duration-500"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.15em" }}>
                <BookOpenCheck className="w-5 h-5" /> CONTINUE READING
              </button>
            )}
          </div>
        </div>
        <div className={"absolute bottom-8 text-center transition-all duration-1000 delay-[2000ms] " + (coverLoaded ? "opacity-100" : "opacity-0")}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#2a3a50]" style={{ fontFamily: "var(--font-heading)" }}>
            {data.books.length} Books &middot; {totalChapters} Chapters &middot; Press <kbd className="px-1 py-0.5 bg-[#2a3a50]/50 rounded text-[#4a5f7a]">?</kbd> for shortcuts
          </p>
        </div>
      </div>
    );
  }

  const chapterImage = activeChapter ? findChapterImage(activeChapter.title) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-[#2ec4b6] focus:text-[#050d1a] focus:px-4 focus:py-2 focus:rounded">
        Skip to content
      </a>

      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden p-2.5 bg-sidebar text-sidebar-foreground rounded-lg shadow-lg border border-sidebar-border" aria-label="Toggle navigation">
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={"fixed lg:static inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 transition-transform duration-300 " + (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")} role="navigation" aria-label="Book navigation">
        <div className="p-4 border-b border-sidebar-border shrink-0">
          <button onClick={() => { setShowCover(true); setLocation("/"); }} className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
            <img src={IMAGES.insignias.nexus9} alt="N9" className="w-9 h-9 rounded-full border border-sidebar-border shadow-sm" />
            <div>
              <div className="text-sm font-bold tracking-wider uppercase" style={{ fontFamily: "var(--font-heading)" }}>Nexus 9</div>
              <div className="text-[10px] tracking-widest uppercase text-sidebar-foreground/40" style={{ fontFamily: "var(--font-heading)" }}>Station Terminal</div>
            </div>
          </button>
        </div>
        <div className="px-4 py-2 border-b border-sidebar-border shrink-0">
          <div className="flex items-center justify-between text-[10px] text-sidebar-foreground/40 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
            <span>PROGRESS</span><span>{Math.round(globalProgress)}%</span>
          </div>
          <div className="h-1 bg-sidebar-accent rounded-full overflow-hidden">
            <div className="h-full bg-[#2ec4b6] transition-all duration-500 rounded-full" style={{ width: `${globalProgress}%` }} />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto sidebar-scroll p-2" aria-label="Table of contents">
          {data.books.map((book, bIdx) => (
            <div key={book.id} className="mb-0.5">
              <button onClick={() => toggleBook(bIdx)}
                className={"w-full flex items-center gap-2 px-3 py-2 rounded text-left text-[11px] font-semibold tracking-wider uppercase transition-colors duration-150 " + (activeBookIdx === bIdx ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70")}
                style={{ fontFamily: "var(--font-heading)" }}
                aria-expanded={expandedBooks.has(bIdx)}>
                {expandedBooks.has(bIdx) ? <ChevronDown className="w-3 h-3 shrink-0 text-[#2ec4b6]" /> : <ChevronRight className="w-3 h-3 shrink-0 text-sidebar-foreground/40" />}
                <span className="truncate">{book.title}</span>
              </button>
              {expandedBooks.has(bIdx) && (
                <div className="ml-4 mt-0.5 space-y-px border-l border-sidebar-border/30 pl-2" role="list">
                  {book.chapters.map((ch, cIdx) => {
                    const isCurrent = activeBookIdx === bIdx && activeChapterIdx === cIdx;
                    const hasBookmark = bookmarks.some(bm => bm.bookIdx === bIdx && bm.chapterIdx === cIdx);
                    return (
                      <button key={ch.id} onClick={() => navigateTo(bIdx, cIdx)}
                        className={"w-full text-left px-2.5 py-1.5 rounded text-[11px] leading-tight transition-all duration-150 flex items-center gap-1 " + (isCurrent ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/30")}
                        style={{ fontFamily: "var(--font-body)" }}
                        aria-current={isCurrent ? "page" : undefined}
                        role="listitem">
                        <span className="truncate flex-1">{ch.title.length > 38 ? ch.title.slice(0, 38) + "\u2026" : ch.title}</span>
                        {hasBookmark && <BookmarkCheck className="w-3 h-3 text-[#2ec4b6] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="px-3 py-2 border-t border-sidebar-border shrink-0 space-y-1.5">
          <Link href="/character-builder">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded text-left text-[11px] font-semibold tracking-wider uppercase bg-[#2ec4b6]/10 hover:bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/20 hover:border-[#2ec4b6]/40 transition-all duration-200" style={{ fontFamily: "var(--font-heading)" }}>
              <User className="w-4 h-4 shrink-0" />
              <span>Character Builder</span>
            </button>
          </Link>
          <Link href="/encounter-builder">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded text-left text-[11px] font-semibold tracking-wider uppercase bg-[#2ec4b6]/10 hover:bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/20 hover:border-[#2ec4b6]/40 transition-all duration-200" style={{ fontFamily: "var(--font-heading)" }}>
              <Swords className="w-4 h-4 shrink-0" />
              <span>GM Encounter Builder</span>
            </button>
          </Link>
        </div>
        <div className="p-3 border-t border-sidebar-border text-[10px] text-sidebar-foreground/30 shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
          <p className="tracking-wider uppercase">Orbital Foundry &copy; 2026</p>
          <p className="mt-0.5">Compatible with Daggerheart</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb bar */}
        <div className="shrink-0 bg-[#0a1628] text-white px-4 lg:px-8 py-2 flex items-center justify-between shadow-md print:hidden" role="banner">
          <div className="flex items-center gap-2 text-xs min-w-0" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="text-[#2ec4b6] shrink-0">NEXUS-9://</span>
            <button onClick={() => navigateTo(activeBookIdx, 0)} className="text-white/50 hover:text-white/80 truncate transition-colors">{activeBook?.title}</button>
            {activeChapter && <>
              <span className="text-white/20 shrink-0">/</span>
              <span className="text-white/80 truncate">{activeChapter.title}</span>
            </>}
          </div>
          <div className="flex items-center gap-0.5 ml-2 shrink-0">
            {/* Reading time */}
            <div className="hidden sm:flex items-center gap-1 mr-2 text-white/30 text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
              <Clock className="w-3 h-3" />
              <span>{readingTime} min</span>
            </div>
            {/* Bookmark */}
            <button onClick={toggleBookmark} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this chapter"} title={isBookmarked ? "Remove bookmark (B)" : "Bookmark this chapter (B)"}>
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-[#2ec4b6]" /> : <Bookmark className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />}
            </button>
            {/* Bookmarks list */}
            <button onClick={() => { closeOverlays(); setShowBookmarks(p => !p); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="View bookmarks" title="Bookmarks (M)">
              <BookOpenCheck className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />
            </button>
            {/* Dice roller */}
            <button onClick={() => { closeOverlays(); setShowDiceRoller(p => !p); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Dice roller" title="Dice Roller (D)">
              <Dice1 className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />
            </button>
            {/* Quick reference */}
            <button onClick={() => { closeOverlays(); setShowQuickRef(p => !p); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Quick reference" title="Quick Reference (Q)">
              <BookOpen className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />
            </button>
            {/* Print */}
            <button onClick={() => { if (activeChapter) window.print(); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Print chapter" title="Print this chapter">
              <Printer className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />
            </button>
            {/* Theme toggle */}
            {toggleTheme && (
              <button onClick={toggleTheme} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Toggle dark mode" title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />}
              </button>
            )}
            {/* Keyboard shortcuts */}
            <button onClick={() => { closeOverlays(); setShowShortcuts(p => !p); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Keyboard shortcuts" title="Keyboard Shortcuts (?)">
              <Keyboard className="w-4 h-4 text-white/60 hover:text-[#2ec4b6]" />
            </button>
            {/* Search */}
            <button onClick={() => { closeOverlays(); setSearchOpen(!searchOpen); }} className="p-1.5 hover:bg-white/10 rounded transition-colors" aria-label="Search" title="Search (/)">
              <Search className="w-4 h-4 text-[#2ec4b6]" />
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="shrink-0 bg-[#0e1f38] border-b border-[#2ec4b6]/20 p-3" role="search">
            <div className="flex items-center gap-2 bg-[#0a1628] rounded border border-[#2ec4b6]/30 px-3 py-2">
              <Search className="w-4 h-4 text-[#2ec4b6]/60 shrink-0" />
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chapters, factions, rules, mechanics..." className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                style={{ fontFamily: "var(--font-body)" }} aria-label="Search the book" />
              {searchQuery && (
                <span className="text-[10px] text-white/40 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                  {searchResults.length} chapters &middot; {totalSearchMatches} matches
                </span>
              )}
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-white/40 hover:text-white/80 text-xs px-1.5 py-0.5 border border-white/20 rounded">ESC</button>
            </div>
            {searchQuery && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="mt-3 text-center text-sm text-white/40 py-4">
                No results found for &ldquo;{searchQuery}&rdquo;. Try different keywords.
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-72 overflow-y-auto space-y-1">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => navigateTo(r.bIdx, r.cIdx)}
                    className="w-full text-left px-3 py-2.5 rounded hover:bg-[#2ec4b6]/10 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#2ec4b6] font-medium" style={{ fontFamily: "var(--font-heading)" }}>{r.title}</div>
                      <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded" style={{ fontFamily: "var(--font-mono)" }}>{r.matchCount} match{r.matchCount > 1 ? "es" : ""}</span>
                    </div>
                    <div className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>{r.bookTitle}</div>
                    {r.snippet && <div className="text-[10px] text-white/50 mt-0.5 line-clamp-2">{highlightSnippet(r.snippet, searchQuery)}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keyboard shortcuts overlay */}
        {showShortcuts && (
          <div className="shrink-0 bg-[#0e1f38] border-b border-[#2ec4b6]/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#2ec4b6] uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-white/40 hover:text-white/80"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {[
                ["/ ", "Search"], ["\u2190 \u2192", "Prev / Next Chapter"], ["B", "Toggle Bookmark"],
                ["M", "View Bookmarks"], ["Q", "Quick Reference"], ["D", "Dice Roller"],
                ["?", "This Help"], ["Esc", "Close Overlays"],
              ].map(([key, desc]) => (
                <div key={desc} className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-[#0a1628] border border-white/10 rounded text-[#2ec4b6] text-[10px] min-w-[2rem] text-center" style={{ fontFamily: "var(--font-mono)" }}>{key}</kbd>
                  <span className="text-white/60">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks overlay */}
        {showBookmarks && (
          <div className="shrink-0 bg-[#0e1f38] border-b border-[#2ec4b6]/20 p-4 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#2ec4b6] uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Bookmarks ({bookmarks.length})
              </h3>
              <button onClick={() => setShowBookmarks(false)} className="text-white/40 hover:text-white/80"><X className="w-4 h-4" /></button>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-white/40">No bookmarks yet. Press <kbd className="px-1 py-0.5 bg-[#0a1628] border border-white/10 rounded text-[10px]">B</kbd> to bookmark the current chapter.</p>
            ) : (
              <div className="space-y-1">
                {bookmarks.map((bm, i) => (
                  <button key={i} onClick={() => navigateTo(bm.bookIdx, bm.chapterIdx)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-[#2ec4b6]/10 transition-colors flex items-center gap-2">
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#2ec4b6] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white/80 truncate">{bm.title}</div>
                      <div className="text-[10px] text-white/40">{bm.bookTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Reference overlay */}
        {showQuickRef && (
          <div className="shrink-0 bg-[#0e1f38] border-b border-[#2ec4b6]/20 p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#2ec4b6] uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Quick Reference</h3>
              <button onClick={() => setShowQuickRef(false)} className="text-white/40 hover:text-white/80"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-heading)" }}>Conditions</h4>
                <div className="space-y-1.5">
                  {CONDITIONS.map(c => (
                    <div key={c.name} className="text-xs">
                      <span className="text-[#2ec4b6] font-semibold">{c.name}:</span>
                      <span className="text-white/60 ml-1">{c.effect}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-heading)" }}>Actions</h4>
                <div className="space-y-1.5">
                  {ACTIONS_REF.map(a => (
                    <div key={a.name} className="text-xs">
                      <span className="text-[#2ec4b6] font-semibold">{a.name}:</span>
                      <span className="text-white/60 ml-1">{a.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dice Roller overlay */}
        {showDiceRoller && (
          <div className="shrink-0 bg-[#0e1f38] border-b border-[#2ec4b6]/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#2ec4b6] uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Hope / Fear Dice Roller</h3>
              <button onClick={() => setShowDiceRoller(false)} className="text-white/40 hover:text-white/80"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setDiceResult(rollDice())}
                className="px-6 py-2.5 bg-[#2ec4b6]/10 border border-[#2ec4b6]/30 text-[#2ec4b6] rounded hover:bg-[#2ec4b6]/20 transition-colors font-semibold text-sm"
                style={{ fontFamily: "var(--font-heading)" }}>
                Roll 2d12
              </button>
              {diceResult && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-[10px] text-[#2ec4b6]/60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>Hope</div>
                    <div className="text-2xl font-bold text-[#2ec4b6]" style={{ fontFamily: "var(--font-heading)" }}>{diceResult.hope}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#f87171]/60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>Fear</div>
                    <div className="text-2xl font-bold text-[#f87171]" style={{ fontFamily: "var(--font-heading)" }}>{diceResult.fear}</div>
                  </div>
                  <div className={`px-3 py-1.5 rounded text-sm font-bold ${
                    diceResult.result === "crit_hope" ? "bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/40" :
                    diceResult.result === "crit_fear" ? "bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/40" :
                    diceResult.result === "hope" ? "bg-[#2ec4b6]/10 text-[#2ec4b6]" :
                    "bg-[#f87171]/10 text-[#f87171]"
                  }`} style={{ fontFamily: "var(--font-heading)" }}>
                    {diceResult.result === "crit_hope" ? "CRITICAL HOPE!" :
                     diceResult.result === "crit_fear" ? "CRITICAL FEAR!" :
                     diceResult.result === "hope" ? "HOPE" : "FEAR"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading progress */}
        <div className="shrink-0 h-0.5 bg-[#0a1628]">
          <div className="h-full bg-[#2ec4b6] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Scrollable content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto" id="main-content" role="main" aria-label="Book content">
          {/* Book opener */}
          {activeChapterIdx === 0 && activeBook && getBookImage(activeBook.title) && (
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img src={getBookImage(activeBook.title)!} alt={activeBook.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-white drop-shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  {activeBook.title}
                </h1>
              </div>
            </div>
          )}
          {activeChapterIdx === 0 && activeBook && !getBookImage(activeBook.title) && (
            <div className="px-6 md:px-10 pt-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] uppercase text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{activeBook.title}</h1>
              <div className="w-24 h-0.5 bg-[#2ec4b6] mt-3" />
            </div>
          )}

          {/* Chapter content */}
          {activeChapter && (
            <div className="px-6 md:px-10 lg:px-14 py-8 max-w-5xl">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-0.5 bg-[#2ec4b6]" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground" style={{ fontFamily: "var(--font-heading)" }}>{activeBook.title}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{activeChapter.title}</h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="w-16 h-0.5 bg-[#2ec4b6]" />
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                    <Clock className="w-3 h-3" /> {readingTime} min read
                  </span>
                </div>
              </div>

              {/* Chapter portrait for class chapters */}
              {findPortrait(activeChapter.title) && (
                <div className="float-right ml-6 mb-4 w-44 md:w-52">
                  <img src={findPortrait(activeChapter.title)!} alt={activeChapter.title} className="w-full rounded border border-border shadow-md" loading="lazy" />
                  <p className="text-[10px] text-center text-muted-foreground mt-1 italic" style={{ fontFamily: "var(--font-heading)" }}>{activeChapter.title.replace(/^\d+\.\s*/, "")}</p>
                </div>
              )}

              {/* Chapter image */}
              {chapterImage && !findPortrait(activeChapter.title) && (
                <div className="mb-8 rounded overflow-hidden border border-border shadow-sm">
                  <img src={chapterImage} alt={activeChapter.title} className="w-full h-48 md:h-64 object-cover" loading="lazy" />
                </div>
              )}

              {/* Chapter intro */}
              {activeChapter.content && (
                <div className="book-two-col mb-8"><MarkdownRenderer content={activeChapter.content} /></div>
              )}
              <div className="clear-both" />

              {/* Sections */}
              {activeChapter.sections.map((section) => {
                const insignia = findInsignia(section.title);
                const portrait = findPortrait(section.title);
                const ringImg = findRingImage(section.title);
                return (
                  <div key={section.id} className="mb-10" id={section.id}>
                    <div className="flex items-start gap-4 mb-4 border-b-2 border-[#2ec4b6]/30 pb-3">
                      {insignia && <img src={insignia} alt="" className="w-14 h-14 rounded object-cover border border-border shadow-sm shrink-0" />}
                      <h3 className="text-lg md:text-xl font-semibold tracking-wider uppercase text-foreground flex-1" style={{ fontFamily: "var(--font-heading)" }}>{section.title}</h3>
                    </div>
                    {portrait && (
                      <div className="float-right ml-4 mb-4 w-40 md:w-48">
                        <img src={portrait} alt={section.title} className="w-full rounded border border-border shadow-md" loading="lazy" />
                        <p className="text-[10px] text-center text-muted-foreground mt-1 italic" style={{ fontFamily: "var(--font-heading)" }}>{section.title}</p>
                      </div>
                    )}
                    {ringImg && (
                      <div className="mb-6 rounded overflow-hidden border border-border shadow-sm">
                        <img src={ringImg} alt={section.title} className="w-full h-48 md:h-64 object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className={section.content.length > 800 ? "book-two-col" : ""}><MarkdownRenderer content={section.content} /></div>
                    <div className="clear-both" />
                  </div>
                );
              })}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border print:hidden">
                <button onClick={goPrev} disabled={activeBookIdx === 0 && activeChapterIdx === 0}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm rounded border border-border hover:bg-muted hover:border-[#2ec4b6]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                </button>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                  {getGlobalIdx(activeBookIdx, activeChapterIdx) + 1} / {totalChapters}
                </span>
                <button onClick={goNext} disabled={activeBookIdx === data.books.length - 1 && activeChapterIdx === activeBook.chapters.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm rounded border border-border hover:bg-muted hover:border-[#2ec4b6]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-8 pb-8 text-center text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                <p className="tracking-widest uppercase">Nexus 9: The Fraying Dark</p>
                <p className="mt-1">Orbital Foundry &mdash; Compatible with Daggerheart</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#0a1628] text-[#2ec4b6] rounded-full shadow-lg hover:bg-[#0a1628]/90 transition-all print:hidden" aria-label="Back to top">
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
