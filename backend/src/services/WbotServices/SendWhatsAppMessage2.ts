import { Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot2 from "../../helpers/GetTicketWbot2";
import GetWbotMessage from "../../helpers/GetWbotMessage";
import SerializeWbotMsgId from "../../helpers/SerializeWbotMsgId";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import formatBody from "../../helpers/Mustache";

const db = require("../../helpers/Db");

const SendWhatsAppMessage2 = async (
  number: string,
  message: string,
  ticketwhatsappId: any
): Promise<WbotMessage> => {
  const wbot2 = await GetTicketWbot2(ticketwhatsappId);
  function delay(t: number, v: number) {
    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
  }
  try {
    const sentMessage = await wbot2.sendMessage(number, message);
    delay(5000, 0).then(async function () {
      const ticketId = await db.getContactId(number.replace(/\D/g, ""));
      await db.setTicketClosed(ticketId);
    });
    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage2;
