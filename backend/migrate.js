const { getConnection, sql } = require('./config/db');

async function migrate() {
    try {
        const pool = await getConnection();
        console.log("Conectado para la migración...");

        // 1. Crear tabla de categorías
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categorias')
            BEGIN
                CREATE TABLE categorias (
                    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL,
                    slug VARCHAR(50) UNIQUE NOT NULL,
                    color_accent VARCHAR(20),
                    imagen_path VARCHAR(255)
                );
                PRINT 'Tabla categorias creada.';
            END
        `);

        // 2. Insertar categorías iniciales
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'peluqueria')
            BEGIN
                INSERT INTO categorias (nombre, slug, color_accent) 
                VALUES ('Peluquería', 'peluqueria', '#D4AF37');
            END

            IF NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'padel')
            BEGIN
                INSERT INTO categorias (nombre, slug, color_accent) 
                VALUES ('Padel', 'padel', '#BFFF00');
            END
        `);

        // 3. Añadir id_categoria a servicios si no existe
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('servicios') AND name = 'id_categoria')
            BEGIN
                ALTER TABLE servicios ADD id_categoria INT;
                PRINT 'Columna id_categoria añadida a servicios.';
            END
        `);

        // 4. Añadir id_categoria a usuarios (para separar empleados por sector)
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'id_categoria')
            BEGIN
                ALTER TABLE usuarios ADD id_categoria INT;
                PRINT 'Columna id_categoria añadida a usuarios.';
            END
        `);

        // 5. Asignar servicios actuales a Peluquería (id=1)
        await pool.request().query(`
            UPDATE servicios SET id_categoria = 1 WHERE id_categoria IS NULL;
            UPDATE usuarios SET id_categoria = 1 WHERE id_rol IN (2,3) AND id_categoria IS NULL;
        `);

        console.log("✅ Migración completada con éxito.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error en la migración:", err);
        process.exit(1);
    }
}

migrate();
