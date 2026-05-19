# Booking App - Guía de Inicio Rápido

Este proyecto es una aplicación de reservas completa que consta de:
* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Base de datos:** SQL Server / Azure SQL Edge

---

## 🚀 Cómo ponerlo en marcha rápidamente con Docker Compose

El método más rápido y recomendado, especialmente para la **Raspberry Pi**, es usar Docker Compose.

```bash
# Construir e iniciar todos los servicios
docker compose up -d --build
```

Esto automáticamente levantará:
1. **Base de Datos (puerto 11433):** Iniciada en contenedor y configurada/migrada de forma automática por el backend.
2. **Backend (puerto 3000):** Servidor API que gestiona la lógica y las reservas.
3. **Frontend (puerto 8080):** Servido por Nginx de forma optimizada.

---

## 🛠️ Cómo ponerlo en marcha nativamente

### 1. Requisitos
* Tener instalado Node.js (v18 o v20) y un servidor de SQL Server.

### 2. Backend
1. Ir a la carpeta `backend` e instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Configurar las variables en un archivo `.env` basado en `.env.example`.
3. Inicializar base de datos y migraciones:
   ```bash
   npm run db:setup
   ```
4. Arrancar en desarrollo:
   ```bash
   npm run dev
   ```

### 3. Frontend
1. Ir a la carpeta `frontend` e instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Arrancar en desarrollo:
   ```bash
   npm run dev
   ```
3. Gracias a la configuración `host: true` en `vite.config.js`, puedes acceder desde otros dispositivos en la red usando la IP de tu PC/Raspberry Pi (ej. `http://<IP_DE_LA_PI>:5173`).

---

## 📁 Estructura del Proyecto
* `/backend`: Código de la API REST, controladores y modelos.
* `/frontend`: Aplicación cliente interactiva en React.
* `/database`: Scripts SQL de inicialización de la base de datos.
* `docker-compose.yml`: Configuración de servicios dockerizados.
