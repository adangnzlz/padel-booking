import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏳ 15 minutes window
  max: 100, // 🔥 Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." }, // 📛 Custom error response
  standardHeaders: true, // ✅ Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // ❌ Disable `X-RateLimit-*` headers (deprecated)
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // ⏳ 1-minute window
  max: 5, // 🔥 Max 10 requests per minute
  message: { error: "Too many requests. Please slow down." },
});
