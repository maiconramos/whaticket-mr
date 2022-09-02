import { Request, Response } from "express";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Message from "../models/Message";
import SendWhatsAppAudioApi from "../services/WbotServices/SendWhatsAppAudioApi";
import SendWhatsAppMessage_2 from "../services/WbotServices/SendWhatsAppMessage2";
import SendWhatsAppMediaApi from "../services/WbotServices/SendWhatsAppMediaApi";
import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import { getApiToken } from "../helpers/Api";

type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId
  });

  SetTicketMessagesAsRead(ticket);

  return res.json({ count, messages, ticket, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];

  const ticket = await ShowTicketService(ticketId);

  SetTicketMessagesAsRead(ticket);

  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ media, ticket });
      })
    );
  } else {
    await SendWhatsAppMessage({ body, ticket, quotedMsg });
  }

  return res.send();
};

export const MessageText = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.body);
  const { number, message, ticketwhatsappId, token } = req.body;
  const APIToken = await getApiToken();

  console.log(APIToken);
  if (APIToken !== token) {
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });
  }

  await SendWhatsAppMessage_2(number, message, ticketwhatsappId);
  return res.send();
};

export const MessageMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.body);
  const { number, url, title, ticketwhatsappId, token } = req.body;
  const APIToken = await getApiToken();

  console.log(APIToken);
  if (APIToken !== token) {
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });
  }
  await SendWhatsAppMediaApi(number, url, ticketwhatsappId, title);
  return res.send();
};

export const MessageAudio = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log(req.body);
  const { number, url, ticketwhatsappId, token } = req.body;
  const APIToken = await getApiToken();
  if (APIToken !== token) {
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });
  }
  await SendWhatsAppAudioApi(number, url, ticketwhatsappId);
  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit("appMessage", {
    action: "update",
    message
  });

  return res.send();
};
