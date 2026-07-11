const SKIP_TEXT_SELECTOR = 'code, pre, script, style';

export const all = (root, selector) => [...root.querySelectorAll(selector)];
export const toChange = (type, count) => (count > 0 ? { type, count } : null);

export function createContainer(html) {
  return new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
    .body;
}

export function unwrap(element) {
  const fragment = document.createDocumentFragment();
  while (element.firstChild) fragment.append(element.firstChild);
  element.replaceWith(fragment);
}

export function collectTextNodes(root, predicate) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let current = walker.nextNode();
  while (current) {
    const node = /** @type {Text} */ (current);
    const text = node.nodeValue ?? '';
    const isImageShortcode =
      text.includes('[##_Image|') && text.includes('_##]');

    if (
      !node.parentElement?.closest(SKIP_TEXT_SELECTOR) &&
      !isImageShortcode &&
      predicate(text, node)
    ) {
      nodes.push(node);
    }

    current = walker.nextNode();
  }

  return nodes;
}
