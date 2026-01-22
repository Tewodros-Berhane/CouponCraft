import { nanoid } from "nanoid";

export const attachRequestId = (req, res, next) => {
  const incoming = req.get?.("x-request-id");
  const requestId = incoming || nanoid(12);
  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};
