import { CLEAN_OPTION } from '../constants.js';
import { collectTextNodes, toChange } from './dom.js';

export function normalizeSmartQuotes(container) {
  let count = 0;

  for (const node of collectTextNodes(container, (text) => /[‘’“”]/.test(text))) {
    const before = node.nodeValue ?? '';
    count += before.match(/[‘’“”]/g)?.length ?? 0;
    node.nodeValue = before.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  }

  return toChange(CLEAN_OPTION.SMART_QUOTES, count);
}
