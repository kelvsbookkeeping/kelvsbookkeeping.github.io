/** How long brand.css waits before the first stroke on page load; a replay skips that wait. */
const LOAD_DELAY = 330

/** Ticks the box again: restarts the draw on every brand mark inside `root` (the logo link calls it on hover). */
export function replayBrandTick(root: Element) {
  for (const part of root.querySelectorAll('.brand-icon, .brand-icon polyline')) {
    for (const animation of part.getAnimations()) {
      if (!('animationName' in animation)) continue // a transition (the rail slide), not the tick
      animation.cancel()
      animation.play()
      animation.currentTime = LOAD_DELAY
    }
  }
}
