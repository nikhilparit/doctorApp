// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();

// // Proxy configuration
// app.use('/dental_ai', createProxyMiddleware({
//   target: 'https://api.toothinsights.com/',
//   changeOrigin: true,
// }));

// const PORT = 5000; // or any other port you prefer
// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
  //origin: 'http://localhost:8081',
  origin:  'http://localhost',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders:'Content-Type,Authorization',
  credentials: true,
}));

// Proxy configuration
app.use('/dental_ai', createProxyMiddleware({
  target: 'https://api.toothinsights.com/',
  changeOrigin: true,
}));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
