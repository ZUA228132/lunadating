import { createHmac } from 'crypto';

/**
 * Verifies the hash provided by the Telegram Login Widget.
 *
 * Telegram's authentication widget sends a set of fields (id, first_name,
 * last_name, username, photo_url, auth_date) along with a `hash` field.
 * The hash is computed as an HMAC‑SHA256 of the sorted fields using the
 * SHA256 of your bot token as the secret key.  See
 * https://core.telegram.org/widgets/login#checking-authorization for details.
 */
export function verifyTelegramLogin(data: Record<string, string>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('Missing TELEGRAM_BOT_TOKEN');

  const hash = data.hash;
  if (!hash) return false;

  const sorted = Object.entries(data)
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', botToken).digest();
  const signature = createHmac('sha256', secretKey)
    .update(sorted)
    .digest('hex');

  return signature === hash;
}

/**
 * Extracts Telegram user data from a query string and verifies it.
 */
export function getTelegramUserFromQuery(query: URLSearchParams) {
  const data: Record<string, string> = {};
  for (const [key, value] of query.entries()) {
    data[key] = value;
  }
  if (!verifyTelegramLogin(data)) {
    return null;
  }
  return {
    id: data.id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    photo_url: data.photo_url
  };
}

/**
 * Parses the initData querystring provided by Telegram Web Apps.  This string
 * contains URL‑encoded key/value pairs (e.g. `auth_date=...&user=...&hash=...`).
 */
export function parseTelegramInitData(initData: string) {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};
  params.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

/**
 * Verifies the authenticity of data passed via the Telegram Web App initData field.
 *
 * According to the official documentation, developers must compute a
 * "data‑check string" by concatenating all received fields sorted
 * alphabetically (except the hash itself) with a newline separator, then
 * calculate an HMAC‑SHA256 signature of this string using a secret key
 * derived from the bot token.  If the resulting hex digest matches the
 * received `hash`, the data comes from Telegram and can be trusted.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(data: Record<string, string>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error('Missing TELEGRAM_BOT_TOKEN');
  const receivedHash = data.hash;
  if (!receivedHash) return false;
  // Remove the hash field and sort keys alphabetically
  const sorted = Object.keys(data)
    .filter((key) => key !== 'hash' && key !== 'signature')
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');
  // Derive secret key: HMAC_SHA256(bot_token, "WebAppData")
  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  // Compute HMAC of the data-check-string using the secret key
  const signature = createHmac('sha256', secretKey).update(sorted).digest('hex');
  return signature === receivedHash;
}