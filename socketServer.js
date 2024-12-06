const { messages } = require("./routes.js");

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

    socket.on("privateMessage", ({ from, to, message }) => {
        const newMessage = {
            from,
            to,
            message,
            timestamp: new Date().toISOString(),
        };

        // Guardar el mensaje en memoria
        messages.push(newMessage); // Asegúrate de guardar los mensajes aquí

        const recipientSocketId = users.get(to);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("message", newMessage); // Envía el mensaje en tiempo real
        }

        console.log("Mensaje almacenado y enviado:", newMessage);
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
