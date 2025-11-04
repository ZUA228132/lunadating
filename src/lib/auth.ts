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