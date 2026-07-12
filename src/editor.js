import { runCleanPipeline } from './cleaner.js';
import {
  DEFAULT_CLEAN_OPTIONS,
  EDITOR_MODE,
  LOG_PREFIX,
  MODE_SELECTOR,
  WAIT_CONFIG,
} from './constants.js';

const log = (...args) => console.log(LOG_PREFIX, ...args);
const warn = (...args) => console.warn(LOG_PREFIX, ...args);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, { timeout = 2500, interval = 50 } = {}) {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    try {
      if (await check()) return true;
    } catch {}
    await wait(interval);
  }
  return false;
}

function findCodeMirror() {
  const element = document.querySelector('.CodeMirror');
  return element?.CodeMirror ?? element?.wrappedJSObject?.CodeMirror ?? null;
}

function getCodeMirror() {
  const cm = findCodeMirror();
  if (!cm) warn('CodeMirror 인스턴스를 찾지 못함');
  return cm ?? null;
}

function getModeButton() {
  return document.querySelector('#editor-mode-layer-btn-open');
}

function getModeMenuItems() {
  return document.querySelectorAll('.mce-menu-item');
}

function readCurrentMode() {
  return (
    document
      .querySelector('.mce-menu-item.mce-menu-active .mce-text')
      ?.textContent?.trim() ?? ''
  );
}

async function openModeMenu() {
  if (getModeMenuItems().length > 0) return true;

  const button = getModeButton();
  if (!button) {
    warn('모드 메뉴 버튼을 찾지 못함');
    return false;
  }

  button.click();
  const opened = await waitFor(
    () => getModeMenuItems().length > 0,
    WAIT_CONFIG.MENU_OPEN,
  );
  if (!opened) warn('모드 메뉴 열기 실패');
  return opened;
}

async function closeModeMenu() {
  document.body.click();
  await waitFor(() => getModeMenuItems().length === 0, WAIT_CONFIG.MENU_CLOSE);
}

async function withOpenedModeMenu(task) {
  if (!(await openModeMenu())) return null;
  try {
    return await task();
  } finally {
    await closeModeMenu();
  }
}

async function getCurrentEditorMode() {
  return (await withOpenedModeMenu(readCurrentMode)) ?? '';
}

async function changeEditorMode(targetMode, { suppressConfirm = false } = {}) {
  const targetSelector = MODE_SELECTOR[targetMode];
  if (!targetSelector) {
    warn(`지원하지 않는 모드: ${targetMode}`);
    return { success: false, changed: false, currentMode: '' };
  }

  if (!(await openModeMenu())) {
    return { success: false, changed: false, currentMode: '' };
  }

  try {
    const currentMode = readCurrentMode();
    log('현재 모드:', currentMode, '→ 목표 모드:', targetMode);
    if (currentMode === targetMode) {
      return { success: true, changed: false, currentMode };
    }

    const target = document.querySelector(targetSelector);
    if (!target) {
      warn(`${targetMode} 메뉴 항목을 찾지 못함: ${targetSelector}`);
      return { success: false, changed: false, currentMode };
    }

    const originalConfirm = unsafeWindow.confirm;
    let shouldSuppressConfirm = suppressConfirm;
    if (suppressConfirm) {
      unsafeWindow.confirm = (...args) => {
        if (!shouldSuppressConfirm) return originalConfirm(...args);
        shouldSuppressConfirm = false;
        return true;
      };
    }

    try {
      target.click();
    } finally {
      if (suppressConfirm) unsafeWindow.confirm = originalConfirm;
    }

    await closeModeMenu();
    const switched = await waitFor(
      async () => (await getCurrentEditorMode()) === targetMode,
      WAIT_CONFIG.MODE_SWITCH,
    );
    const nextMode = switched ? targetMode : await getCurrentEditorMode();
    log(`${targetMode} 모드 전환 ${switched ? '완료' : '실패'}`);
    return { success: switched, changed: switched, currentMode: nextMode };
  } finally {
    await closeModeMenu();
  }
}

function cleanEditorHtml(options) {
  const cm = getCodeMirror();
  if (!cm) return { success: false, changed: false, changes: [] };

  const before = cm.getValue();
  const result = runCleanPipeline(before, options);
  if (result.html === before) {
    log('변경 사항 없음');
    return { success: true, changed: false, changes: result.changes };
  }

  cm.operation(() =>
    cm.replaceRange(
      result.html,
      cm.posFromIndex(0),
      cm.posFromIndex(before.length),
    ),
  );
  cm.save();
  cm.refresh();
  log('Tistory HTML 정리 완료');
  console.table(result.changes);
  return { success: true, changed: true, changes: result.changes };
}

export async function waitUntilReady(options = {}) {
  const ready = await waitFor(() => !!getModeButton() && !!findCodeMirror(), {
    ...WAIT_CONFIG.READY,
    ...options,
  });
  if (!ready) warn('에디터 준비 타임아웃');
  return ready;
}

export async function enterHtmlModeAndClean(
  options = DEFAULT_CLEAN_OPTIONS,
  { restoreOriginalMode = true } = {},
) {
  const originalMode = await getCurrentEditorMode();
  const result = {
    success: false,
    changed: false,
    changes: [],
    originalMode,
    currentMode: originalMode,
  };

  if (!MODE_SELECTOR[originalMode]) {
    warn(`현재 에디터 모드를 확인하지 못함: ${originalMode || '(빈 값)'}`);
    return result;
  }

  const entered = await changeEditorMode(EDITOR_MODE.HTML, {
    suppressConfirm: true,
  });
  if (!entered.success) {
    result.currentMode = await getCurrentEditorMode();
    return result;
  }

  result.currentMode = EDITOR_MODE.HTML;
  try {
    Object.assign(result, cleanEditorHtml(options));
  } catch (error) {
    warn('HTML 정리 중 오류:', error);
  } finally {
    if (restoreOriginalMode && originalMode !== EDITOR_MODE.HTML) {
      const restored = await changeEditorMode(originalMode, {
        suppressConfirm: true,
      });
      result.currentMode = restored.currentMode;
      if (!restored.success) result.success = false;
    } else {
      result.currentMode = await getCurrentEditorMode();
    }
  }

  return result;
}
