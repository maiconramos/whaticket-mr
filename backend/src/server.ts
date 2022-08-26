import gracefulShutdown from "http-graceful-shutdown";
import swaggerUi from "swagger-ui-express";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";

import swaggerDocs from "./swagger.json";

const options = {
  customCss: ".swagger-ui .topbar { display: none }"
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

const server = app.listen(process.env.PORT, () => {
  logger.info(`Server started on port: ${process.env.PORT}`);
});

initIO(server);
StartAllWhatsAppsSessions();
gracefulShutdown(server);
