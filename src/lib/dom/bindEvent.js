import { getNode } from "./getNode.js";

/**
 * 이벤트 바인딩 함수
 * @param {HTMLElement} node
 * @param {MouseEvent|InputEvent|SubmitEvent|PointerEvent|DragEvent} type
 * @param {Function} handler
 * @returns
 */

export function bindEvent(node, type, handler) {
  if (typeof node === "string") node = getNode(node);

  node.addEventListener(type, handler);

  return () => node.removeEventListener(type, handler);
}
