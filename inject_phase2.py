#!/usr/bin/env python3
"""
Inject Phase 2 content into manuscript.json:
1. Replace class stub chapters (Book 2, indices 10-17) with full write-ups
2. Add Ancestry & Community lore as a new chapter in Book 1 (after Character Creation)
"""
import json
import re

MANUSCRIPT = 'client/src/data/manuscript.json'

# Load manuscript
with open(MANUSCRIPT, 'r') as f:
    data = json.load(f)

# ─── Helper: convert markdown to manuscript chapter format ───
def md_to_sections(md_text):
    """Convert markdown text to a list of sections with title and content."""
    sections = []
    # Split by ## headers
    parts = re.split(r'^## (.+)$', md_text, flags=re.MULTILINE)
    
    # First part is the intro (before any ## header)
    intro = parts[0].strip()
    
    # Remaining parts alternate: title, content, title, content...
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        content = parts[i+1].strip() if i+1 < len(parts) else ''
        sections.append({
            'title': title,
            'content': content
        })
    
    return intro, sections

# ─── CLASS CHAPTERS ───
# Read all 4 class chapter files
class_files = [
    'class_chapters_1.md',  # Envoy, Operative
    'class_chapters_2.md',  # Pilot, Marine
    'class_chapters_3.md',  # Engineer, Mystic
    'class_chapters_4.md',  # Broker, Medic
]

class_chapters = []
for cf in class_files:
    with open(cf, 'r') as f:
        content = f.read()
    
    # Split by # headers (top-level class headers)
    classes = re.split(r'^# (.+)$', content, flags=re.MULTILINE)
    
    for i in range(1, len(classes), 2):
        class_name = classes[i].strip()
        class_body = classes[i+1].strip()
        
        intro, sections = md_to_sections(class_body)
        
        class_chapters.append({
            'title': class_name,
            'content': intro,
            'sections': sections
        })

print(f"Parsed {len(class_chapters)} class chapters:")
for ch in class_chapters:
    wc = len(ch['content'].split()) + sum(len(s['content'].split()) for s in ch['sections'])
    print(f"  {ch['title']}: {wc} words, {len(ch['sections'])} sections")

# ─── ANCESTRY & COMMUNITY CHAPTER ───
with open('ancestry_community_chapters.md', 'r') as f:
    anc_content = f.read()

# Split into Ancestries and Communities sections
parts = re.split(r'^# (.+)$', anc_content, flags=re.MULTILINE)
anc_community_chapters = []

for i in range(1, len(parts), 2):
    title = parts[i].strip()
    body = parts[i+1].strip()
    intro, sections = md_to_sections(body)
    anc_community_chapters.append({
        'title': title,
        'content': intro,
        'sections': sections
    })

print(f"\nParsed {len(anc_community_chapters)} ancestry/community chapters:")
for ch in anc_community_chapters:
    wc = len(ch['content'].split()) + sum(len(s['content'].split()) for s in ch['sections'])
    print(f"  {ch['title']}: {wc} words, {len(ch['sections'])} sections")

# ─── INJECT INTO MANUSCRIPT ───

# 1. Replace class chapters in Book Three (index 2)
# Current class chapters are at indices 10-17 (2. The Envoy through 9. The Medic)
book3 = data['books'][2]  # BOOK THREE: AGENTS OF THE FRAYING DARK

# Find the class chapter indices
class_start = None
class_end = None
for j, ch in enumerate(book3['chapters']):
    if 'The Envoy' in ch['title'] and class_start is None:
        class_start = j
    if 'The Medic' in ch['title']:
        class_end = j

print(f"\nBook Three class chapters: indices {class_start}-{class_end}")
print(f"  Replacing {class_end - class_start + 1} chapters with {len(class_chapters)} new chapters")

# Replace the class chapters
if class_start is not None and class_end is not None:
    book3['chapters'] = (
        book3['chapters'][:class_start] +
        class_chapters +
        book3['chapters'][class_end+1:]
    )

# 2. Add Ancestry & Community chapters to Book One (index 0) or Book Two
# Let's add them to Book One after the existing chapters, as they're setting/character lore
book1 = data['books'][0]  # BOOK ONE: THE KNOWN GALAXY

# Insert before the last chapter (Faction Pressures)
# Actually, add them at the end of Book One
for ch in anc_community_chapters:
    book1['chapters'].append(ch)

print(f"\nAdded {len(anc_community_chapters)} chapters to Book One")

# ─── SAVE ───
with open(MANUSCRIPT, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# ─── VERIFY ───
with open(MANUSCRIPT, 'r') as f:
    verify = json.load(f)

total_words = 0
for book in verify['books']:
    book_words = 0
    for ch in book['chapters']:
        wc = len(ch.get('content','').split()) if ch.get('content') else 0
        for s in ch.get('sections', []):
            wc += len(s.get('content','').split()) if s.get('content') else 0
        book_words += wc
    total_words += book_words
    print(f"{book['title']}: {len(book['chapters'])} chapters, {book_words} words")

print(f"\nTotal manuscript: {total_words} words")
