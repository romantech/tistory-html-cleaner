import {
  CLEAN_OPTION,
  DEFAULT_CLEAN_OPTIONS,
  LOG_PREFIX,
} from './constants.js';

const PRESERVED_DIV_SELECTOR = [
  'div[data-ke-type="html"]',
  'div[data-ke-type="moreLess"]',
  'div.og-text',
  'div.og-image',
].join(', ');
const SKIP_TEXT_SELECTOR = 'code, pre, script, style';
const all = (root, selector) => [...root.querySelectorAll(selector)];
const warn = (...args) => console.warn(LOG_PREFIX, ...args);
const toChange = (type, count) => (count > 0 ? { type, count } : null);

function createContainer(html) {
  return new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
}

function unwrap(element) {
  const fragment = document.createDocumentFragment();
  while (element.firstChild) fragment.append(element.firstChild);
  element.replaceWith(fragment);
}

function isImageShortcode(node) {
  const text = node.nodeValue ?? '';
  return text.includes('[##_Image|') && text.includes('_##]');
}

function collectTextNodes(root, predicate) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let current;

  while ((current = walker.nextNode())) {
    const node = /** @type {Text} */ (current);
    if (
      !node.parentElement?.closest(SKIP_TEXT_SELECTOR) &&
      !isImageShortcode(node) &&
      predicate(node.nodeValue ?? '', node)
    ) {
      nodes.push(node);
    }
  }

  return nodes;
}

function stripTags(container, selector, type) {
  const elements = all(container, selector);
  elements.forEach(unwrap);
  return toChange(type, elements.length);
}

function stripDivTags(container) {
  const elements = all(container, 'div').filter(
    (element) => !element.closest(PRESERVED_DIV_SELECTOR),
  );
  elements.forEach(unwrap);
  return toChange(CLEAN_OPTION.DIV, elements.length);
}

function stripAttribute(container, selector, attribute, type) {
  const elements = all(container, selector);
  elements.forEach((element) => element.removeAttribute(attribute));
  return toChange(type, elements.length);
}

function sanitizeAnchorAttributes(container) {
  let changedCount = 0;

  for (const link of all(container, 'a[href]')) {
    if (link.classList.contains('btn-toggle-moreless')) {
      if (link.hasAttribute('style')) {
        link.removeAttribute('style');
        changedCount += 1;
      }
      continue;
    }

    const hadStyle = link.hasAttribute('style');
    const hadClass = link.hasAttribute('class');
    const href = link.getAttribute('href') ?? '';
    let isExternalHttpLink = false;

    try {
      const url = new URL(href, location.href);
      isExternalHttpLink =
        ['http:', 'https:'].includes(url.protocol) && url.origin !== location.origin;
    } catch {}

    const rel = new Set((link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean));
    const shouldFixTarget =
      isExternalHttpLink && link.getAttribute('target') !== '_blank';
    const shouldFixRel =
      isExternalHttpLink && (!rel.has('noopener') || !rel.has('noreferrer'));

    if (!hadStyle && !hadClass && !shouldFixTarget && !shouldFixRel) continue;

    link.removeAttribute('style');
    link.removeAttribute('class');

    if (isExternalHttpLink) {
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', [...rel].join(' '));
    }

    changedCount += 1;
  }

  return toChange(CLEAN_OPTION.A_ATTRIBUTES, changedCount);
}

function replaceNbsp(container) {
  let count = 0;

  for (const node of collectTextNodes(container, (text) => text.includes('\u00A0'))) {
    const before = node.nodeValue ?? '';
    count += before.match(/\u00A0/g)?.length ?? 0;
    node.nodeValue = before.replaceAll('\u00A0', ' ');
  }

  return toChange(CLEAN_OPTION.NBSP, count);
}

function fixHttpLinks(container) {
  let count = 0;

  for (const link of all(container, 'a[href]')) {
    const href = link.getAttribute('href') ?? '';
    if (/^http:\/\//i.test(href)) {
      link.setAttribute('href', href.replace(/^http:\/\//i, 'https://'));
      count += 1;
    }
  }

  for (const node of collectTextNodes(container, (text) => /http:\/\//i.test(text))) {
    const before = node.nodeValue ?? '';
    count += before.match(/http:\/\//gi)?.length ?? 0;
    node.nodeValue = before.replace(/http:\/\//gi, 'https://');
  }

  return toChange(CLEAN_OPTION.HTTP_LINKS, count);
}

function wrapBacktickCode(container) {
  let count = 0;

  for (const node of collectTextNodes(container, (text) => text.includes('`'))) {
    const text = node.nodeValue ?? '';
    const matches = [...text.matchAll(/`([^`\n]+?)`/g)];
    if (!matches.length || !node.parentNode) continue;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let replaced = false;

    for (const match of matches) {
      const [fullMatch, codeText] = match;
      const start = match.index ?? 0;
      const end = start + fullMatch.length;
      if ((text[start - 1] ?? '') === '`' || (text[end] ?? '') === '`') continue;

      if (start > lastIndex) fragment.append(text.slice(lastIndex, start));
      const code = document.createElement('code');
      code.textContent = codeText;
      fragment.append(code);
      lastIndex = end;
      count += 1;
      replaced = true;
    }

    if (!replaced) continue;
    if (lastIndex < text.length) fragment.append(text.slice(lastIndex));
    node.replaceWith(fragment);
  }

  return toChange(CLEAN_OPTION.BACKTICK_CODE, count);
}

function normalizeSmartQuotes(container) {
  let count = 0;

  for (const node of collectTextNodes(container, (text) => /[‘’“”]/.test(text))) {
    const before = node.nodeValue ?? '';
    count += before.match(/[‘’“”]/g)?.length ?? 0;
    node.nodeValue = before.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  }

  return toChange(CLEAN_OPTION.SMART_QUOTES, count);
}

const CLEANERS = Object.freeze({
  [CLEAN_OPTION.BLOCKQUOTE]: (container) =>
    stripTags(container, 'blockquote', CLEAN_OPTION.BLOCKQUOTE),
  [CLEAN_OPTION.SPAN]: (container) =>
    stripTags(container, 'span', CLEAN_OPTION.SPAN),
  [CLEAN_OPTION.DIV]: stripDivTags,
  [CLEAN_OPTION.NBSP]: replaceNbsp,
  [CLEAN_OPTION.HTTP_LINKS]: fixHttpLinks,
  [CLEAN_OPTION.BACKTICK_CODE]: wrapBacktickCode,
  [CLEAN_OPTION.SMART_QUOTES]: normalizeSmartQuotes,
  [CLEAN_OPTION.P_STYLE]: (container) =>
    stripAttribute(container, 'p[style]', 'style', CLEAN_OPTION.P_STYLE),
  [CLEAN_OPTION.H_STYLE]: (container) =>
    stripAttribute(
      container,
      'h1[style], h2[style], h3[style], h4[style], h5[style], h6[style]',
      'style',
      CLEAN_OPTION.H_STYLE,
    ),
  [CLEAN_OPTION.CODE_STYLE]: (container) =>
    stripAttribute(container, 'code[style]', 'style', CLEAN_OPTION.CODE_STYLE),
  [CLEAN_OPTION.PRE_STYLE]: (container) =>
    stripAttribute(container, 'pre[style]', 'style', CLEAN_OPTION.PRE_STYLE),
  [CLEAN_OPTION.A_ATTRIBUTES]: sanitizeAnchorAttributes,
});

export function runCleanPipeline(html, options = DEFAULT_CLEAN_OPTIONS) {
  const originalHtml = String(html ?? '');
  const container = createContainer(originalHtml);
  const changes = [];

  for (const option of options) {
    const cleaner = CLEANERS[option];
    if (!cleaner) {
      warn(`알 수 없는 정리 옵션: ${option}`);
      continue;
    }

    const change = cleaner(container);
    if (change) changes.push(change);
  }

  return {
    html: changes.length ? container.innerHTML : originalHtml,
    changes,
  };
}
