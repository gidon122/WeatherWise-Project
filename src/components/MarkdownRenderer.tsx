import { type ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Normalizes excessive whitespace, blank lines, and stray separator characters
 */
function normalizeMarkdown(text: string): string {
  if (!text) return '';
  return (
    text
      .replace(/\r\n/g, '\n')
      // Normalize mediawiki/jira-style double pipes '||' to standard markdown '|'
      .replace(/\|{2,}/g, ' | ')
      // Collapse 3 or more consecutive newlines into 2 (clean paragraph break)
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * Validates if a line is a markdown table delimiter row (e.g. | --- | :---: | ---: |)
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('-')) return false;
  return (
    /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed) ||
    /^(\s*:?-+:?\s*\|)+\s*:?-+:?\s*$/.test(trimmed)
  );
}

/**
 * Parses cell text-alignment from markdown table separator tokens
 */
function parseAlignment(cell: string): 'left' | 'center' | 'right' {
  const trimmed = cell.trim();
  const startsWithColon = trimmed.startsWith(':');
  const endsWithColon = trimmed.endsWith(':');
  if (startsWithColon && endsWithColon) return 'center';
  if (endsWithColon) return 'right';
  return 'left';
}

/**
 * Splits a table line into clean cells, trimming whitespace and discarding edge pipes
 */
function splitTableRow(row: string): string[] {
  let trimmed = row.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

/**
 * Safely renders inline markdown tokens: bold, italic, bold+italic, code, links
 * Never injects raw HTML (100% safe against XSS)
 */
function renderInline(text: string, depth = 0): ReactNode[] {
  if (!text) return [];
  if (depth > 2) return [text];

  // Regex captures:
  // 1. ***bold italic*** or ___bold italic___
  // 2. **bold** or __bold__
  // 3. *italic* or _italic_
  // 4. `code`
  // 5. [text](url)
  const tokenRegex =
    /(\*\*\*[^\n*]+?\*\*\*|___[^\n_]+?___|\*\*[^\n*]+?\*\*|__[^\n_]+?__|\*[^\n*]+?\*|_[^\n_]+?_|`[^\n`]+?`|\[[^\n\]]+?\]\([^\n)]+?\))/g;

  const parts = text.split(tokenRegex);

  return parts.filter(Boolean).map((part, index) => {
    // Bold + Italic
    if (
      (part.startsWith('***') && part.endsWith('***')) ||
      (part.startsWith('___') && part.endsWith('___'))
    ) {
      const inner = part.slice(3, -3);
      return (
        <strong key={index} className="font-bold">
          <em className="italic">{renderInline(inner, depth + 1)}</em>
        </strong>
      );
    }

    // Bold
    if (
      (part.startsWith('**') && part.endsWith('**')) ||
      (part.startsWith('__') && part.endsWith('__'))
    ) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-app-text">
          {renderInline(inner, depth + 1)}
        </strong>
      );
    }

    // Italic
    if (
      (part.startsWith('*') && part.endsWith('*')) ||
      (part.startsWith('_') && part.endsWith('_'))
    ) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-app-text/90">
          {renderInline(inner, depth + 1)}
        </em>
      );
    }

    // Inline Code
    if (part.startsWith('`') && part.endsWith('`')) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-app-accent/25 border border-app-border text-app-primary-hover font-mono text-[10px]"
        >
          {inner}
        </code>
      );
    }

    // Link: [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2].trim();
        // Strict protocol check for security
        const isSafeUrl = /^(https?:\/\/|mailto:)/i.test(linkUrl);
        if (isSafeUrl) {
          return (
            <a
              key={index}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-app-primary underline hover:text-app-primary-hover transition-colors inline-flex items-center"
            >
              {renderInline(linkText, depth + 1)}
            </a>
          );
        }
        return <span key={index}>{linkText}</span>;
      }
    }

    return part;
  });
}

/**
 * Checks if a line initiates a new markdown block structure
 */
function isBlockStart(line: string, nextLine?: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('```')) return true;
  if (/^#{1,6}\s+/.test(trimmed)) return true;
  if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) return true;
  if (trimmed.startsWith('>')) return true;
  if (/^\s*[-*+•]\s+/.test(line)) return true;
  if (/^\s*\d+\.\s+/.test(line)) return true;
  if (trimmed.includes('|') && nextLine && isTableSeparator(nextLine)) return true;
  return false;
}

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const normalized = normalizeMarkdown(content);
  if (!normalized) return null;

  const lines = normalized.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Code Blocks (```)
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++; // Skip opening fence
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // Skip closing fence
      }
      blocks.push(
        <pre
          key={blockKey++}
          className="my-2 overflow-x-auto rounded-lg bg-app-surface/90 border border-app-border p-2.5 font-mono text-[10px] text-app-text"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // 3. Tables (| col | col |)
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headerRow = splitTableRow(rawLine);
      const separatorRow = splitTableRow(lines[i + 1]);
      const alignments = separatorRow.map(parseAlignment);
      i += 2; // skip header and separator

      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }

      blocks.push(
        <div
          key={blockKey++}
          className="my-2.5 w-full overflow-x-auto rounded-lg border border-app-border bg-app-surface/60 shadow-xs"
        >
          <table className="w-full border-collapse text-left text-[10.5px]">
            <thead>
              <tr className="border-b border-app-border bg-app-accent/25">
                {headerRow.map((th, thIdx) => (
                  <th
                    key={thIdx}
                    style={{ textAlign: alignments[thIdx] || 'left' }}
                    className="px-3 py-1.5 font-bold text-app-text whitespace-nowrap"
                  >
                    {renderInline(th)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-app-bg/50 transition-colors">
                  {row.map((td, tdIdx) => (
                    <td
                      key={tdIdx}
                      style={{ textAlign: alignments[tdIdx] || 'left' }}
                      className="px-3 py-1.5 text-app-text leading-snug"
                    >
                      {renderInline(td)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 4. Headings (#, ##, ###, ####)
    const headingMatch = rawLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();

      if (level === 1) {
        blocks.push(
          <h2
            key={blockKey++}
            className="text-xs font-bold text-app-text tracking-wide mt-2.5 mb-1 pb-1 border-b border-app-border/40"
          >
            {renderInline(headingText)}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3
            key={blockKey++}
            className="text-xs font-bold text-app-text mt-2.5 mb-1 pb-0.5"
          >
            {renderInline(headingText)}
          </h3>
        );
      } else if (level === 3) {
        blocks.push(
          <h4
            key={blockKey++}
            className="text-[11px] font-semibold text-app-primary-hover mt-2 mb-0.5"
          >
            {renderInline(headingText)}
          </h4>
        );
      } else {
        blocks.push(
          <h5
            key={blockKey++}
            className="text-[10.5px] font-semibold text-app-text mt-1.5 mb-0.5"
          >
            {renderInline(headingText)}
          </h5>
        );
      }
      i++;
      continue;
    }

    // 5. Horizontal Rules (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(
        <hr key={blockKey++} className="my-2.5 border-0 border-t border-app-border/70" />
      );
      i++;
      continue;
    }

    // 6. Blockquotes (> ...)
    if (trimmed.startsWith('>')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={blockKey++}
          className="my-1.5 border-l-2 border-app-primary bg-app-accent/10 pl-2.5 py-1 text-[10.5px] italic text-app-text-muted rounded-r"
        >
          {renderInline(bqLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // 7. Unordered Lists (-, *, +, •)
    if (/^\s*[-*+•]\s+/.test(rawLine)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+•]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul
          key={blockKey++}
          className="my-1.5 pl-4 space-y-1 list-disc marker:text-app-primary text-[11px]"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed pl-0.5 text-app-text">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered Lists (1., 2., etc.)
    if (/^\s*\d+\.\s+/.test(rawLine)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={blockKey++}
          className="my-1.5 pl-4 space-y-1 list-decimal marker:text-app-primary font-medium text-[11px]"
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed pl-0.5 font-normal text-app-text">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Standard Paragraphs
    const pLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i], lines[i + 1])) {
      pLines.push(lines[i].trim());
      i++;
    }

    if (pLines.length > 0) {
      blocks.push(
        <p key={blockKey++} className="my-1 text-[11px] leading-relaxed text-app-text">
          {renderInline(pLines.join(' '))}
        </p>
      );
    }
  }

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
};
