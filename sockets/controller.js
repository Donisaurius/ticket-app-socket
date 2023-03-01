const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("last-ticket", ticketControl.last);

  socket.emit("actual-state", ticketControl.lastFour);

  socket.emit("pending-tickets", ticketControl.tickets.length);
  socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);

    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);
  });

  socket.on("atend-ticket", ({ escritorio }, callback) => {
    const ticket = ticketControl.attendTicket(escritorio);
    console.log("ticket", ticket);

    socket.broadcast.emit("actual-state", ticketControl.lastFour);
    socket.emit("pending-tickets", ticketControl.tickets.length);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: "No hay ticket para atender",
      });
    } else {
      callback({ ok: true, ticket, msg: "" });
    }
  });
};

module.exports = { socketController };
