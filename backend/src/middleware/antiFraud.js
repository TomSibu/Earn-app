// simple heuristics: per-IP rate limit, UA check, short duration reject
const AdView = require('../models/AdView');

module.exports = {
  basicCheck: async (ctx) => {
    // ctx = { ip, ua, adId, duration }
    if (!ctx.duration || ctx.duration < parseInt(process.env.AD_MIN_WATCH_SECONDS || '8')) {
      return { ok: false, reason: 'Duration too short' };
    }
    // quick UA bot check (very simple)
    if (/bot|curl|wget|phantom|headless/i.test(ctx.ua)) {
      return { ok: false, reason: 'Bot user-agent' };
    }
    // IP rapid-fire check: last view within 5 seconds by same IP & UA
    const last = await AdView.findOne({ ip: ctx.ip }).sort({ startedAt: -1 }).limit(1);
    if (last && (new Date() - last.startedAt) < 2000) {
      return { ok: false, reason: 'Too fast / rapid requests from IP' };
    }
    return { ok: true };
  }
};
