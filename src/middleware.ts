import { defineMiddleware } from "astro:middleware";
import { pino } from "pino";
import { randomUUID } from "node:crypto";

export const logger = pino({
  level: import.meta.env.PROD ? "info" : "error",
});

export const onRequest = defineMiddleware(
  async ({ locals, url, request }, next) => {
    locals.reqId = randomUUID();
    locals.startTime = performance.now();

    const { method } = request;
    const { pathname, search, origin } = url;

    const logData = {
      message: "Incoming request",
      reqId: locals.reqId,
      req: {
        method,
        pathname,
        search,
        origin,
      },
    };
    logger.info(logData);

    const response = await next();

    logger.info({
      message: "Request completed",
      reqId: locals.reqId,
      statusCode: response.status,
      responseTime: performance.now() - locals.startTime,
    });
    return response;
  }
);
