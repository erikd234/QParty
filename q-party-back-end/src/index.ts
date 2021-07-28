import express, { Application, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import SpeakerService from "./service/SpeakerService";
import { setRoutes } from "./routes/routes";
import Info from "./public/Info";
import Song from "./types/Song";
var cors = require("cors");
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// const io = new Server(httpServer);
// // webhook start
// io.on("connection", (socket: Socket) => {
//   console.log("A user connected");
// });
app.use(cors());
dotenv.config();
Info.Application.setClientId(process.env.CLIENT_ID);
Info.Application.setClientSecret(process.env.CLIENT_SECRET);
Info.Application.setRedirectUri(process.env.REDIRECT_URI);
Info.User.setRefreshToken(process.env.REFRESH_TOKEN);
// comment out when run when sonos port is not running.

SpeakerService.initGroupList();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
setRoutes(app, io);
io.on("connection", async (socket: Socket) => {
  // send out queue state to user
  const success = await SpeakerService.getQueue();
  if (!success) console.log("no speaker group."); // TODO add some error handling here;

  socket.emit("queue change", success);
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.on("add queue", async (songData: Song) => {
    // add the song to the queue panel
    const success = await SpeakerService.addToQueue(songData.trackUri);
    if (!success) console.log("no speaker group."); // TODO add some error handling here;
    console.log(songData);
    socket.emit("queue change", await SpeakerService.getQueue());
    // emit the state of the song queue updated;
  });
});

httpServer.listen(8888, () => console.log("Server Running"));
