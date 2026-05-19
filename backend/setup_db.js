const sql = require("mssql")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const configBase = {
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "aG2135ag",
    server: process.env.DB_SERVER || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 11433,
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
}

async function runSQLFile(pool, filePath) {
    const sqlScript = fs.readFileSync(filePath, "utf8");
    // Split by GO statements on their own line (handling windows and mac line endings)
    const statements = sqlScript.split(/\r?\n\s*GO\s*\r?\n/i);
    for (let statement of statements) {
        statement = statement.trim();
        if (statement.length === 0) continue;
        
        // Skip USE, DROP DATABASE and CREATE DATABASE statements because we handle this programmatically
        const stmtUpper = statement.toUpperCase();
        if (stmtUpper.startsWith("USE ") || 
            stmtUpper.includes("DROP DATABASE") || 
            stmtUpper.includes("CREATE DATABASE")) {
            continue;
        }

        try {
            await pool.request().query(statement);
        } catch (err) {
            // If it's login/user/role already exists, we can ignore it
            if (err.message.includes("already exists") || err.message.includes("AlreadyExists")) {
                console.log(`⚠️  Warning: ${err.message.split('.')[0]}`);
            } else {
                console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
                console.error(err);
                throw err;
            }
        }
    }
}

async function setup() {
    console.log("Starting Database Setup...");
    
    // Connect to master database first to create the target database if it doesn't exist
    const masterConfig = { ...configBase, database: "master" };
    let pool;
    const maxRetries = 12;
    const retryDelay = 5000; // 5 seconds
    
    for (let i = 1; i <= maxRetries; i++) {
        try {
            console.log(`[Attempt ${i}/${maxRetries}] Connecting to SQL Server at ${masterConfig.server}:${masterConfig.port} (database: master)...`);
            pool = await sql.connect(masterConfig);
            console.log("Connected to master database.");
            break;
        } catch (err) {
            console.error(`⚠️ Connection attempt ${i} failed: ${err.message}`);
            if (i === maxRetries) {
                console.error("❌ Failed to connect to SQL Server after max retries.");
                process.exit(1);
            }
            console.log(`Waiting ${retryDelay / 1000} seconds before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }

    const dbName = process.env.DB_NAME || "BOOKING_APP_M12";
    try {
        console.log(`Checking if database '${dbName}' exists...`);
        const result = await pool.request().query(`SELECT database_id FROM sys.databases WHERE name = '${dbName}'`);
        if (result.recordset.length === 0) {
            console.log(`Database '${dbName}' does not exist. Creating database...`);
            await pool.request().query(`CREATE DATABASE ${dbName}`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
        await sql.close();
    } catch (err) {
        console.error("❌ Error setting up database:", err.message);
        await sql.close();
        process.exit(1);
    }

    // Connect to the actual database
    const dbConfig = { ...configBase, database: dbName };
    try {
        console.log(`Connecting to SQL Server (database: ${dbName})...`);
        pool = await sql.connect(dbConfig);
        console.log(`Connected to database '${dbName}'.`);
        
        // Check if database is already initialized (e.g., table 'usuarios' exists)
        const tableCheck = await pool.request().query(`SELECT * FROM sys.tables WHERE name = 'usuarios'`);
        const isInitialized = tableCheck.recordset.length > 0;

        if (!isInitialized) {
            const sqlFilePath = path.join(__dirname, "..", "database", "create database BOOKING_APP_M12.sql");
            console.log(`Running database initialization script from: ${sqlFilePath}...`);
            await runSQLFile(pool, sqlFilePath);
            console.log("✅ Database schema initialized successfully.");
        } else {
            console.log("Database tables already initialized. Skipping schema script.");
        }
        
        // Now run migration logic
        console.log("Running migrations...");
        
        // 1. Create categorias
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

        // 2. Insert initial categorias
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

        // 3. Add id_categoria to servicios
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('servicios') AND name = 'id_categoria')
            BEGIN
                ALTER TABLE servicios ADD id_categoria INT;
                PRINT 'Columna id_categoria añadida a servicios.';
            END
        `);

        // 4. Add id_categoria to usuarios
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuarios') AND name = 'id_categoria')
            BEGIN
                ALTER TABLE usuarios ADD id_categoria INT;
                PRINT 'Columna id_categoria añadida a usuarios.';
            END
        `);

        // 5. Update relationships
        await pool.request().query(`
            UPDATE servicios SET id_categoria = 1 WHERE id_categoria IS NULL;
            UPDATE usuarios SET id_categoria = 1 WHERE id_rol IN (2,3) AND id_categoria IS NULL;
        `);
        
        console.log("✅ All migrations completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error setting up database schemas:", err);
        process.exit(1);
    }
}

setup();
