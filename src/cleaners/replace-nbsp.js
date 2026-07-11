import { CLEAN_OPTION } from '../constants.js';
import { collectTextNodes, toChange } from './dom.js';

export function replaceNbsp(container) {
  let count = 0;

  for (const node of collectTextNodes(container, (text) =>
    text.includes('\u00A0'),
  )) {
    const before = node.nodeValue ?? '';
    count += before.match(/\u00A0/g)?.length ?? 0;
    node.nodeValue = before.replaceAll('\u00A0', ' ');
  }

  return toChange(CLEAN_OPTION.NBSP, count);
}
