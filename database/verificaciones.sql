SELECT * FROM usuarios;

SELECT * FROM reservas;

INSERT INTO reservas (id_cliente,id_empleado,id_servicio,fecha,hora_inicio)
VALUES (4,2,1,'2026-03-12','10:00');

INSERT INTO roles(nombre) VALUES
('cliente'),
('empleado'),
('admin');


/*//////////////////////////////////////////////////////
*/


SELECT * FROM roles;

-- Insertar administrador
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, id_rol)
VALUES ('Admin', 'Sistema', 'admin@test.com', 'hash123', '600000000', 3);

-- Insertar empleados
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, id_rol)
VALUES 
('Juan', 'Pérez', 'juan@test.com', 'hash123', '600111111', 2),
('Maria', 'Lopez', 'maria@test.com', 'hash123', '600222222', 2);

-- Insertar clientes
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, id_rol)
VALUES 
('Carlos', 'Gomez', 'carlos@test.com', 'hash123', '600333333', 1),
('Ana', 'Martinez', 'ana@test.com', 'hash123', '600444444', 1);


/*//////////////////////////////////////////////////////
*/

SELECT * FROM servicios;


INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio)
VALUES
('Corte de pelo', 'Corte básico', 30, 12.00),
('Corte + barba', 'Servicio completo', 45, 18.00),
('Tinte', 'Coloración', 90, 35.00);



SELECT * FROM reservas;

INSERT INTO reservas (id_cliente, id_empleado, id_servicio, fecha, hora_inicio)
VALUES (4, 2, 1, '2026-03-20', '10:00');

/*//////////////////////////////////////////////////////
*/
/*//////////////////////////////////////////////////////
*/
/*//////////////////////////////////////////////////////
*/
/*//////////////////////////////////////////////////////
*/
/*//////////////////////////////////////////////////////
*/

USE BOOKING_APP_M12;
GO

-- =====================================
-- 1️⃣ Roles (solo si no existen)
-- =====================================
INSERT INTO roles(nombre)
SELECT 'cliente'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='cliente');

INSERT INTO roles(nombre)
SELECT 'empleado'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='empleado');

INSERT INTO roles(nombre)
SELECT 'admin'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre='admin');
GO

-- =====================================
-- 2️⃣ Usuarios (admin, empleados, clientes)
-- =====================================
-- Admin
INSERT INTO usuarios(nombre, apellidos, email, password_hash, telefono, id_rol)
SELECT 'Admin','Sistema','admin@test.com','hash123','600000000',3
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='admin@test.com');

-- Empleados
INSERT INTO usuarios(nombre, apellidos, email, password_hash, telefono, id_rol)
SELECT 'Juan','Pérez','juan@test.com','hash123','600111111',2
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='juan@test.com');

INSERT INTO usuarios(nombre, apellidos, email, password_hash, telefono, id_rol)
SELECT 'Maria','Lopez','maria@test.com','hash123','600222222',2
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='maria@test.com');

-- Clientes
INSERT INTO usuarios(nombre, apellidos, email, password_hash, telefono, id_rol)
SELECT 'Carlos','Gomez','carlos@test.com','hash123','600333333',1
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='carlos@test.com');

INSERT INTO usuarios(nombre, apellidos, email, password_hash, telefono, id_rol)
SELECT 'Ana','Martinez','ana@test.com','hash123','600444444',1
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email='ana@test.com');
GO

-- =====================================
-- 3️⃣ Servicios
-- =====================================
INSERT INTO servicios(nombre, descripcion, duracion_minutos, precio)
SELECT 'Corte de pelo','Corte básico',30,12.00
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre='Corte de pelo');

INSERT INTO servicios(nombre, descripcion, duracion_minutos, precio)
SELECT 'Corte + barba','Servicio completo',45,18.00
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre='Corte + barba');

INSERT INTO servicios(nombre, descripcion, duracion_minutos, precio)
SELECT 'Tinte','Coloración',90,35.00
WHERE NOT EXISTS (SELECT 1 FROM servicios WHERE nombre='Tinte');
GO

-- =====================================
-- 4️⃣ Horarios de empleados
-- =====================================
-- Juan (id_usuario=2)
INSERT INTO horarios(id_usuario,dia_semana,hora_inicio,hora_fin)
SELECT 2,1,'09:00','14:00'
WHERE NOT EXISTS (SELECT 1 FROM horarios WHERE id_usuario=2 AND dia_semana=1);

INSERT INTO horarios(id_usuario,dia_semana,hora_inicio,hora_fin)
SELECT 2,2,'09:00','14:00'
WHERE NOT EXISTS (SELECT 1 FROM horarios WHERE id_usuario=2 AND dia_semana=2);

-- Maria (id_usuario=3)
INSERT INTO horarios(id_usuario,dia_semana,hora_inicio,hora_fin)
SELECT 3,1,'10:00','18:00'
WHERE NOT EXISTS (SELECT 1 FROM horarios WHERE id_usuario=3 AND dia_semana=1);
GO

-- =====================================
-- 5️⃣ Reservas de prueba
-- =====================================
-- Cliente: Carlos (id=4), Empleado: Juan (id=2), Servicio: Corte de pelo (id=1)
INSERT INTO reservas(id_cliente,id_empleado,id_servicio,fecha,hora_inicio)
SELECT 4,2,1,'2026-03-20','10:00'
WHERE NOT EXISTS (
    SELECT 1 FROM reservas
    WHERE id_cliente=4 AND id_empleado=2 AND fecha='2026-03-20' AND hora_inicio='10:00'
);

-- Cliente: Ana (id=5), Empleado: Juan (id=2), Servicio: Corte + barba (id=2)
INSERT INTO reservas(id_cliente,id_empleado,id_servicio,fecha,hora_inicio)
SELECT 5,2,2,'2026-03-20','11:00'
WHERE NOT EXISTS (
    SELECT 1 FROM reservas
    WHERE id_cliente=5 AND id_empleado=2 AND fecha='2026-03-20' AND hora_inicio='11:00'
);

-- Cliente: Carlos (id=4), Empleado: Maria (id=3), Servicio: Tinte (id=3)
INSERT INTO reservas(id_cliente,id_empleado,id_servicio,fecha,hora_inicio)
SELECT 4,3,3,'2026-03-21','10:00'
WHERE NOT EXISTS (
    SELECT 1 FROM reservas
    WHERE id_cliente=4 AND id_empleado=3 AND fecha='2026-03-21' AND hora_inicio='10:00'
);
GO

SELECT * FROM categorias;
SELECT * FROM empleado_detalle;
SELECT * FROM historial_reservas;
SELECT * FROM horarios;
SELECT * FROM locales;
SELECT * FROM reservas;
SELECT * FROM roles;
SELECT * FROM servicios;
SELECT * FROM usuarios;


