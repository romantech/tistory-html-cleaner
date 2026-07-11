import { CLEAN_OPTION } from '../constants.js';
import { all, toChange } from './dom.js';

export function sanitizeAnchorAttributes(container) {
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
