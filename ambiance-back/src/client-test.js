// client-test.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3008");

socket.on("connect", () => {
  console.log("🟢 Connecté au serveur :", socket.id);

  socket.emit("sendMessage", {
    senderId: 1,
    discussionId: 1,
    content: "moi je vais bien alors que pensez vous de l'evenement ?",
  });
});

socket.on("receiveMessage", (msg) => {
  console.log("📩 Message reçu :", msg);
});

socket.on("disconnect", () => {
  console.log("🔴 Déconnecté");
});

socket.on("errorMessage", (e) => {
  console.log("❌ Erreur :", e);
});
