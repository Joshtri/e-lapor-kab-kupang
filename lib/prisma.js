import { PrismaClient } from '@prisma/client';
import {
  generateUserId,
  generateOpdId,
  generateReportId,
  generateCommentId,
  generateLogId,
  generateBugReportId,
  generateBugCommentId,
  generateNotificationId,
  generateEmailId,
  generateChatRoomId,
  generateChatMessageId,
} from './generateId.js';

// Prisma Client Singleton
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ===========================
// MIDDLEWARE: AUTO-GENERATE IDs WITH PREFIX
// ===========================

prisma.$use(async (params, next) => {
  // Only apply to create operations
  if (params.action === 'create' || params.action === 'createMany') {
    // Map model names to their ID generator functions
    const idGenerators = {
      User: generateUserId,
      OPD: generateOpdId,
      Report: generateReportId,
      Comment: generateCommentId,
      Log: generateLogId,
      BugReport: generateBugReportId,
      BugComment: generateBugCommentId,
      Notification: generateNotificationId,
      Email: generateEmailId,
      ChatRoom: generateChatRoomId,
      ChatMessage: generateChatMessageId,
    };

    const generator = idGenerators[params.model];

    if (generator) {
      if (params.action === 'create') {
        // Single create: generate ID if not provided
        if (!params.args.data.id) {
          params.args.data.id = generator();
        }
      } else if (params.action === 'createMany') {
        // Bulk create: generate IDs for all records without ID
        if (params.args.data && Array.isArray(params.args.data)) {
          params.args.data = params.args.data.map((record) => ({
            ...record,
            id: record.id || generator(),
          }));
        }
      }
    }
  }

  return next(params);
});

export default prisma;
