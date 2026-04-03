// src/hooks/useSocket.js
// Drop this hook into any component to receive live fridge events.

import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000";

let socket = null; // singleton — one connection for the whole app

export function useSocket(handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers; // always up-to-date without re-subscribing

  useEffect(() => {
    // Create socket once
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ["websocket"] });
    }

    const events = [
      "item:added",
      "item:updated",
      "item:deleted",
      "item:scanned",
      "barcode:unknown",
    ];

    const listener = (event) => (data) => {
      handlersRef.current[event]?.(data);
    };

    const listeners = {};
    events.forEach((e) => {
      listeners[e] = listener(e);
      socket.on(e, listeners[e]);
    });

    return () => {
      events.forEach((e) => socket.off(e, listeners[e]));
    };
  }, []); // mount once

  const emit = useCallback((event, data) => socket?.emit(event, data), []);
  return { emit };
}
