require('dotenv').config({ path: './src/config/.env' });
require('./src/config/db.js');
// packages
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Require Routes

const authRoutes = require('./src/routes/auth.routes');
const clientRoutes = require('./src/routes/client.routes');
const ownerRoutes = require('./src/routes/owner.routes');
// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
if (process.env.NODE_ENV === 'developpement') app.use(morgan('tiny'));

app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/client', clientRoutes);
// app express

app.listen(PORT, () => {
  console.log(`app listning : localhost:${PORT}`);
});
