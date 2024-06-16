import { defineMiddleware } from "astro:middleware";
import { pino } from "pino";
import { randomUUID } from "node:crypto";

export const logger = pino();

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  locals.reqId = randomUUID();
  locals.startTime = performance.now();

  const { url, method } = request;
  const { pathname, search, origin } = new URL(url);

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
    responseTime: performance.now() - locals.startTime,
  });
  return response;
});
