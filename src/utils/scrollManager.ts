/**
 * Global Scroll Manager Utility for CodeBau
 * Handles consistent page top scrolling, smooth scrolling on home press,
 * hash element navigation with header offset, and body scroll lock cleanup.
 */

const scrollPositionsMap = new Map<string, number>();

/**
 * Universal function to scroll to top of the page regardless of container.
 */
export function scrollToPageTop(options: ScrollToOptions = { top: 0, left: 0, behavior: 'auto' }) {
  const opts: ScrollToOptions = {
    top: options.top ?? 0,
    left: options.left ?? 0,
    behavior: options.behavior || 'auto'
  };

  try {
    window.scrollTo(opts);
  } catch (e) {
    window.scrollTo(opts.left || 0, opts.top || 0);
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = opts.top || 0;
  }
  if (document.body) {
    document.body.scrollTop = opts.top || 0;
  }

  // Also reset any scrollable root/main containers if present
  const containers = document.querySelectorAll('main, #root, .app-scroll-container, .page-content');
  containers.forEach(container => {
    if (container && container.scrollTop > 0) {
      container.scrollTop = opts.top || 0;
    }
  });
}

/**
 * Scroll to target element specified by hash, with header offset compensation.
 */
export function scrollToHashElement(hash: string): boolean {
  if (!hash) return false;
  const targetId = hash.replace(/^#/, '');
  if (!targetId) return false;

  const element = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
  if (element) {
    // Header height offset (100px - 130px)
    const headerOffset = 120;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
    return true;
  }
  return false;
}

/**
 * Unlock any body scroll locks left behind by modals/drawers.
 */
export function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
}

/**
 * Save current scroll position for a route key.
 */
export function saveScrollPosition(routeKey: string) {
  if (!routeKey) return;
  const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  scrollPositionsMap.set(routeKey, currentY);
}

/**
 * Restore saved scroll position for a route key, or top if none saved.
 */
export function restoreScrollPosition(routeKey: string) {
  const savedY = scrollPositionsMap.get(routeKey);
  if (typeof savedY === 'number') {
    scrollToPageTop({ top: savedY, behavior: 'auto' });
  } else {
    scrollToPageTop({ top: 0, behavior: 'auto' });
  }
}
