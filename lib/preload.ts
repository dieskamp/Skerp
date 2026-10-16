export const PRELOAD_ATTR = "data-preload"
export const PRELOAD_DONE_EVENT = "skerp:preload-done"
export const VISITED_KEY = "skerp-visited"

/**
 * Inline script voor <head>: zet data-preload op <html> bij het eerste bezoek
 * in deze sessie, vóórdat de pagina zichtbaar wordt. Zo is er geen flits.
 */
export const preloadScript = `document.documentElement.setAttribute("data-js","");try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("${VISITED_KEY}")){document.documentElement.setAttribute("${PRELOAD_ATTR}","")}}catch(e){}`

/** Roept `callback` aan zodra de preloader klaar is (of meteen als er geen is). */
export function onPreloadDone(callback: () => void): () => void {
  if (!document.documentElement.hasAttribute(PRELOAD_ATTR)) {
    callback()
    return () => {}
  }
  window.addEventListener(PRELOAD_DONE_EVENT, callback, { once: true })
  return () => window.removeEventListener(PRELOAD_DONE_EVENT, callback)
}
