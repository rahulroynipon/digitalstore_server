export default function socketHandler(io) {
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
    });
}
