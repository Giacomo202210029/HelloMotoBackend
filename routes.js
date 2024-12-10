const express = require("express");

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

const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON donde se guardarán los datos
const dataFilePath = path.join(__dirname, 'data.json');

// Leer los datos desde el archivo al iniciar la aplicación
function loadData() {
    try {
        // Leer el archivo JSON y parsear su contenido
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(rawData); // Retorna los datos como objeto
    } catch (err) {
        console.log('Error al leer el archivo:', err);
        // Si ocurre un error (como que el archivo no existe), retornar datos por defecto
        return { workers: [], areas: [], status: [], admins: [], statusChanges: [], messages: [] };
    }
}

// Guardar los datos en el archivo JSON
function saveData(data) {
    try {
        // Convertir el objeto a una cadena JSON con formato bonito
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(dataFilePath, jsonData, 'utf8'); // Guardar el archivo
        console.log('Datos guardados correctamente');
    } catch (err) {
        console.log('Error al guardar el archivo:', err);
    }
}

// Inicializar los datos al cargar el servidor
let data = loadData();





/**
 * @swagger
 * tags:
 *   - name: Workers
 *     description: Endpoints relacionados con los trabajadores
 *   - name: Status
 *     description: Endpoints relacionados con los estados
 */
/*
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
*/
function onInit(startYear, endYear, startMont, endMonth, startDay, endDay, weekdays){}

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
    saveData(data);
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
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            adminId: admin.id
        });
    } else {
        return res.status(401).json({
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
    saveData(data)
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
    saveData(data)
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
    saveData(data)
});

router.post("/data", (req, res) => {
    const { name, email, phone, area, sede, institution, password, startTime, breakStart, schedule } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!name || !email || !phone || !area || !institution || !password || !sede) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios."
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
        startTime: startTime || 0,  // Si no se pasa, se usa 0 por defecto
        breakStart: breakStart || 0, // Lo mismo para breakStart
        longitude: 0,
        latitude: 0,
        status: 1, // Estado por defecto (Dentro)
        registeredHours: [], // Iniciar con horas registradas vacías
        schedule,
    };

    // Añadir el nuevo trabajador a la lista de trabajadores
    data.workers.push(newWorker);

    // Guardar los datos actualizados en el archivo
    saveData(data); // Asegúrate de guardar los cambios en el archivo

    // Enviar una respuesta de éxito
    res.status(201).json({
        message: "Trabajador añadido correctamente",
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
    saveData(data)
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
    saveData(data)
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
    saveData(data)
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

    // Si el inicio de sesión es exitoso, devolver los datos del trabajador
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
    saveData(data)
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
                worker.registeredHours.push({ date: today, worked: 0, break: 0, overtime: 0, [type]: hoursWorked });
            }
        }

        // Actualizamos el estado y la hora de inicio si es necesario
        worker.status = status;
        worker.startTime = status === 1 ? currentTime : null;

        res.status(200).json({ message: "Estado actualizado correctamente.", worker });
    } else {
        res.status(404).json({ message: "Trabajador no encontrado." });
    }
    saveData(data)
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

router.post("/area/schedule", (req, res) => {
    const { id, schedule } = req.body; // Datos recibidos en el cuerpo de la solicitud

    if (!id || !schedule) {
        return res.status(HttpStatusCode.BadRequest).json({ message: "ID y horario son requeridos." });
    }

    const existingArea = data.areas.find(area => area.id === parseInt(id));

    if (existingArea) {
        existingArea.schedule = schedule; // Actualiza el horario si el área ya existe
        res.status(HttpStatusCode.Ok).json({ message: "Horario actualizado con éxito.", area: existingArea });
    } else {
        const newArea = { id: parseInt(id), schedule }; // Crea una nueva área con el ID y horario
        data.areas.push(newArea);
        res.status(HttpStatusCode.Created).json({ message: "Área creada con éxito.", area: newArea });
    }
});


router.get("/area/name", (req, res) => {
    const areaNames = data.areas.map(area => ({ name: area.name, id: area.id }));
    res.status(200).json(areaNames);
});

router.post("/messages", (req, res) => {
    const { from, to, message } = req.body;

    console.log("Datos recibidos en POST /messages:", req.body);

    if (!from || !to || !message) {
        console.error("Error: Datos incompletos en el payload");
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const newMessage = {
        from,
        to,
        message,
        timestamp: new Date().toISOString(),
    };

    // Guardar el mensaje en el arreglo
    data.messages.push(newMessage);
    console.log("Mensaje almacenado en el backend:", newMessage);

    res.status(201).json({ message: "Mensaje enviado exitosamente.", newMessage });
    saveData(data)
});


router.get("/messages/:from/:to", (req, res) => {
    const { from, to } = req.params;

    const chatMessages = data.messages.filter(
        (msg) =>
            (msg.from.toString() === from && msg.to.toString() === to) ||
            (msg.from.toString() === to && msg.to.toString() === from)
    );

    console.log(`Historial encontrado (${from} ↔ ${to}):`, chatMessages);
    res.json(chatMessages);
});



router.get("/admins", (req, res) => {
    res.status(HttpStatusCode.Ok).send(data.admins);
});

router.put('/area/schedule/:id', (req, res) => {
    const areaId = parseInt(req.params.id);
    const updatedSchedule = req.body.schedule; // El frontend envía el objeto completo del horario

    // Buscar el área por ID
    const area = data.areas.find((a) => a.id === areaId);

    if (!area) {
        return res.status(404).json({ error: 'Area not found' });
    }

    // Validar si el objeto `schedule` es válido
    if (!updatedSchedule || typeof updatedSchedule !== 'object') {
        return res.status(400).json({ error: 'Invalid schedule format' });
    }

    // Reemplazar el objeto completo de schedule
    area.schedule = updatedSchedule;

    saveData(data)

    return res.status(200).json({
        message: 'Schedule updated successfully',
        area,
    });
});
router.post('/areas', (req, res) => {
    const { name, schedule } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

// Validar si el nombre del área ya existe
    const existingArea = data.areas.find((a) => a.name === name);

    if (existingArea) {
        return res.status(409).json({ error: 'Area already exists' });
    }

    //validar si el horario existe
    if (schedule && typeof schedule !== 'object') {
        return res.status(400).json({ error: 'Invalid schedule format' });
    }



    const newArea = {
        id: data.areas.length + 1, // Generar un ID único
        name,
        schedule, // Inicialmente vacío
    };

    data.areas.push(newArea);

    return res.status(201).json({ message: 'Area created successfully', area: newArea });
});




router.put("/worker/:id/location", (req, res) => {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    // Encontrar al trabajador por ID
    const worker = data.workers.find(worker => worker.id === parseInt(id));
    if (!worker) {
        return res.status(404).json({ message: "Trabajador no encontrado." });
    }

    // Actualizar latitud y longitud
    worker.latitude = latitude;
    worker.longitude = longitude;

    // Guardar los cambios
    saveData(data); // Método para guardar en la base de datos o archivo
    res.status(200).json({ message: "Ubicación actualizada correctamente.", worker });
});

router.get("/admin/:id", (req, res) => {
    const { id } = req.params;
    const admin = data.admins.find(admin => admin.id === parseInt(id));

    if (!admin) {
        return res.status(404).json({ message: "Administrador no encontrado." });
    }

    res.status(200).json(admin);
});






module.exports = {router, onInit};