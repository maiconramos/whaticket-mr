import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot2 from "../../helpers/GetTicketWbot2";

const SendWhatsAppAudioApi = async (
  number: string,
  url: string,
  ticketwhatsappId: number
): Promise<WbotMessage> => {
  const wbot2 = await GetTicketWbot2(ticketwhatsappId);
  try {
    const media = await MessageMedia.fromUrl(url);
    const sentAudio = await wbot2.sendMessage(number, media, {
      sendAudioAsVoice: true
    });
    return sentAudio;
  } catch (err) {
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppAudioApi;
