import io from "socket.io-client";

const qSocket: any = {
  socket: undefined,
  createSocket: function () {
    this.socket = io("http://localhost:8888");
  },
};

enum QSocketEvents {
  stateChange = "state change",
  addQueue = "add queue",
  queueChange = "queue change",
}
export { qSocket, QSocketEvents };
