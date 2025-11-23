import { randomBytes } from 'crypto';

/**
 * Generate unique ID with prefix
 * Format: {prefix}_{timestamp}_{random}
 *
 * Examples:
 * - usr_1732345678_a1b2c3d4e5f6
 * - opd_1732345678_f6e5d4c3b2a1
 * - rep_1732345678_1a2b3c4d5e6f
 */
export function generateId(prefix) {
  const timestamp = Date.now().toString(36); // Base36 timestamp (shorter)
  const randomStr = randomBytes(8).toString('hex'); // 16 char random string
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Generate IDs with specific prefixes for each model
 */
export const generateUserId = () => generateId('usr');
export const generateOpdId = () => generateId('opd');
export const generateReportId = () => generateId('rep');
export const generateCommentId = () => generateId('cmt');
export const generateLogId = () => generateId('log');
export const generateBugReportId = () => generateId('bug');
export const generateBugCommentId = () => generateId('bgc');
export const generateNotificationId = () => generateId('ntf');
export const generateEmailId = () => generateId('eml');
export const generateChatRoomId = () => generateId('crm');
export const generateChatMessageId = () => generateId('cmg');

/**
 * Get prefix from ID
 */
export function getIdPrefix(id) {
  if (!id || typeof id !== 'string') return null;
  return id.split('_')[0];
}

/**
 * Validate ID format
 */
export function isValidId(id, expectedPrefix = null) {
  if (!id || typeof id !== 'string') return false;

  const parts = id.split('_');
  if (parts.length !== 3) return false;

  const [prefix, timestamp, random] = parts;

  // Check if prefix matches expected
  if (expectedPrefix && prefix !== expectedPrefix) return false;

  // Check timestamp is valid base36
  if (!/^[0-9a-z]+$/.test(timestamp)) return false;

  // Check random is valid hex
  if (!/^[0-9a-f]{16}$/.test(random)) return false;

  return true;
}

/**
 * Model-specific validators
 */
export const isValidUserId = (id) => isValidId(id, 'usr');
export const isValidOpdId = (id) => isValidId(id, 'opd');
export const isValidReportId = (id) => isValidId(id, 'rep');
export const isValidCommentId = (id) => isValidId(id, 'cmt');
export const isValidLogId = (id) => isValidId(id, 'log');
export const isValidBugReportId = (id) => isValidId(id, 'bug');
export const isValidBugCommentId = (id) => isValidId(id, 'bgc');
