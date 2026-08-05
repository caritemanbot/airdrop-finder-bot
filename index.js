'use strict';

const TelegramBot = require('node-telegram-bot-api');
const env = require('./config/env');
const { connect, disconnect } = require('./database/client');
const logger = require('./utils/logger');
const { safeHandler, attachProcessHandlers } = require('./middlewares/errorHandler');
const { requireAdmin } = require('./middlewares/adminAuth');
const { startAllSchedulers } = require('./scheduler');
const adminController = require('./modules/admin/admin.controller');

async function main() {
  attachProcessHandlers();
  await connect();

  const bot = new TelegramBot(env.BOT_TOKEN, { polling: true });
  logger.info('bot', 'Telegram bot started (polling mode)');

  bot.on('polling_error', (err) => {
    logger.error('telegram', `Polling error: ${err.message}`);
  });

  // ----------------------------------------------------------
  // Public commands
  // ----------------------------------------------------------

  bot.onText(/^\/start$/, safeHandler(bot, 'start', async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      '👋 <b>Airdrop Finder</b> is online.\n\n' +
        'I track Web3/TON news, projects, and airdrops with AI-powered analysis.\n\n' +
        'Add me to your group and I\'ll start posting relevant updates automatically.',
      { parse_mode: 'HTML' }
    );
  }));

  bot.onText(/^\/help$/, safeHandler(bot, 'help', async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      [
        '<b>Commands</b>',
        '/start — welcome message',
        '/help — this message',
        '',
        '<b>Admin commands</b>',
        '/stats — live platform statistics',
        '/forcescan — run the news pipeline immediately',
        '/addsource TYPE name url — register a source (NEWS|PROJECT|AIRDROP)',
        '/removesource TYPE url — deactivate a source',
        '/settings — show this group\'s settings',
        '/reload — refresh active sources from DB',
        '/broadcast text — send an announcement to the main group',
        '/export — export active sources as JSON',
        '/import [json] — bulk import sources',
      ].join('\n'),
      { parse_mode: 'HTML' }
    );
  }));

  // ----------------------------------------------------------
  // Admin commands
  // ----------------------------------------------------------

  bot.onText(/^\/stats$/, safeHandler(bot, 'stats', requireAdmin(bot, (msg) => adminController.handleStats(bot, msg))));

  bot.onText(/^\/forcescan$/, safeHandler(bot, 'forcescan', requireAdmin(bot, (msg) => adminController.handleForceScan(bot, msg))));

  bot.onText(/^\/addsource(?:\s+(.+))?$/, safeHandler(bot, 'addsource', requireAdmin(bot, (msg, match) => adminController.handleAddSource(bot, msg, match))));

  bot.onText(/^\/removesource(?:\s+(.+))?$/, safeHandler(bot, 'removesource', requireAdmin(bot, (msg, match) => adminController.handleRemoveSource(bot, msg, match))));

  bot.onText(/^\/settings$/, safeHandler(bot, 'settings', requireAdmin(bot, (msg) => adminController.handleSettings(bot, msg))));

  bot.onText(/^\/reload$/, safeHandler(bot, 'reload', requireAdmin(bot, (msg) => adminController.handleReload(bot, msg))));

  bot.onText(/^\/broadcast(?:\s+([\s\S]+))?$/, safeHandler(bot, 'broadcast', requireAdmin(bot, (msg, match) => adminController.handleBroadcast(bot, msg, match, env.GROUP_ID))));

  bot.onText(/^\/export$/, safeHandler(bot, 'export', requireAdmin(bot, (msg) => adminController.handleExport(bot, msg))));

  bot.onText(/^\/import(?:\s+([\s\S]+))?$/, safeHandler(bot, 'import', requireAdmin(bot, (msg, match) => adminController.handleImport(bot, msg, match))));

  // ----------------------------------------------------------
  // Schedulers
  // ----------------------------------------------------------

  startAllSchedulers(bot);

  // ----------------------------------------------------------
  // Graceful shutdown
  // ----------------------------------------------------------

  const shutdown = async (signal) => {
    logger.info('bot', `Received ${signal}, shutting down gracefully`);
    try {
      await bot.stopPolling();
    } catch (_) {}
    await disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.error('bot', `Fatal startup error: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
