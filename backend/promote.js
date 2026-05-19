const { getConnection } = require('./config/db');

async function elevate() {
    const email = process.argv[2];
    if (!email) {
        console.log("Uso: node promote.js correo@ejemplo.com");
        process.exit(1);
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('email', email)
            .query("UPDATE usuarios SET id_rol = 3 WHERE email = @email");

        if (result.rowsAffected[0] > 0) {
            console.log(`✅ Usuario ${email} ahora es ADMINISTRADOR.`);
        } else {
            console.log(`❌ No se encontró ningún usuario con el correo ${email}.`);
        }
        process.exit(0);
    } catch (err) {
        console.error("❌ Error al elevar usuario:", err);
        process.exit(1);
    }
}

elevate();
