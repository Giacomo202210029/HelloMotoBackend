const express = require("express");
const fs= require("fs"); // Importar el módulo fs para leer archivos
const {HttpStatusCode} = require("axios")
const router = express.Router();
function getWeekDate(day, month, year){
    //obtiene el dia de la semana
    let date = new Date(Date.UTC(year, month, day));
    return date.getDay() + 1
}
function daysPerMonth(month, year) {
    // Restamos 1 al mes porque en JavaScript los meses son 0-indexados
    return new Date(year, month + 1, 0).getDate();
}
function getFormattedDate(day, month, year) {
    // Crear una fecha en UTC
    const date = new Date(Date.UTC(year, month, day)); // Restar 1 al mes porque es 0-indexado

    // Formatear como 'YYYYMMDD'
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');
    return formattedDate; // Retorna la fecha en formato 'YYYYMMDD'
}
let lastUsedUserId = 5
let lastUsedStatusId = 3
let data = {
    workers: [
        {
            id: 1,
            name: "Juan Peterson",
            status: 1, // Estado inicial: 1 = Dentro, 2 = Fuera, 3 = Descanso
            registeredHours: [
                {date: "2024-11-22", worked: 5, break: 9, overtime: 1},
                {date: "2024-11-23", worked: 4, break: 6, overtime: 2},
                {date: "2024-11-23", worked: 4, break: 1, overtime: 2},
                {date: "2024-11-24", worked: 4, break: 1, overtime: 2},
                {date: "2024-11-25", worked: 4, break: 1, overtime: 2},
                {date: "2024-11-26", worked: 4, break: 1, overtime: 2},
                {date: "2024-11-27", worked: 4, break: 1, overtime: 2},
                {date: "2024-11-28", worked: 4, break: 1, overtime: 2},
            ],
            startTime: null, // Hora de inicio de trabajo
            breakStart: null,
            email: "juan.peterson@example.com",
            phone: "987654321",
            area: 1,
            sede: "Casa de Señor Julio",
            institution: "SENATI",
            password: "Juan Peterson",
            latitude: -12.04593,
            longitude: -77.03005,
            schedule: {
                mon: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                tue: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                wed: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
                thu: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                fri: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 2,
            name: "Sam Perez",
            status: 1, // Estado inicial: 1 = Dentro, 2 = Fuera, 3 = Descanso
            registeredHours: [
                { date: "2024-11-22", worked: 5, break: 2, overtime: 1 },
                { date: "2024-11-23", worked: 4, break: 1, overtime: 2 }
            ],
            startTime: null, // Hora de inicio de trabajo
            breakStart: null,
            email: "sam.perez@example.com",
            phone: "912345678",
            area: 2,
            sede: "Casa de Señor Julio",
            institution: "SENATI",
            password: "Sam Perez",
            latitude: -12.05299,
            longitude: -77.03767,
            schedule: {
                mon: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
                tue: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
                wed: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
                thu: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
                fri: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 3,
            name: "Celeste Jr",
            status: 1, // Estado inicial: 1 = Dentro, 2 = Fuera, 3 = Descanso
            registeredHours: [], // Registro de horas trabajadas
            startTime: null, // Hora de inicio de trabajo
            breakStart: null,
            email: "celeste.jr@example.com",
            phone: "989898989",
            area: 3,
            sede: "Casa de Señor Julio",
            institution: "SENATI",
            password: "Celeste Jr",
            latitude: -12.04636,
            longitude:  -77.04279,
            schedule: {
                mon: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
                tue: { start: '8:00am', end: '4:00pm', mode: 'Virtual' },
                wed: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
                thu: { start: '8:00am', end: '4:00pm', mode: 'Virtual' },
                fri: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 4,
            name: "Sammy el Heladero",
            status: 1, // Estado inicial: 1 = Dentro, 2 = Fuera, 3 = Descanso
            registeredHours: [], // Registro de horas trabajadas
            startTime: null, // Hora de inicio de trabajo
            breakStart: null,
            email: "sammy.heladero@example.com",
            phone: "977777777",
            area: 5,
            sede: "Miraflores",
            institution: "SENATI",
            password: "Sammy el Heladero",
            latitude: -12.04318,
            longitude: -77.02824,
            schedule: {
                mon: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                tue: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                wed: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                thu: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                fri: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 5,
            name: "Peter Parker",
            status: 3, // Estado inicial: 1 = Dentro, 2 = Fuera, 3 = Descanso
            registeredHours: [], // Registro de horas trabajadas
            startTime: null, // Hora de inicio de trabajo
            breakStart: null,
            email: "peter.parker@example.com",
            phone: "911111111",
            area: 4,
            sede: "Casa de Señor Julio",
            institution: "SENATI",
            password: "Peter Parker",
            latitude: -12.0464,
            longitude: -77.0428,
            schedule: {
                mon: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '7:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '7:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        }
    ],
    areas:[
        {
            id: 1,
            name: "Android",
            schedule: {
                mon: { start: '5:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '5:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '5:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '5:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '5:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 2,
            name: "Ventas",
            schedule: {
                mon: { start: '6:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '6:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '6:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '6:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '6:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 3,
            name: "Marketing",
            schedule: {
                mon: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '7:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '7:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '7:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 4, name: "Soporte Tecnico",
            schedule: {
                mon: { start: '9:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '9:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '9:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '9:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '9:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }
        },
        {
            id: 5, name: "Analisis",
            schedule: {
                mon: { start: '10:00am', end: '3:00pm', mode: 'Virtual' },
                tue: { start: '10:00am', end: '3:00pm', mode: 'Presencial' },
                wed: { start: '10:00am', end: '3:00pm', mode: 'Virtual' },
                thu: { start: '10:00am', end: '3:00pm', mode: 'Presencial' },
                fri: { start: '10:00am', end: '3:00pm', mode: 'Virtual' },
                sat: { start: 'Libre', end: '', mode: '' },
                sun: { start: 'Libre', end: '', mode: '' }
            }

        },
    ],
    status: [
        {
            id: 1,
            name: "Dentro",
            color: '#36a2eb'
        },
        {
            id: 2,
            name: "Fuera",
            color: '#ff6384'
        },
        {
            id: 3,
            name: "Descanso",
            color: '#ffcd56'
        }
    ],
    admins: [
        {id: 1, name: "Bri", area:"Administración", password:"Bri"},
        {id: 2, name: "Señor Julio", area: "Boss", password: "Señor Julio"},
        {id: 3, name: "a", area: "Administración", password: "a"}
        // Otros administradores...
    ],
    statusChanges: [
        {
            id: 1,
            date: '2023-10-29',
            start: '08:00:00',
            end: '17:00:00',
            workerId: 1,
            statusId: 1,
            longitude: -76.991,
            latitude: -12.046,
            statusTime: '08:00:00'
        },
        {
            id: 2,
            date: '2023-10-29',
            start: '09:00:00',
            end: '18:00:00',
            workerId: 2,
            statusId: 2,
            longitude: -76.991,
            latitude: -12.046,
            statusTime: '09:00:00'
        }
    ],
    messages: [
        {
            from: 1, // ID del remitente
            to: 2, // ID del destinatario
            message: "Hola, ¿cómo estás?",
            timestamp: "2024-11-28T10:00:00Z" // ISO 8601
        },
        {
            from: 2,
            to: 1,
            message: "¡Todo bien! ¿Y tú?",
            timestamp: "2024-11-28T10:05:00Z"
        },
    ]
}

/**
 * @swagger
 * tags:
 *   - name: Workers
 *     description: Endpoints relacionados con los trabajadores
 *   - name: Status
 *     description: Endpoints relacionados con los estados
 */
function onInit(startYear, endYear, startMont, endMonth, startDay, endDay, weekdays) {
    for (let index in data.workers) {
        data.workers[index].status = data.status[Math.floor(Math.random() * data.status.length)].id;
        for (let year = startYear; year <= endYear; year++) {
            let stMonth = year === startYear ? startMont - 1 : 0;
            let edMonth = year === endYear ? endMonth - 1 : 11;

            for (let month = stMonth; month <= edMonth; month++) {
                let stDayCurrent = (year === startYear && month === stMonth) ? startDay : 1;
                let edDayCurrent = (year === endYear && month === edMonth) ? endDay : daysPerMonth(month, year);

                for (let day = stDayCurrent; day <= edDayCurrent; day++) {
                    if (getWeekDate(day, month, year) <= weekdays) {
                        if (!data.workers[index].registeredHours) {
                            data.workers[index].registeredHours = [];
                        }

                        data.workers[index].registeredHours.push({
                            year: year,
                            month: month + 1,
                            day: day,
                            weekday: getWeekDate(day, month, year),
                            fullDate:getFormattedDate(day, month, year),
                            Dentro: (Math.random() * (10 - 5) + 5).toFixed(2), // Aleatorio entre 5 y 10
                            Fuera: (Math.random() * (3 - 1) + 1).toFixed(2),  // Aleatorio entre 1 y 3
                            Descanso: (Math.random() * (2 - 1) + 1).toFixed(2), // Aleatorio entre 1 y 2
                        });
                    }
                }
            }
        }
    }
}


/**
 * @swagger
 * /api/v1/data:
 *   get:
 *     tags: [Workers]
 *     summary: Obtener lista de trabajadores
 *     description: Devuelve un array con todos los trabajadores registrados.
 *     responses:
 *       200:
 *         description: Lista de trabajadores exitosamente recuperada.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Juan Peterson"
 *                   registeredHours:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: object
 *                             properties:
 *                               day:
 *                                 type: object
 *                                 properties:
 *                                   dentro:
 *                                     type: string
 *                                     format: float
 *                                     example: "8.84"
 *                                   fuera:
 *                                     type: string
 *                                     format: float
 *                                     example: "2.83"
 *                                   descanso:
 *                                     type: string
 *                                     format: float
 *                                     example: "1.42"
 *                                   day:
 *                                     type: integer
 *                                     example: 3
 */
router.get("/data", (req, res) => {
    res.status(HttpStatusCode.Ok).send(data.workers);
});
/**
 * @swagger
 * /api/v1/worker/{id}:
 *   get:
 *     tags: [Workers]
 *     summary: Obtener información del trabajador
 *     description: Devuelve la información del trabajador especificado por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador a buscar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del trabajador exitosamente recuperada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Juan Peterson"
 *                 registeredHours:
 *                   type: object
 *                   properties:
 *                     "2023":
 *                       type: object
 *                       properties:
 *                         "11":
 *                           type: object
 *                           properties:
 *                             "15":
 *                               type: object
 *                               properties:
 *                                 dentro:
 *                                   type: string
 *                                   example: "8.84"
 *                                 fuera:
 *                                   type: string
 *                                   example: "2.83"
 *                                 descanso:
 *                                   type: string
 *                                   example: "1.42"
 *                                 day:
 *                                   type: integer
 *                                   example: 3
 *       404:
 *         description: Trabajador no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No existe un trabajador con el ID 25"
 *       400:
 *         description: ID del trabajador inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El parámetro ID del trabajador no fue proporcionado, o no tiene un formato correcto"
 */
router.get("/worker/:id", (req, res) => {
    let workerId = req.params.id; // Obtener el ID del trabajador de los parámetros de la URL
    console.log("Se solicitaron los datos del trabajador con el ID", workerId)

    if(!workerId || isNaN(workerId)){
        res.status(HttpStatusCode.BadRequest).json({
            message:"El parametro ID del trabajador no fue proporcionado, o no tiene un formato correcto"
        })
        return;
    }

    workerId = Number(workerId)

    // Buscar el trabajador en los datos
    for(let worker of data.workers){
        if(worker.id === workerId){
            res.status(HttpStatusCode.Ok).json(worker);
            return;
        }
    }
    // Si no se encuentra al trabajador, enviar un error 404
    res.status(HttpStatusCode.NotFound).json({
        message: `No existe un trabajador con el ID ${workerId}`
    });
});



router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("Intento de inicio de sesión con username:", username);

    if (!username || !password) {
        return res.status(400).json({
            message: "Faltan nombre de usuario o contraseña"
        });
    }

    // Usa data.admins para acceder a la lista de administradores
    const admin = data.admins.find(adm => adm.name === username && adm.password === password);

    if (admin) {
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            adminId: admin.id
        });
    } else {
        res.status(401).json({
            message: "Nombre de usuario o contraseña incorrectos"
        });
    }
});

module.exports = router;

/**
 * @swagger
 * /api/v1/workers/{statusId}:
 *   get:
 *     tags: [Workers]
 *     summary: Obtener trabajadores por su identificador de estado
 *     description: Devuelve una lista de trabajadores filtrados por el estado especificado.
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         description: Estado de los trabajadores a buscar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de trabajadores exitosamente recuperada.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Juan Peterson"
 *                   status:
 *                     type: string
 *                     example: "activo"
 *       400:
 *         description: Estado inválido solicitado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El estado solicitado no existe en la lista de estados posibles"
 *       404:
 *         description: No se encontraron trabajadores con el estado especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No existen trabajadores con el estado activo"
 */
// Endpoint para obtener los trabajadores por estado
/**
 * @swagger
 * /api/v1/workers/{id}:
 *   put:
 *     tags: [Workers]
 *     summary: Actualizar un trabajador existente
 *     description: Actualiza la información de un trabajador, modificando solo los campos permitidos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Peterson"
 *               email:
 *                 type: string
 *                 example: "juan.peterson@example.com"
 *               phone:
 *                 type: string
 *                 example: "987654321"
 *               area:
 *                 type: string
 *                 example: "Desarrollo"
 *               institution:
 *                 type: string
 *                 example: "SENATI"
 *     responses:
 *       200:
 *         description: Trabajador actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trabajador actualizado correctamente."
 *                 worker:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     area:
 *                       type: string
 *                     institution:
 *                       type: string
 *       400:
 *         description: Los datos proporcionados no son válidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Los datos proporcionados no son válidos."
 *       404:
 *         description: Trabajador no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trabajador no encontrado."
 */
router.put("/workers/:id", (req, res) => {
    const workerId = parseInt(req.params.id);
    const { name, email, phone, area, institution } = req.body;

    // Encontrar el trabajador por ID
    const workerIndex = data.workers.findIndex(worker => worker.id === workerId);
    if (workerIndex === -1) {
        return res.status(HttpStatusCode.NotFound).json({ message: "Trabajador no encontrado." });
    }

    // Validación de campos requeridos
    if (!name && !email && !phone && !area && !institution) {
        return res.status(HttpStatusCode.BadRequest).json({ message: "Los datos proporcionados no son válidos." });
    }

    // Actualizar solo los campos permitidos
    const worker = data.workers[workerIndex];
    if (name) worker.name = name;
    if (email) worker.email = email;
    if (phone) worker.phone = phone;
    if (area) worker.area = area;
    if (institution) worker.institution = institution;

    // Responder con el trabajador actualizado
    res.status(HttpStatusCode.Ok).json({
        message: "Trabajador actualizado correctamente.",
        worker
    });
});

module.exports = router;

/**
 * @swagger
 * /api/v1/worker/{id}/status/{status}:
 *   put:
 *     tags: [Workers]
 *     summary: Actualizar estado del trabajador
 *     description: Actualiza el estado de un trabajador especificado por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajador a actualizar.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: status
 *         required: true
 *         description: Nuevo estado del trabajador.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado del trabajador actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Juan Peterson"
 *                 status:
 *                   type: string
 *                   example: "Dentro"
 *       400:
 *         description: ID del trabajador o estado inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El estado solicitado no existe en la lista de estados posibles"
 *       404:
 *         description: No se encontró un trabajador con el ID especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No existe un trabajador con el ID 25"
 */



/**
 * @swagger
 * /api/v1/statuses:
 *   get:
 *     tags: [Status]
 *     summary: Obtener todos los estados
 *     description: Devuelve una lista de todos los estados disponibles.
 *     responses:
 *       200:
 *         description: Lista de estados recuperada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Dentro"
 */
router.get("/statuses", (req, res) => {
    res.status(HttpStatusCode.Ok).json(data.status);
});
/**
 * @swagger
 * /api/v1/statuses/{index}:
 *   put:
 *     tags: [Status]
 *     summary: Actualizar un estado existente
 *     description: Actualiza el estado en la posición especificada por el índice.
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         description: Índice del estado a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Descanso"
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estado en la posición 1 actualizado a 'Descanso'."
 *       400:
 *         description: El nuevo estado no fue proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El nuevo estado debe ser proporcionado."
 *       404:
 *         description: El índice no existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El estado solicitado no existe."
 */
router.put("/statuses/:index", (req, res) => {
    const index = parseInt(req.params.index, 10);
    const newStatus = req.body.status;

    if (!newStatus) {
        return res.status(HttpStatusCode.BadRequest).json({
            message: "El nuevo estado debe ser proporcionado."
        });
    }

    if (index < 0 || index >= data.status.length) {
        return res.status(HttpStatusCode.NotFound).json({
            message: "El indice del estado esta fuera de rango"
        });
    }
    let previousStatus = data.status[index]
    data.status[index] = newStatus;
    res.status(HttpStatusCode.Ok).json({
        message: `Estado "${previousStatus}" actualizado a "${newStatus}".`
    });
});
/**
 * @swagger
 * /api/v1/statuses:
 *   post:
 *     tags: [Status]
 *     summary: Crear un nuevo estado
 *     description: Crea un nuevo estado y lo agrega a la lista.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "En Progreso"
 *     responses:
 *       201:
 *         description: Estado creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estado 'En Progreso' creado con éxito."
 *       400:
 *         description: El estado no fue proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El estado debe ser proporcionado."
 *       409:
 *         description: El estado ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El estado ya existe."
 */
router.post("/statuses", (req, res) => {
    const newStatus = req.body.status;

    if (!newStatus) {
        return res.status(HttpStatusCode.BadRequest).json({
            message: "El estado debe ser proporcionado."
        });
    }

    if (data.status.includes(newStatus)) {
        return res.status(HttpStatusCode.Conflict).json({
            message: "El estado ya existe."
        });
    }

    data.status.push(newStatus);
    res.status(HttpStatusCode.Created).json({
        message: `Estado "${newStatus}" creado con éxito.`
    });
});

router.post("/data", (req, res) => {
    const { name, email, phone, area, sede, institution, password, } = req.body;

    // Validar que todos los campos están presentes
    if (!name || !email || !phone || !area || !institution || !password  || !startTime || !breakStart || !sede) {
        return res.status(HttpStatusCode.BadRequest).json({
            message: "Todos los campos son obligatorios"
        });
    }

    // Crear un nuevo trabajador con un ID único
    const newWorker = {
        id: ++lastUsedUserId, // Incrementa el ID automáticamente
        name,
        email,
        phone,
        area,
        institution,
        sede,
        password,
        startTime:0,
        breakStart:0,
        longitude: 0,
        latitude:0,
        status: 1, // Estado por defecto (Dentro)
        registeredHours: [] // Iniciar con horas registradas vacías
        //todo como hacemos con el horariooooo, aqui tenemos que pasar el schedule: { thu: start break end}
    };

    // Añadir el nuevo trabajador a la lista de trabajadores
    data.workers.push(newWorker);

    // Enviar una respuesta de éxito
    res.status(HttpStatusCode.Created).json({
        message: "Miembro añadido correctamente",
        worker: newWorker
    });
});

router.post("/admin/register", (req, res) => {
    const { name, area, password } = req.body;

    // Validar que todos los campos están presentes
    if (!name || !area || !password) {
        return res.status(HttpStatusCode.BadRequest).json({
            message: "Todos los campos son obligatorios."
        });
    }

    // Crear un nuevo administrador con un ID único
    const newAdmin = {
        id: data.admins.length + 1, // Generar ID único
        name,
        area,
        password
    };

    // Añadir el nuevo administrador a la lista de administradores
    data.admins.push(newAdmin);

    // Enviar una respuesta de éxito
    res.status(HttpStatusCode.Created).json({
        message: "Administrador registrado correctamente.",
        admin: newAdmin
    });
});

router.post("/worker/register", (req, res) => {
    const { name, email, phone, area, sede, institution, schedule } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!name || !email || !phone || !area || !sede || !institution || !schedule) {
        return res.status(HttpStatusCode.BadRequest).json({
            message: "Todos los campos son obligatorios."
        });
    }

    // Crear un nuevo trabajador con un ID único
    const newWorker = {
        id: ++lastUsedUserId, // Incrementa automáticamente el ID
        name,
        email,
        phone,
        area,
        sede,
        institution,
        status: 1, // Estado por defecto (Dentro)
        schedule, // Horario pasado en el cuerpo de la solicitud
        registeredHours: [] // Iniciar con horas registradas vacías
    };

    // Añadir el nuevo trabajador a la lista de trabajadores
    data.workers.push(newWorker);

    // Enviar una respuesta de éxito
    res.status(HttpStatusCode.Created).json({
        message: "Trabajador registrado correctamente.",
        worker: newWorker
    });
});


// Endpoint para crear un nuevo registro de Status_change
router.post("/status_change", (req, res) => {
    const { date, inicio, fin, Workers_id, status_id, longitud, latitud, status_time } = req.body;

    // Validación de campos requeridos
    if (!date || !inicio || !fin || !Workers_id || !status_id || longitud === undefined || latitud === undefined || !status_time) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Generar un nuevo ID para el cambio de estado
    const newStatusChange = {
        id: statusChanges.length + 1,
        date,
        inicio,
        fin,
        Workers_id,
        status_id,
        longitud,
        latitud,
        status_time
    };

    // Agregar el nuevo cambio de estado a la lista
    statusChanges.push(newStatusChange);

    // Respuesta exitosa
    res.status(201).json({
        message: "Cambio de estado registrado correctamente.",
        status_change: newStatusChange
    });
});

router.post("/worker/login", (req, res) => {
    const { email, password } = req.body;

    // Validación de campos
    if (!email || !password) {
        return res.status(400).json({ message: "El correo y la contraseña son obligatorios." });
    }

    // Buscar al trabajador por email
    const worker = data.workers.find(worker => worker.email === email);

    if (!worker) {
        // Si el trabajador no existe
        return res.status(404).json({ message: "No se encontró un trabajador con ese correo." });
    }

    // Verificar la contraseña
    if (worker.password !== password) {
        return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Si el inicio de sesión es exitoso
    res.status(200).json({
        message: "Inicio de sesión exitoso",
        worker: {
            id: worker.id,
            name: worker.name,
            email: worker.email,
            area: worker.area,
            sede: worker.sede,
            institution: worker.institution
        }
    });
});

// En tu archivo de rutas en el servidor (e.g., routes.js)
router.put('/worker/:id/schedule', (req, res) => {
    const { id } = req.params;
    const updatedSchedule = req.body;

    // Encuentra al trabajador y actualiza su horario
    const worker = data.workers.find(worker => worker.id === parseInt(id));
    if (worker) {
        worker.schedule = updatedSchedule;
        res.status(HttpStatusCode.Ok).json({ message: "Horario actualizado correctamente." });
    } else {
        res.status(HttpStatusCode.BadRequest).json({ message: "Trabajador no encontrado." });
    }
});

router.put("/worker/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const worker = data.workers.find(worker => worker.id === parseInt(id));
    if (worker) {
        const currentTime = new Date();
        const today = currentTime.toISOString().slice(0, 10); // Fecha actual (YYYY-MM-DD)

        // Si el trabajador estaba trabajando o descansando, calculamos las horas
        if (worker.startTime && (status === 2 || status === 3)) {
            const hoursWorked = (currentTime - new Date(worker.startTime)) / (1000 * 60 * 60);
            const type = worker.status === 1 ? "Trabajo" : "Descanso";

            // Registrar las horas en registeredHours
            const existingRecord = worker.registeredHours.find(r => r.date === today);
            if (existingRecord) {
                existingRecord[type] += hoursWorked;
            } else {
                worker.registeredHours.push({ date: today, Trabajo: 0, Descanso: 0, Extras: 0, [type]: hoursWorked });
            }
        }

        // Actualizamos el estado y la hora de inicio si es necesario
        worker.status = status;
        worker.startTime = status === 1 ? currentTime : null;

        res.status(200).json({ message: "Estado actualizado correctamente.", worker });
    } else {
        res.status(404).json({ message: "Trabajador no encontrado." });
    }
});


router.get("/api/v1/area/id/:name", (req, res) => {
    const { name } = req.params;
    const area = data.areas.find(area => area.name === name);
    if (area) {
        res.status(200).json({ id: area.id });
    } else {
        res.status(404).json({ message: "Área no encontrada." });
    }
});


router.get("/area/name/:id", (req, res) => {
    const { id } = req.params;
    const area = data.areas.find(area => area.id === parseInt(id)); // Buscar área por ID
    if (area) {
        res.status(HttpStatusCode.Ok).json({ name: area.name }); // Devuelve el nombre del área
    } else {
        res.status(HttpStatusCode.NotFound).json({ message: "Área no encontrada." });
    }
});


router.get("/area/schedule/:id", (req, res) => {
    const { id } = req.params;
    const area = data.areas.find(area => area.id === parseInt(id));
    if (area) {
        res.status(HttpStatusCode.Ok).json({ schedule: area.schedule });
    } else {
        res.status(HttpStatusCode.NotFound).json({ message: "Trabajador no encontrado." });
    }
});

router.get("/area/name", (req, res) => {
    const areaNames = data.areas.map(area => ({ name: area.name, id: area.id }));
    res.status(200).json(areaNames);
});

router.post("/messages", (req, res) => {
    const { from, to, message } = req.body;

    // Validar que todos los campos estén presentes
    if (!from || !to || !message) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const newMessage = {
        from,
        to,
        message,
        timestamp: new Date().toISOString() // Fecha actual en formato ISO
    };

    // Agregar el mensaje al arreglo de mensajes
    data.messages.push(newMessage);

    res.status(201).json({ message: "Mensaje enviado exitosamente.", newMessage });
});

// Ruta para obtener los mensajes entre dos usuarios
router.get("/messages/:from/:to", (req, res) => {
    const { from, to } = req.params;

    // Filtrar los mensajes entre `from` y `to`
    const chatMessages = data.messages.filter(
        msg =>
            (msg.from === parseInt(from) && msg.to === parseInt(to)) ||
            (msg.from === parseInt(to) && msg.to === parseInt(from))
    );

    res.json(chatMessages);
});

router.get("/admins", (req, res) => {
    res.status(HttpStatusCode.Ok).send(data.admins);
});


module.exports = {router, onInit};