import fs from "fs";
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot2 from "../../helpers/GetTicketWbot2";

import formatBody from "../../helpers/Mustache";

const db = require("../../helpers/Db");

const SendWhatsAppMediaApi = async (
  number: string,
  url: string,
  ticketwhatsappId: number,
  title?: string
): Promise<WbotMessage> => {
  console.log(`ticket not SendWhatsAppMediaApi ${ticketwhatsappId}`);
  const wbot2 = await GetTicketWbot2(ticketwhatsappId);
  try {
    const fileUrl = url;
    const caption = title;
    const media = await MessageMedia.fromUrl(fileUrl);
    const sentMessage = await wbot2.sendMessage(number, media, {
      caption
    });
    return sentMessage;
  } catch (err) {
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMediaApi;
