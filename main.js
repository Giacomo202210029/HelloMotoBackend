const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const {router, onInit} = require("./routes");

const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 solicitudes por IP cada 15 min
    message: "Demasiadas solicitudes, intenta más tarde.",
});

app.use(limiter);


// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Example",
            version: "1.0.0",
            description: "API documentation example",
        },
    },
    apis: ["./routes.js"], // Ruta a los archivos de las rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api/v1", router);

app.get('/', (req, res) => {
    res.redirect('/api-docs')
})

// Start server
app.listen(PORT, () => {
    onInit(2023, 2024, 11, 9, 15, 16, 5)
    console.log(`Server is running on http://localhost:${PORT}`);
});
/*
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app);

server.listen(PORT, () => {
    console.log(`Server is running on https://jypsac.dyndns.org:${PORT}`);
})
}
*/
