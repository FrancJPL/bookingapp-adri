const { getConnection } = require('./config/db');

async function migrateCenters() {
    try {
        const pool = await getConnection();
        console.log("Migrando centros/locales...");

        // 1. Crear tabla de locales
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'locales')
            BEGIN
                CREATE TABLE locales (
                    id_local INT IDENTITY(1,1) PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    direccion VARCHAR(255),
                    telefono VARCHAR(20),
                    id_categoria INT NOT NULL,
                    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
                );
                PRINT 'Tabla locales creada.';
            END
        `);

        // 2. Insertar locales para Peluquería (id_categoria = 1)
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM locales WHERE nombre = 'Style & Gold - Centro')
            BEGIN
                INSERT INTO locales (nombre, direccion, id_categoria) 
                VALUES ('Style & Gold - Centro', 'Calle Mayor, 15, Madrid', 1);
            END

            IF NOT EXISTS (SELECT 1 FROM locales WHERE nombre = 'The Barber Shop - Norte')
            BEGIN
                INSERT INTO locales (nombre, direccion, id_categoria) 
                VALUES ('The Barber Shop - Norte', 'Av. de la Castellana, 200, Madrid', 1);
            END

            IF NOT EXISTS (SELECT 1 FROM locales WHERE nombre = 'Elite Padel Club - Las Rozas')
            BEGIN
                INSERT INTO locales (nombre, direccion, id_categoria) 
                VALUES ('Elite Padel Club - Las Rozas', 'Polígono Európolis, Nave 4', 2);
            END
        `);

        // 3. Añadir id_local a usuarios (empleados)
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'id_local')
            BEGIN
                ALTER TABLE usuarios ADD id_local INT;
                ALTER TABLE usuarios ADD CONSTRAINT FK_usuario_local FOREIGN KEY (id_local) REFERENCES locales(id_local);
                PRINT 'Columna id_local añadida a usuarios.';
            END
        `);

        // 4. Asignar empleados existentes al primer local de su categoría
        await pool.request().query(`
            UPDATE usuarios SET id_local = 1 WHERE id_categoria = 1 AND id_rol IN (2,3);
            UPDATE usuarios SET id_local = 3 WHERE id_categoria = 2 AND id_rol IN (2,3);
        `);

        // 5. Añadir id_local a reservas
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('reservas') AND name = 'id_local')
            BEGIN
                ALTER TABLE reservas ADD id_local INT;
                ALTER TABLE reservas ADD CONSTRAINT FK_reserva_local FOREIGN KEY (id_local) REFERENCES locales(id_local);
                PRINT 'Columna id_local añadida a reservas.';
            END
        `);

        console.log("✅ Migración de centros completada.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error migrando centros:", err);
        process.exit(1);
    }
}

migrateCenters();
