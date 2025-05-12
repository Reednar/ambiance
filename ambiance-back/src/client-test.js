// client-test.js
const { io } = require("socket.io-client");

// Remplacez par l'URL de votre serveur WebSocket
const socket = io("http://localhost:3008", {
  query: { userId: 1 }, // Simulez un utilisateur avec l'ID 1
});

socket.on("connect", () => {
  // Simule l'envoi d'un message à une discussion
  setTimeout(() => {
    socket.emit("sendMessage", {
      senderId: 1, // ID de l'utilisateur
      discussionId: 1, // ID de la discussion (groupe)
      content: "Alexis est gay",
    });
  }, 1000);

  // Simule un autre message envoyé à une autre discussion
  setTimeout(() => {
    socket.emit("sendMessage", {
      senderId: 1,
      discussionId: 2, // ID d'une autre discussion
      content: "Tqt on le sait tous",
    });
  }, 3000);
});

socket.on("receiveMessage", (msg) => {
});

socket.on("disconnect", () => {
});

socket.on("errorMessage", (e) => {
});
