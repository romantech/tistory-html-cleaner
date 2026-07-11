import { CLEAN_OPTION } from '../constants.js';
import { all, toChange } from './dom.js';

function stripStyle(container, selector, type) {
  const elements = all(container, selector);
  elements.forEach((element) => element.removeAttribute('style'));
  return toChange(type, elements.length);
}

export const stripParagraphStyles = (container) =>
  stripStyle(container, 'p[style]', CLEAN_OPTION.P_STYLE);

export const stripHeadingStyles = (container) =>
  stripStyle(
    container,
    'h1[style], h2[style], h3[style], h4[style], h5[style], h6[style]',
    CLEAN_OPTION.H_STYLE,
  );

export const stripCodeStyles = (container) =>
  stripStyle(container, 'code[style]', CLEAN_OPTION.CODE_STYLE);

export const stripPreStyles = (container) =>
  stripStyle(container, 'pre[style]', CLEAN_OPTION.PRE_STYLE);
