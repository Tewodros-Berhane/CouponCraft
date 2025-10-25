const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// const couponRoutes = require('./routes/couponRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/coupons', couponRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});