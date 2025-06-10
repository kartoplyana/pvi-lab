// Socket
const socket = io("http://localhost:3000", {
    auth: {
        userId: +sessionStorage.getItem("user_id")
    }
});

socket.on("connect", () => {
    console.log("Attempting to connect to chat server...");
});

socket.on("chat_connected", () => {
    console.log("Successfully connected and authenticated with chat server!");
});

socket.on("disconnect", reason => {
    console.log("Disconnected from chat server:", reason);
});