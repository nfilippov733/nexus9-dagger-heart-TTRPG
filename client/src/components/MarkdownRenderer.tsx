import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const html = useMemo(() => convertMarkdown(content), [content]);

  return (
    <div
      className={`prose-nexus ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function convertMarkdown(md: string): string {
  if (!md) return "";

  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];
  let inBlockquote = false;
  let bqLines: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let isOrdered = false;

  const flushTable = () => {
    if (tableRows.length > 0) {
      htmlParts.push(`<table>${tableRows.join("\n")}</table>`);
      tableRows = [];
    }
    inTable = false;
  };

  const flushBlockquote = () => {
    if (bqLines.length > 0) {
      htmlParts.push(`<blockquote>${bqLines.join(" ")}</blockquote>`);
      bqLines = [];
    }
    inBlockquote = false;
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const tag = isOrdered ? "ol" : "ul";
      htmlParts.push(`<${tag}>${listItems.join("\n")}</${tag}>`);
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();

    // Empty line
    if (!stripped) {
      if (inTable) flushTable();
      if (inBlockquote) flushBlockquote();
      if (inList) flushList();
      continue;
    }

    // Horizontal rule
    if (stripped === "---") {
      if (inTable) flushTable();
      htmlParts.push("<hr />");
      continue;
    }

    // H4 headers
    if (stripped.startsWith("#### ")) {
      if (inTable) flushTable();
      if (inList) flushList();
      const title = stripped.slice(5);
      htmlParts.push(`<h4>${formatInline(title)}</h4>`);
      continue;
    }

    // Tables
    if (stripped.startsWith("|") && stripped.endsWith("|")) {
      const cells = stripped
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if separator row
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableRows = [];
        // First row is header
        const headerRow = `<tr>${cells.map((c) => `<th>${formatInline(c)}</th>`).join("")}</tr>`;
        tableRows.push(headerRow);
        // Skip separator
        if (i + 1 < lines.length && lines[i + 1].trim().includes("---")) {
          i++;
        }
        continue;
      }

      const dataRow = `<tr>${cells.map((c) => `<td>${formatInline(c)}</td>`).join("")}</tr>`;
      tableRows.push(dataRow);
      continue;
    }

    if (inTable && !stripped.startsWith("|")) {
      flushTable();
    }

    // Blockquotes
    if (stripped.startsWith("> ")) {
      if (inList) flushList();
      const text = stripped.slice(2);
      if (!inBlockquote) {
        inBlockquote = true;
        bqLines = [];
      }
      bqLines.push(formatInline(text));
      continue;
    }

    if (inBlockquote && !stripped.startsWith(">")) {
      flushBlockquote();
    }

    // Unordered lists
    if (stripped.startsWith("- ") || stripped.startsWith("* ")) {
      const text = stripped.slice(2);
      if (!inList || isOrdered) {
        if (inList) flushList();
        inList = true;
        isOrdered = false;
        listItems = [];
      }
      listItems.push(`<li>${formatInline(text)}</li>`);
      continue;
    }

    // Ordered lists
    const olMatch = stripped.match(/^(\d+)\.\s(.+)/);
    if (olMatch) {
      const text = olMatch[2];
      if (!inList || !isOrdered) {
        if (inList) flushList();
        inList = true;
        isOrdered = true;
        listItems = [];
      }
      listItems.push(`<li>${formatInline(text)}</li>`);
      continue;
    }

    if (inList) {
      flushList();
    }

    // Regular paragraph
    if (stripped && !stripped.startsWith("#")) {
      htmlParts.push(`<p>${formatInline(stripped)}</p>`);
    }
  }

  // Flush remaining
  if (inTable) flushTable();
  if (inBlockquote) flushBlockquote();
  if (inList) flushList();

  return htmlParts.join("\n");
}

function formatInline(text: string): string {
  // Bold + italic
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  return text;
}
