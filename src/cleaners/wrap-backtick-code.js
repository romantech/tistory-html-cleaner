import { CLEAN_OPTION } from '../constants.js';
import { collectTextNodes, toChange } from './dom.js';

export function wrapBacktickCode(container) {
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
