// Referencias HTML
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

socket.on("last-ticket", (ultimo) => {
  lblNuevoTicket.innerText = "Ticket " + ultimo;
});

btnCrear.addEventListener("click", () => {
  socket.emit("next-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
    console.log("ticket", ticket);
  });
});
