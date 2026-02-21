import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per 60 seconds
  prefix: "imagify:generate",
});

export const advisorRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "imagify:advisor",
});
