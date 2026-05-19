USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'backend_user')
BEGIN
    CREATE LOGIN backend_user WITH PASSWORD = 'BookingApp2026!';
END
GO

DROP DATABASE IF EXISTS BOOKING_APP_M12;
GO

create database BOOKING_APP_M12;
GO

USE BOOKING_APP_M12;
GO

CREATE USER backend_user FOR LOGIN backend_user;
ALTER ROLE db_owner ADD MEMBER backend_user;
GO

CREATE TABLE roles (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(20) UNIQUE NOT NULL
);
GO

INSERT INTO roles(nombre) VALUES
('cliente'),
('empleado'),
('admin');
GO


/*//////////////////////////////////////////////////////
*/

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(80),
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    id_rol INT NOT NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_usuario_rol
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);
GO

CREATE INDEX idx_usuario_email ON usuarios(email);
GO


/*//////////////////////////////////////////////////////
*/


CREATE TABLE empleado_detalle (
    id_usuario INT PRIMARY KEY,
    especialidad VARCHAR(100),
    bio TEXT,
    foto VARCHAR(255),

    CONSTRAINT FK_empleado_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);
GO


/*//////////////////////////////////////////////////////
*/

CREATE TABLE servicios (
    id_servicio INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    precio DECIMAL(6,2) NOT NULL,
    activo BIT DEFAULT 1
);
GO


INSERT INTO servicios(nombre,descripcion,duracion_minutos,precio) VALUES
('Corte de pelo','Corte básico',30,12.00),
('Corte + barba','Servicio completo',45,18.00),
('Tinte','Coloración',90,35.00);
GO



/*//////////////////////////////////////////////////////
*/

CREATE TABLE horarios (
    id_horario INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    CONSTRAINT FK_horario_empleado
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE
);
GO


/*//////////////////////////////////////////////////////
*/


CREATE TABLE reservas (
    id_reserva INT IDENTITY(1,1) PRIMARY KEY,

    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    id_servicio INT NOT NULL,

    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    estado VARCHAR(15) DEFAULT 'pendiente',
    CHECK (estado IN ('pendiente','confirmada','cancelada','realizada')),

    observaciones VARCHAR(MAX),
    fecha_creacion DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_reserva_cliente
        FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),

    CONSTRAINT FK_reserva_empleado
        FOREIGN KEY (id_empleado) REFERENCES usuarios(id_usuario),

    CONSTRAINT FK_reserva_servicio
        FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);
GO


CREATE INDEX idx_reserva_fecha ON reservas(fecha);
CREATE INDEX idx_reserva_empleado_fecha ON reservas(id_empleado, fecha);
GO

/*//////////////////////////////////////////////////////
*/


CREATE TABLE historial_reservas (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_reserva INT,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    fecha_cambio DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
    ON DELETE CASCADE
);
GO


/*//////////////////////////////////////////////////////
*/


CREATE TRIGGER calcular_hora_fin
ON reservas
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO reservas(
        id_cliente,id_empleado,id_servicio,
        fecha,hora_inicio,hora_fin,estado,observaciones
    )
    SELECT
        i.id_cliente,
        i.id_empleado,
        i.id_servicio,
        i.fecha,
        i.hora_inicio,
        DATEADD(MINUTE, s.duracion_minutos, i.hora_inicio),
        ISNULL(i.estado,'pendiente'),
        i.observaciones
    FROM inserted i
    JOIN servicios s ON i.id_servicio = s.id_servicio;
END;
GO


/*//////////////////////////////////////////////////////
*/

CREATE TRIGGER evitar_solapamientos
ON reservas
AFTER INSERT
AS
BEGIN
    IF EXISTS(
        SELECT 1
        FROM reservas r
        JOIN inserted i
        ON r.id_empleado = i.id_empleado
        AND r.fecha = i.fecha
        AND r.id_reserva <> i.id_reserva
        AND r.estado <> 'cancelada'
        AND (
            i.hora_inicio < r.hora_fin
            AND i.hora_fin > r.hora_inicio
        )
    )
    BEGIN
        RAISERROR('El empleado ya tiene una reserva en ese horario',16,1);
        ROLLBACK TRANSACTION;
    END
END;
GO


/*//////////////////////////////////////////////////////
*/

CREATE TRIGGER historial_estado
ON reservas
AFTER UPDATE
AS
BEGIN
    INSERT INTO historial_reservas(id_reserva,estado_anterior,estado_nuevo)
    SELECT d.id_reserva, d.estado, i.estado
    FROM deleted d
    JOIN inserted i ON d.id_reserva=i.id_reserva
    WHERE d.estado<>i.estado;
END;
GO


/*//////////////////////////////////////////////////////
*/