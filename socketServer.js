const io = require("socket.io")(3500, {
    cors: {
        origin: "http://localhost:5173", // Ajusta según tu frontend
        methods: ["GET", "POST"],
    },
});

// Mapear usuarios conectados por su ID
const users = new Map();

io.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Registrar al usuario con su ID único (pasado por el frontend)
    socket.on("registerUser", ({ userId }) => {
        users.set(userId, socket.id); // Asocia el userId con el socket.id
        console.log(`Usuario ${userId} registrado con socket ID: ${socket.id}`);
    });

    // Manejar mensajes privados
    socket.on("privateMessage", ({ to, message, from }) => {
        const recipientSocketId = users.get(to); // Busca el socket.id del destinatario

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("message", { message, from }); // Envía el mensaje al destinatario
            console.log(`Mensaje enviado de ${from} a ${to}: ${message}`);
        } else {
            console.log(`El usuario ${to} no está conectado.`);
        }
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
        for (const [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId); // Elimina al usuario desconectado
                console.log(`Usuario ${userId} desconectado`);
                break;
            }
        }
    });
});
