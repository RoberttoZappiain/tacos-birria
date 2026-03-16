# 🌮 Tacos Birria - Aplicación Fullstack

## Tecnologías usadas:
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios.
- **Backend**: Node.js, Express, Multer (Subida de HD.png), qrcode (Generador de QR).
- **Base de Datos**: MySQL (vía Docker Compose para evitar instalaciones difíciles).

## Pasos para Levantar el Proyecto:

1. **Levantar la Base de Datos MySQL** (Asegúrate de tener Docker abierto):
```bash
docker-compose up -d
```
Esto iniciará una base de datos MySQL local automáticamente.

2. **Iniciar el Backend** (En una nueva terminal):
```bash
cd backend
npm start  # O alternativamente: node server.js
```
*Tu API y gestor de subidas estará corriendo en `http://localhost:5001`*.

3. **Iniciar el Frontend** (En una nueva terminal):
```bash
cd frontend
npm run dev
```
*Tu aplicación de React estará viva (usualmente en `http://localhost:5173`).*

## Rutas de la Aplicación:
- `/` - Landing page principal con tu botón primario (CTA) y look mexicano.
- `/menu` - La vista del menú con los platillos de la base de datos.
- `/admin` - Gestor donde puedes subir tu nombre, precio, tu foto **HD.png** y presionar el botón de "Generar QR" para dirigir al comensal a `menu.tacosbirria.com`.

¡Disfruta tus ricos tacos! 🌶️