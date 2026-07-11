import { CLEAN_OPTION } from '../constants.js';
import { fixHttpLinks } from './fix-http-links.js';
import { normalizeSmartQuotes } from './normalize-smart-quotes.js';
import { replaceNbsp } from './replace-nbsp.js';
import { sanitizeAnchorAttributes } from './sanitize-anchor-attributes.js';
import {
  stripCodeStyles,
  stripHeadingStyles,
  stripParagraphStyles,
  stripPreStyles,
} from './strip-styles.js';
import { stripBlockquotes, stripDivs, stripSpans } from './strip-tags.js';
import { wrapBacktickCode } from './wrap-backtick-code.js';

export const CLEANERS = Object.freeze({
  [CLEAN_OPTION.BLOCKQUOTE]: stripBlockquotes,
  [CLEAN_OPTION.SPAN]: stripSpans,
  [CLEAN_OPTION.DIV]: stripDivs,
  [CLEAN_OPTION.NBSP]: replaceNbsp,
  [CLEAN_OPTION.HTTP_LINKS]: fixHttpLinks,
  [CLEAN_OPTION.BACKTICK_CODE]: wrapBacktickCode,
  [CLEAN_OPTION.SMART_QUOTES]: normalizeSmartQuotes,
  [CLEAN_OPTION.P_STYLE]: stripParagraphStyles,
  [CLEAN_OPTION.H_STYLE]: stripHeadingStyles,
  [CLEAN_OPTION.CODE_STYLE]: stripCodeStyles,
  [CLEAN_OPTION.PRE_STYLE]: stripPreStyles,
  [CLEAN_OPTION.A_ATTRIBUTES]: sanitizeAnchorAttributes,
});
