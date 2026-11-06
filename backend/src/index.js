require('dotenv').config();

const connectDB = require('./config/db');
const { createApp } = require('./app');

const start = async () => {
  await connectDB();

  const app = createApp();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

start();
