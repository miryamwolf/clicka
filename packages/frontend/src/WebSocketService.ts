export default class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: ((data: any) => void)[] = [];

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        this.messageCallbacks.forEach((cb) => cb(data));
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  getSocket() {
    return this.socket;
  }

  subscribe(callback: (data: any) => void) {
    this.messageCallbacks.push(callback);

    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback);
    };
  }

  // פונקציה לשליחת הודעה דרך ה-WebSocket
  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Cannot send message:', data);
    }
  }

  // פונקציה לנוחיות - אפשר להשתמש במקום subscribe אם רוצים callback יחיד
  setOnMessageCallback(callback: (data: any) => void) {
    this.messageCallbacks = [callback];
  }

  close() {
    if (this.socket) {
     this.socket.close();
    }
  }
}