# 3-turnos-BE - Sistema de Gestión de Turnos (Persistencia en Archivos y Recurso Bookings)

Tercera iteración del backend para la gestión de turnos. En esta entrega se añade **persistencia en el sistema de archivos (JSON)** y se introduce el recurso central del sistema: **`bookings` (turnos / reservas)**, con su respectiva asociación a los servicios ofrecidos.

---

## 📋 Descripción y Nuevas Actualizaciones

En comparación con `2-turnos-BE`, esta versión implementa:

1. **Persistencia en Sistema de Archivos (`fs/promises`)**:
   - Los datos ya no se pierden al reiniciar el servidor. Se gestionan mediante lectura y escritura asíncrona de archivos JSON:
     - `src/data/services.json`
     - `src/data/bookings.json`
2. **Nuevo Recurso `bookings` (Reservas)**:
   - Se incorpora el gestor `BookingManager` (`src/managers/BookingManager.js`).
   - Se crea el enrutador `src/routes/booking.router.js` montado bajo la ruta `/bookings`.
   - Permite vincular servicios a un turno mediante la ruta relacional `POST /bookings/:bid/services/:sid`.
3. **Actualización en el Recurso `services`**:
   - `ServiceManager` ahora persiste en `src/data/services.json`.
   - El parámetro identificador en las rutas se actualiza a `:sid` (Service ID).

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm**

---

## ⚙️ Variables de Entorno

Configura tu archivo `.env` en la raíz de `3-turnos-BE` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

| Variable | Tipo | Obligatoria | Descripción |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde escucha la aplicación |
| `NODE_ENV` | String | Sí | Modo de entorno (`development` / `production`) |

---

## 📦 Cómo Instalar

1. Navega a la carpeta del proyecto:
   ```bash
   cd 3-turnos-BE
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *(En PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo** (recarga en caliente con `nodemon`):
  ```bash
  npm run dev
  ```

- **Modo Producción**:
  ```bash
  npm start
  ```

El servidor estará escuchando en `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

```text
3-turnos-BE/
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias y scripts
├── src/
│   ├── app.js                    # Configuración de Express y montaje de rutas
│   ├── server.js                 # Listener y arranque del servidor
│   ├── config/
│   │   └── env.config.js         # Configuración y validación de variables de entorno
│   ├── data/
│   │   ├── bookings.json         # Persistencia de reservas
│   │   └── services.json         # Persistencia de servicios
│   ├── managers/
│   │   ├── BookingManager.js     # Lógica de negocio y persistencia de reservas
│   │   └── ServiceManager.js     # Lógica de negocio y persistencia de servicios
│   ├── routes/
│   │   ├── booking.router.js     # Enrutador Express para /bookings
│   │   └── services.router.js    # Enrutador Express para /services
│   └── utils/
│       └── http.js               # Utilidades auxiliares
```

---

## 🏷️ Descripción de Recursos

### 1. Recurso `services`
Representa los servicios o tratamientos disponibles en la plataforma.

| Propiedad | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | Autogenerado | Identificador único del servicio |
| `name` | `String` | Sí | Nombre del servicio |
| `description` | `String` | Sí | Detalle o alcance del servicio |
| `duration` | `Number` | Sí | Duración en minutos |
| `price` | `Number` | Sí | Costo monetario |
| `category` | `String` | Sí | Categoría a la que pertenece |
| `available` | `Boolean` | Sí | Si está activo para ser contratado |

---

### 2. Recurso `bookings`
Representa una reserva o turno solicitado por un cliente.

| Propiedad | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | Autogenerado | Identificador único de la reserva |
| `clientName` | `String` | Sí | Nombre y apellido del cliente |
| `clientEmail` | `String` | Sí | Correo electrónico de contacto |
| `date` | `String` | Sí | Fecha del turno (ej: `"2026-12-01"`) |
| `time` | `String` | Sí | Hora del turno (ej: `"14:30"`) |
| `status` | `String` | Sí | Estado del turno (ej: `"confirmed"`, `"pending"`) |
| `services` | `Array<Object>` | Sí | Lista de servicios incluidos: `[{ service: String, quantity: Number }]` |

---

## 🔌 Endpoints y Ejemplos de Uso

### Servicios (`/services`)

#### 1. Obtener todos los servicios
```bash
curl -X GET http://localhost:8080/services
```

#### 2. Obtener servicio por ID (`:sid`)
```bash
curl -X GET http://localhost:8080/services/c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c
```

#### 3. Crear servicio
```bash
curl -X POST http://localhost:8080/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corte de Barba",
    "description": "Perfilado y toalla caliente",
    "duration": 30,
    "price": 6000,
    "category": "Barbería",
    "available": true
  }'
```

#### 4. Actualizar servicio (`:sid`)
```bash
curl -X PUT http://localhost:8080/services/c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c \
  -H "Content-Type: application/json" \
  -d '{
    "price": 7000
  }'
```

#### 5. Eliminar servicio (`:sid`)
```bash
curl -X DELETE http://localhost:8080/services/c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c
```

---

### Reservas / Turnos (`/bookings`)

#### 1. Crear una nueva reserva
- **Método**: `POST`
- **Ruta**: `/bookings`
- **Headers**: `Content-Type: application/json`

```bash
curl -X POST http://localhost:8080/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Juan Pérez",
    "clientEmail": "juan.perez@example.com",
    "date": "2026-11-20",
    "time": "15:00",
    "status": "confirmed",
    "services": [
      {
        "service": "c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c",
        "quantity": 1
      }
    ]
  }'
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": "9a3d4f82-0198-4b72-9b0d-2bca4871e98a",
  "clientName": "Juan Pérez",
  "clientEmail": "juan.perez@example.com",
  "date": "2026-11-20",
  "time": "15:00",
  "status": "confirmed",
  "services": [
    {
      "service": "c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c",
      "quantity": 1
    }
  ]
}
```

---

#### 2. Obtener una reserva por ID (`:bid`)
- **Método**: `GET`
- **Ruta**: `/bookings/:bid`

```bash
curl -X GET http://localhost:8080/bookings/9a3d4f82-0198-4b72-9b0d-2bca4871e98a
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "9a3d4f82-0198-4b72-9b0d-2bca4871e98a",
  "clientName": "Juan Pérez",
  "clientEmail": "juan.perez@example.com",
  "date": "2026-11-20",
  "time": "15:00",
  "status": "confirmed",
  "services": [
    {
      "service": "c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c",
      "quantity": 1
    }
  ]
}
```

---

#### 3. Agregar o incrementar un servicio a una reserva
- **Método**: `POST`
- **Ruta**: `/bookings/:bid/services/:sid`
- Permite agregar un nuevo servicio a la reserva existente, o si ya existía en la reserva, incrementa automáticamente su cantidad en 1 unidad.

```bash
curl -X POST http://localhost:8080/bookings/9a3d4f82-0198-4b72-9b0d-2bca4871e98a/services/e2d09418-47c3-4d76-bc38-232152a420b9
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "9a3d4f82-0198-4b72-9b0d-2bca4871e98a",
  "clientName": "Juan Pérez",
  "clientEmail": "juan.perez@example.com",
  "date": "2026-11-20",
  "time": "15:00",
  "status": "confirmed",
  "services": [
    {
      "service": "c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c",
      "quantity": 1
    },
    {
      "service": "e2d09418-47c3-4d76-bc38-232152a420b9",
      "quantity": 1
    }
  ]
}
```

