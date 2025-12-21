const jsonServer = require('json-server');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Cho phép mọi nguồn kết nối trong lúc dev
});

app.use(middlewares);
app.use(jsonServer.bodyParser);

// Xử lý khi có người kết nối
io.on('connection', (socket) => {
  console.log('⚡ Một người dùng đã kết nối:', socket.id);

  // Lắng nghe khi client gửi tin nhắn mới
  socket.on('send_message', (newMsg) => {
    // 1. Phát lại cho tất cả mọi người (hoặc admin) thấy tin nhắn mới
    socket.broadcast.emit('receive_message', newMsg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Người dùng ngắt kết nối');
  });
});

app.use(router);

const PORT = 5005;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});