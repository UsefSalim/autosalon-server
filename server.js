require('dotenv').config({ path: './config/.env' });
require('./config/db.js');
// packages
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Require Routes

const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const ownerRoutes = require('./routes/owner.routes');

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
if (process.env.NODE_ENV === 'developpement') app.use(morgan('tiny'));

app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/client', clientRoutes);

// app express

app.listen(PORT, () => {
  console.log(`app listning : localhost:${PORT}`);
});
