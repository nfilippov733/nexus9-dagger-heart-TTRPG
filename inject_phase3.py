#!/usr/bin/env python3
"""Inject Phase 3 worldbuilding content into manuscript.json."""
import json
import re

MANUSCRIPT = 'client/src/data/manuscript.json'

def read_md(path):
    with open(path) as f:
        return f.read()

def split_into_sections(md_text):
    """Split markdown into chapter-level blocks based on # headings."""
    chapters = []
    current_title = None
    current_content = []
    
    for line in md_text.split('\n'):
        if line.startswith('# ') and not line.startswith('## '):
            if current_title:
                chapters.append((current_title, '\n'.join(current_content).strip()))
            current_title = line[2:].strip()
            current_content = []
        else:
            current_content.append(line)
    
    if current_title:
        chapters.append((current_title, '\n'.join(current_content).strip()))
    
    return chapters

def extract_sections_from_content(content):
    """Extract ## sections from content."""
    sections = []
    lines = content.split('\n')
    current_title = None
    current_lines = []
    top_content = []
    
    for line in lines:
        if line.startswith('## '):
            if current_title:
                sections.append({'title': current_title, 'content': '\n'.join(current_lines).strip()})
            elif current_lines:
                top_content = current_lines[:]
            current_title = line[3:].strip()
            current_lines = []
        else:
            if current_title:
                current_lines.append(line)
            else:
                top_content.append(line)
    
    if current_title:
        sections.append({'title': current_title, 'content': '\n'.join(current_lines).strip()})
    
    return '\n'.join(top_content).strip(), sections

# Load manuscript
with open(MANUSCRIPT) as f:
    data = json.load(f)

# ============================================================
# 1. REPLACE Book One chapters with expanded versions
# ============================================================
factions_md = read_md('expanded_factions.md')
worldbuilding_md = read_md('expanded_worldbuilding.md')

# Parse the worldbuilding chapters
wb_chapters = split_into_sections(worldbuilding_md)
factions_chapters = split_into_sections(factions_md)

book_one = data['books'][0]

# Map: chapter index -> new content
# Ch 1 = History, Ch 2 = Factions, Ch 3 = Culture, Ch 4 = Tech, Ch 5 = Meta

# Replace Chapter 2: History of the Known Galaxy
for title, content in wb_chapters:
    if 'History' in title:
        top, secs = extract_sections_from_content(content)
        book_one['chapters'][1]['content'] = top
        book_one['chapters'][1]['sections'] = secs
        print(f"Replaced: {book_one['chapters'][1]['title']} -> {len(top.split())} words + {len(secs)} sections")

# Replace Chapter 3: Factions of the Known Galaxy
for title, content in factions_chapters:
    if 'Factions' in title:
        top, secs = extract_sections_from_content(content)
        book_one['chapters'][2]['content'] = top
        book_one['chapters'][2]['sections'] = secs
        print(f"Replaced: {book_one['chapters'][2]['title']} -> {len(top.split())} words + {len(secs)} sections")

# Replace Chapter 4: Culture, Daily Life, and the Station
for title, content in wb_chapters:
    if 'Culture' in title or 'Daily Life' in title:
        top, secs = extract_sections_from_content(content)
        book_one['chapters'][3]['content'] = top
        book_one['chapters'][3]['sections'] = secs
        print(f"Replaced: {book_one['chapters'][3]['title']} -> {len(top.split())} words + {len(secs)} sections")

# Replace Chapter 5: Technology Principles
for title, content in wb_chapters:
    if 'Technology' in title:
        top, secs = extract_sections_from_content(content)
        book_one['chapters'][4]['content'] = top
        book_one['chapters'][4]['sections'] = secs
        print(f"Replaced: {book_one['chapters'][4]['title']} -> {len(top.split())} words + {len(secs)} sections")

# Replace Chapter 6: Metaphysical Principles
for title, content in wb_chapters:
    if 'Metaphysical' in title:
        top, secs = extract_sections_from_content(content)
        book_one['chapters'][5]['content'] = top
        book_one['chapters'][5]['sections'] = secs
        print(f"Replaced: {book_one['chapters'][5]['title']} -> {len(top.split())} words + {len(secs)} sections")

# ============================================================
# 2. REPLACE Book Five Chapter 3: Faction Turn System
# ============================================================
faction_turn_md = read_md('faction_turn_system.md')
ft_chapters = split_into_sections(faction_turn_md)

book_five = data['books'][4]

for title, content in ft_chapters:
    if 'Faction Turn' in title:
        top, secs = extract_sections_from_content(content)
        book_five['chapters'][3]['content'] = top
        book_five['chapters'][3]['sections'] = secs
        print(f"Replaced: {book_five['chapters'][3]['title']} -> {len(top.split())} words + {len(secs)} sections")

# ============================================================
# 3. Count total words
# ============================================================
total = 0
for book in data['books']:
    for ch in book['chapters']:
        wc = len(ch.get('content', '').split()) if ch.get('content') else 0
        for s in ch.get('sections', []):
            wc += len(s.get('content', '').split()) if s.get('content') else 0
        total += wc

print(f"\nTotal manuscript word count: {total:,}")

# Save
with open(MANUSCRIPT, 'w') as f:
    json.dump(data, f, indent=2)

print("Manuscript updated successfully.")
