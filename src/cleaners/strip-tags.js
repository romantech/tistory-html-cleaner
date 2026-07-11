import { CLEAN_OPTION } from '../constants.js';
import { all, toChange, unwrap } from './dom.js';

const PRESERVED_DIV_SELECTOR = [
  'div[data-ke-type="html"]',
  'div[data-ke-type="moreLess"]',
  'div.og-text',
  'div.og-image',
].join(', ');

function stripTags(container, selector, type) {
  const elements = all(container, selector);
  elements.forEach(unwrap);
  return toChange(type, elements.length);
}

export const stripBlockquotes = (container) =>
  stripTags(container, 'blockquote', CLEAN_OPTION.BLOCKQUOTE);

export const stripSpans = (container) =>
  stripTags(container, 'span', CLEAN_OPTION.SPAN);

export function stripDivs(container) {
  const elements = all(container, 'div').filter(
    (element) => !element.closest(PRESERVED_DIV_SELECTOR),
  );
  elements.forEach(unwrap);
  return toChange(CLEAN_OPTION.DIV, elements.length);
}
