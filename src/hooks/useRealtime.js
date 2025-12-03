import { useEffect } from 'react';
import WebSocketService from '../services/websocket';

const useRealtime = (url, onMessage) => {
  useEffect(() => {
    WebSocketService.connect(url);

    WebSocketService.socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    return () => {
      WebSocketService.close();
    };
  }, [url, onMessage]);
};

export default useRealtime;