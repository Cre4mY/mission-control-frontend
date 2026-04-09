import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../services/apiClient";

export interface WebSocketMessage {
  type: "agent-status" | "activity" | "kanban-update" | "heartbeat";
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  onMessage?: (msg: WebSocketMessage) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMessage, reconnectAttempts = 3, reconnectDelay = 3000 } = options;
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const connect = useCallback(() => {
    const wsUrl = API_BASE_URL.replace("http", "ws").replace("/api/mc/", "/ws");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("[WebSocket] Connected to", wsUrl);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(msg);
        onMessage?.(msg);
      } catch (err) {
        console.error("[WebSocket] Failed to parse message:", err);
      }
    };

    ws.onclose = () => {
      console.log("[WebSocket] Disconnected");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
      setConnected(false);
    };

    return ws;
  }, [onMessage]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let attempts = 0;
    let reconnectTimeout: NodeJS.Timeout;

    const attemptConnect = () => {
      ws = connect();
    };

    attemptConnect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [connect]);

  return {
    connected,
    lastMessage,
    reconnect: () => {
      const ws = connect();
      return ws;
    },
  };
}
