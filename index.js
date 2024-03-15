import { Server } from "socket.io";

const io = new Server(8000, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = []; //active users
const addUser = (userData, socketId) => {
  console.log(users.findIndex((user) => user.id === userData.id));
  // Check if the user's ID is already in the array before adding
  if (users.findIndex((user) => user.id === userData.id) === -1) {
    users.push({ ...userData, socketId });
  }
};
const getUser= (userId)=>{
  return users.find((user) => user.id === userId);
}
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    // Emit updated users array to all clients
    io.emit("updateUsers", users);
  });
  socket.on('sendMessage',data =>{
    console.log(data)
    const user=getUser(data.receiverId);
    console.log(user)
    console.log(io.to(user.socketId).emit("getMessage",data)) 
    console.log("message emitted from socket")
  });
});

