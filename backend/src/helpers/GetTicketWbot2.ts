import { Client as Session } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";

const GetTicketWbot2 = async (ticket: number): Promise<Session> => {
  console.log(ticket);
  const wbot = getWbot(ticket);
  return wbot;
};

export default GetTicketWbot2;
