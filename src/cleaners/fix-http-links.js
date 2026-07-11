import { CLEAN_OPTION } from '../constants.js';
import { all, collectTextNodes, toChange } from './dom.js';

export function fixHttpLinks(container) {
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
