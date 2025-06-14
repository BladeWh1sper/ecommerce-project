let socket = null;

export const connectWebSocket = (token, onMessageCallback) => {
  socket = new WebSocket(`ws://127.0.0.1:8000/ws/cart?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    console.log("WebSocket message received:", event.data);
    if (onMessageCallback) {
      onMessageCallback(event.data);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
