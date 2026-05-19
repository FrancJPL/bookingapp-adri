const sql = require("mssql")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

const config = {
    user: process.env.DB_USER || "sa",                // tu usuario
    password: process.env.DB_PASSWORD || "aG2135ag", // tu contraseña de sa
    server: process.env.DB_SERVER || "127.0.0.1",       // solo la IP
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 11433,               // puerto separado
    database: process.env.DB_NAME || "BOOKING_APP_M12",           // tu base de datos
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
}

const connectDB = async () => {
    try {
        await sql.connect(config)
        console.log("Conectado a SQL Server")
    } catch (error) {
        console.log("Error de conexión:", error)
    }
}

module.exports = connectDB

async function prueba() {
    try {
        const pool = await sql.connect(config); // 👈 ESPERA conexión
        console.log("✅ Conectado a SQL Server");

        const result = await pool.request()
            .query("SELECT GETDATE() AS fecha");

        console.log(result.recordset);

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

// prueba();



async function getConnection() {
    return await sql.connect(config);
}

module.exports = {
    sql,
    getConnection
};