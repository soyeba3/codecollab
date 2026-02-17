import { createServer } from "http";
import { initializeSocket } from "./socket";

const port = process.env.PORT || 3001;

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.io server is running");
});

initializeSocket(server);

server.listen(port, () => {
  console.log(`> Socket.io server ready on http://localhost:${port}`);
});
