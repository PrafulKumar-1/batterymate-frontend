class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    this.socket = new WebSocket(url);
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new WebSocketService();