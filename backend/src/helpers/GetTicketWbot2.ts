import { Client as Session } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";
import Ticket from "../models/Ticket";

const GetTicketWbot2 = async (ticket: Ticket): Promise<Session> => {
  const wbot = getWbot(ticket);
  return wbot;
};

export default GetTicketWbot2;
