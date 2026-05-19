require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getConnection, sql } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;
    try {
        const pool = await getConnection();
        // Por defecto rol 'cliente' (id_rol = 1 según el SQL)
        await pool.request()
            .input('nombre', nombre)
            .input('apellidos', apellidos)
            .input('email', email)
            .input('password_hash', password) // Simple por ahora
            .input('id_rol', 1) 
            .query(`
                INSERT INTO usuarios (nombre, apellidos, email, password_hash, id_rol)
                VALUES (@nombre, @apellidos, @email, @password_hash, @id_rol)
            `);
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login simple
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('email', email)
            .input('password', password)
            .query("SELECT id_usuario, nombre, id_rol FROM usuarios WHERE email = @email AND password_hash = @password");
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DATA ROUTES ---

// Listar servicios por categoría
app.get('/api/servicios', async (req, res) => {
    const { categoria } = req.query; // Puede venir el slug (ej: ?categoria=peluqueria)
    try {
        const pool = await getConnection();
        let query = "SELECT s.* FROM servicios s";
        let request = pool.request();

        if (categoria) {
            query += " JOIN categorias c ON s.id_categoria = c.id_categoria WHERE c.slug = @categoria AND s.activo = 1";
            request.input('categoria', categoria);
        } else {
            query += " WHERE activo = 1";
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar empleados por categoría y/o local
app.get('/api/empleados', async (req, res) => {
    const { categoria, id_local } = req.query;
    try {
        const pool = await getConnection();
        let query = "SELECT u.id_usuario, u.nombre FROM usuarios u";
        let request = pool.request();

        let whereClauses = ["u.id_rol IN (2,3)", "u.activo = 1"];
        
        if (categoria) {
            query += " JOIN categorias c ON u.id_categoria = c.id_categoria";
            whereClauses.push("c.slug = @categoria");
            request.input('categoria', categoria);
        }

        if (id_local) {
            whereClauses.push("u.id_local = @id_local");
            request.input('id_local', id_local);
        }

        if (whereClauses.length > 0) {
            query += " WHERE " + whereClauses.join(" AND ");
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar locales por categoría
app.get('/api/locales', async (req, res) => {
    const { categoria } = req.query;
    try {
        const pool = await getConnection();
        let query = "SELECT l.* FROM locales l";
        let request = pool.request();

        if (categoria) {
            query += " JOIN categorias c ON l.id_categoria = c.id_categoria WHERE c.slug = @categoria";
            request.input('categoria', categoria);
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RESERVATION ROUTES ---

// Obtener disponibilidad de slots
app.get('/api/disponibilidad', async (req, res) => {
    const { fecha, id_empleado, id_servicio } = req.query;

    if (!fecha || !id_empleado || !id_servicio) {
        return res.status(400).json({ error: "Faltan parámetros (fecha, id_empleado, id_servicio)" });
    }

    try {
        const pool = await getConnection();
        
        // 1. Obtener duración del servicio
        const serviceResult = await pool.request()
            .input('id_servicio', id_servicio)
            .query("SELECT duracion_minutos FROM servicios WHERE id_servicio = @id_servicio");
        
        if (serviceResult.recordset.length === 0) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }
        const duracion = serviceResult.recordset[0].duracion_minutos;

        // 2. Obtener reservas existentes para ese día y empleado
        const reservationsResult = await pool.request()
            .input('fecha', fecha)
            .input('id_empleado', id_empleado)
            .query(`
                SELECT hora_inicio, hora_fin 
                FROM reservas 
                WHERE fecha = @fecha 
                AND id_empleado = @id_empleado 
                AND estado <> 'cancelada'
            `);
        
        const existingReservations = reservationsResult.recordset.map(r => ({
            start: timeToMinutes(r.hora_inicio),
            end: timeToMinutes(r.hora_fin)
        }));

        // 3. Definir horarios (09:00-14:00 y 16:00-20:00)
        const sessions = [
            { start: 9 * 60, end: 14 * 60 },
            { start: 16 * 60, end: 20 * 60 }
        ];

        // 4. Generar slots (cada 15 minutos)
        const availableSlots = [];
        const interval = 15;

        for (const session of sessions) {
            for (let t = session.start; t + duracion <= session.end; t += interval) {
                const slotEnd = t + duracion;
                
                // Comprobar solapamiento
                const overlap = existingReservations.some(res => {
                    return (t < res.end && slotEnd > res.start);
                });

                if (!overlap) {
                    availableSlots.push(minutesToTime(t));
                }
            }
        }

        res.json(availableSlots);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper functions for time conversion
function timeToMinutes(timeInput) {
    // Si viene como objeto Date de mssql
    if (timeInput instanceof Date) {
        return timeInput.getUTCHours() * 60 + timeInput.getUTCMinutes();
    }
    // Si viene como string HH:mm:ss
    const [h, m] = timeInput.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Crear reserva
app.post('/api/reservas', async (req, res) => {
    const { id_cliente, id_empleado, id_servicio, id_local, fecha, hora_inicio, observaciones } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .input('id_empleado', sql.Int, id_empleado)
            .input('id_servicio', sql.Int, id_servicio)
            .input('id_local', sql.Int, id_local)
            .input('fecha', sql.Date, fecha)
            .input('hora_inicio', sql.VarChar, hora_inicio)
            .input('observaciones', sql.Text, observaciones)
            .query(`
                INSERT INTO reservas (id_cliente, id_empleado, id_servicio, id_local, fecha, hora_inicio, observaciones)
                VALUES (@id_cliente, @id_empleado, @id_servicio, @id_local, @fecha, @hora_inicio, @observaciones)
            `);
        res.status(201).json({ message: "Reserva creada con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar mis reservas
app.get('/api/reservas/usuario/:id', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_usuario', req.params.id)
            .query(`
                SELECT r.*, s.nombre as servicio_nombre, u.nombre as empleado_nombre, l.nombre as local_nombre
                FROM reservas r
                JOIN servicios s ON r.id_servicio = s.id_servicio
                JOIN usuarios u ON r.id_empleado = u.id_usuario
                LEFT JOIN locales l ON r.id_local = l.id_local
                WHERE r.id_cliente = @id_usuario
                ORDER BY r.fecha DESC, r.hora_inicio DESC
            `);
        
        const formatted = result.recordset.map(r => ({
            ...r,
            hora_inicio: minutesToTime(timeToMinutes(r.hora_inicio)),
            hora_fin: r.hora_fin ? minutesToTime(timeToMinutes(r.hora_fin)) : null
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar citas de un empleado
app.get('/api/reservas/empleado/:id', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_usuario', req.params.id)
            .query(`
                SELECT r.*, s.nombre as servicio_nombre, c.nombre as cliente_nombre, l.nombre as local_nombre
                FROM reservas r
                JOIN servicios s ON r.id_servicio = s.id_servicio
                JOIN usuarios c ON r.id_cliente = c.id_usuario
                LEFT JOIN locales l ON r.id_local = l.id_local
                WHERE r.id_empleado = @id_usuario
                ORDER BY r.fecha DESC, r.hora_inicio DESC
            `);
        
        const formatted = result.recordset.map(r => ({
            ...r,
            hora_inicio: minutesToTime(timeToMinutes(r.hora_inicio)),
            hora_fin: r.hora_fin ? minutesToTime(timeToMinutes(r.hora_fin)) : null
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar estado de una reserva
app.patch('/api/reservas/:id/estado', async (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_reserva', id)
            .input('estado', estado)
            .query("UPDATE reservas SET estado = @estado WHERE id_reserva = @id_reserva");
        res.json({ message: "Estado actualizado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---

// Estadísticas globales para Admin
app.get('/api/admin/stats', async (req, res) => {
    try {
        const pool = await getConnection();
        const stats = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM reservas) as total_reservas,
                (SELECT COUNT(*) FROM usuarios WHERE id_rol = 1) as total_clientes,
                (SELECT COUNT(*) FROM servicios) as total_servicios
        `);
        res.json(stats.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar todas las reservas (Admin)
app.get('/api/admin/reservas', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT r.*, s.nombre as servicio_nombre, u.nombre as empleado_nombre, c.nombre as cliente_nombre, l.nombre as local_nombre
            FROM reservas r
            JOIN servicios s ON r.id_servicio = s.id_servicio
            JOIN usuarios u ON r.id_empleado = u.id_usuario
            JOIN usuarios c ON r.id_cliente = c.id_usuario
            LEFT JOIN locales l ON r.id_local = l.id_local
            ORDER BY r.fecha DESC, r.hora_inicio DESC
        `);
        
        const formatted = result.recordset.map(r => ({
            ...r,
            hora_inicio: minutesToTime(timeToMinutes(r.hora_inicio)),
            hora_fin: r.hora_fin ? minutesToTime(timeToMinutes(r.hora_fin)) : null
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

