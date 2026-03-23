const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const qrcode = require('qrcode');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const os = require('os'); // Agregado para detectar la IP local

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'mi_secreto_para_tacos_super_seguro';

// Función para obtener la IP Local de la computadora en la red Wi-Fi
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // IP de respaldo
}
const LOCAL_IP = getLocalIp();

const app = express();
app.use(cors());

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No se proporcionó token" });
    
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "No autorizado" });
        req.userId = decoded.id;
        next();
    });
};
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'tacos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure database and tables exist
const initDb = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3307,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root'
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'tacos_db'}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME || 'tacos_db'}\`;`);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Base de datos y tablas inicializadas correctamente.");
        await connection.end();
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    }
};

initDb();

// File upload setup using Multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'item_' + Date.now() + ext)
  }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---

// Login de Admin (Usuario fijo para MVP, se puede cambiar)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Usuario: admin | Contraseña: admin123 (Lo ideal es usar variables de entorno)
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ id: 1, role: 'admin' }, SECRET_KEY, { expiresIn: '8h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }
});

// Get all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM menu_items ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new menu item (Protegido)
app.post('/api/menu', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!req.file) return res.status(400).json({ error: "La imagen es obligatoria (se recomiendan HD.png)" });
        
        const imageUrl = `/uploads/${req.file.filename}`;
        
        const [result] = await pool.query(
            'INSERT INTO menu_items (name, price, image_url) VALUES (?, ?, ?)',
            [name, price, imageUrl]
        );
        res.json({ id: result.insertId, name, price, imageUrl, success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un platillo
app.delete('/api/menu/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query('SELECT image_url FROM menu_items WHERE id = ?', [id]);
        
        if (rows.length > 0) {
            const imagePath = path.join(__dirname, rows[0].image_url);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un platillo (nombre o precio)
app.put('/api/menu/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price } = req.body;
        await pool.query('UPDATE menu_items SET name = ?, price = ? WHERE id = ?', [name, price, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate and Return QR Code
app.get('/api/qr', verifyToken, async (req, res) => {
    try {
        // Usa PUBLIC_URL si existe (VPS), si no usa la IP local
        const baseUrl = process.env.PUBLIC_URL || `http://${LOCAL_IP}:${PORT || 5001}`;
        const targetUrl = baseUrl; // Apuntando al homepage (Landing Page)
        
        // Generar QR con el rojo mexicano de la marca
        const qrImage = await qrcode.toDataURL(targetUrl, {
            color: {
                dark: '#b91c1c', // Rojo mexicano (Tailwind red-700)
                light: '#ffffff'
            },
            width: 300,
            margin: 2
        });
        
        res.json({ qr: qrImage, url: targetUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5002;

// --- SERVE FRONTEND ---
// Servir la aplicación React construida directamente desde Node.js
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Cualquier otra ruta que no sea API la mandamos a React (para que funcione el Router: /menu, /admin)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    const baseUrl = process.env.PUBLIC_URL || `http://${LOCAL_IP}:${PORT}`;
    console.log(`Backend de Tacos Birria corriendo en puerto ${PORT}`);
    console.log(`\n🌮 ¡TU MENÚ ESTÁ LISTO! 🌮`);
    console.log(`-> Ingresa a esta URL para verlo o gestionar: ${baseUrl}`);
});