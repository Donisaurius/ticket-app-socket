const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(number, desk) {
    this.number = number;
    this.desk = desk;
  }
}

class TicketControl {
  constructor() {
    this.last = 0;
    this.currentDay = new Date().getDate();
    this.tickets = [];
    this.lastFour = [];

    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      currentDay: this.currentDay,
      tickets: this.tickets,
      lastFour: this.lastFour,
    };
  }

  init() {
    const { currentDay, lastFour, tickets, last } = require("../db/data.json");

    if (currentDay === this.currentDay) {
      this.tickets = tickets;
      this.lastFour = lastFour;
      this.last = last;
    } else {
      this.saveDb();
    }
  }

  saveDb() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  next() {
    this.last += 1;
    const ticket = new Ticket(this.last, null);
    this.tickets.push(ticket);

    this.saveDb();
    return "Ticket " + ticket.number;
  }

  attendTicket(desk) {
    // There is not ticket
    if (!this.tickets.length) {
      return null;
    }

    const ticket = this.tickets.shift();

    ticket.desk = desk;

    this.lastFour.unshift(ticket);

    if (this.lastFour.length > 4) {
      this.lastFour.splice(-1, 1);
    }

    this.saveDb();

    return ticket;
  }
}

module.exports = TicketControl;
