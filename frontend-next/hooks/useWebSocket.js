import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url, handlers = {}) {
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        reconnectDelay.current = 1000;
        handlers.onOpen?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handlers.onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          handlers.onMessage?.(event.data);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        handlers.onError?.(error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        handlers.onClose?.();

        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setTimeout(() => {
            console.log(`Reconnecting... (attempt ${reconnectAttempts.current})`);
            connect();
          }, reconnectDelay.current);
          reconnectDelay.current = Math.min(reconnectDelay.current * 2, 10000);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      handlers.onError?.(error);
    }
  }, [url, handlers]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const isConnected = ws.current?.readyState === WebSocket.OPEN;

  return { send, isConnected, ws: ws.current };
}
