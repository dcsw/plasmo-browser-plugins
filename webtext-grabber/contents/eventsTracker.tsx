// const originalAddEventListener = EventTarget.prototype.addEventListener;
// const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
// const eventListenersMap = new WeakMap();

// EventTarget.prototype.addEventListener = function(type, listener, options) {
//   if (!eventListenersMap.has(this)) {
//     eventListenersMap.set(this, {});
//   }
//   const listeners = eventListenersMap.get(this);
//   if (!listeners[type]) {
//     listeners[type] = [];
//   }
//   listeners[type].push(listener);
//   originalAddEventListener.call(this, type, listener, options);
// };

// EventTarget.prototype.removeEventListener = function(type, listener, options) {
//   const listeners = eventListenersMap.get(this);
//   if (listeners && listeners[type]) {
//     const index = listeners[type].indexOf(listener);
//     if (index >= 0) {
//       listeners[type].splice(index, 1);
//     }
//   }
//   originalRemoveEventListener.call(this, type, listener, options);
// };

// export function checkForListeners(node, eventType) {
//   const listeners = eventListenersMap.get(node);
//   return listeners && listeners[eventType] && listeners[eventType].length > 0;
// }

// export function removeAllListeners(node, eventType) {
//   const listeners = eventListenersMap.get(node);
//   if (listeners && listeners[eventType]) {
//     listeners[eventType].forEach(listener => {
//       node.removeEventListener(eventType, listener);
//     });
//     delete listeners[eventType];
//   }
// }
