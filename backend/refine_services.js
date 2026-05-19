const { getConnection } = require('./config/db');

async function refineServices() {
    try {
        const pool = await getConnection();
        console.log("Refinando servicios...");

        // 1. Limpiar servicios de peluquería antiguos (opcional, para empezar de cero con calidad)
        // O simplemente añadir los nuevos. Mejor añadir y asegurar el id_categoria.
        
        const services = [
            { nombre: 'Corte de Pelo Premium', desc: 'Corte a tijera o máquina con acabado profesional', precio: 15.00, duracion: 30, cat: 1 },
            { nombre: 'Corte + Barba', desc: 'Servicio completo de estilismo capilar y facial', precio: 22.00, duracion: 45, cat: 1 },
            { nombre: 'Arreglo de Barba', desc: 'Perfilado y recorte con ritual de toalla caliente', precio: 10.00, duracion: 20, cat: 1 },
            { nombre: 'Tinte / Coloración', desc: 'Coloración profesional para hombre/mujer', precio: 35.00, duracion: 60, cat: 1 },
            { nombre: 'Lavado e Hidratación', desc: 'Tratamiento revitalizante para el cuero cabelludo', precio: 8.00, duracion: 15, cat: 1 },
            { nombre: 'Afeitado Clásico', desc: 'Afeitado tradicional a navaja', precio: 15.00, duracion: 30, cat: 1 }
        ];

        for (const s of services) {
            await pool.request()
                .input('nombre', s.nombre)
                .input('desc', s.desc)
                .input('precio', s.precio)
                .input('duracion', s.duracion)
                .input('cat', s.cat)
                .query(`
                    IF NOT EXISTS (SELECT 1 FROM servicios WHERE nombre = @nombre AND id_categoria = @cat)
                    BEGIN
                        INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos, id_categoria, activo)
                        VALUES (@nombre, @desc, @precio, @duracion, @cat, 1)
                    END
                `);
        }

        console.log("✅ Servicios refinados con éxito.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error refining services:", err);
        process.exit(1);
    }
}

refineServices();
