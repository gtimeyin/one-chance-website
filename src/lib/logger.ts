type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  module?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === "development";
const PROD_LOG_LEVELS: LogLevel[] = ["warn", "error"];

function shouldLog(level: LogLevel): boolean {
  if (isDev) return true;
  return PROD_LOG_LEVELS.includes(level);
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const module = context?.module ? `[${context.module}]` : "";
  return `${timestamp} ${level.toUpperCase()} ${module} ${message}`;
}

function formatContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;
  const { module: _, ...rest } = context;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (shouldLog("debug")) {
      const formatted = formatMessage("debug", message, context);
      const ctx = formatContext(context);
      ctx ? console.debug(formatted, ctx) : console.debug(formatted);
    }
  },
  info(message: string, context?: LogContext): void {
    if (shouldLog("info")) {
      const formatted = formatMessage("info", message, context);
      const ctx = formatContext(context);
      ctx ? console.info(formatted, ctx) : console.info(formatted);
    }
  },
  warn(message: string, context?: LogContext): void {
    if (shouldLog("warn")) {
      const formatted = formatMessage("warn", message, context);
      const ctx = formatContext(context);
      ctx ? console.warn(formatted, ctx) : console.warn(formatted);
    }
  },
  error(message: string, error?: unknown, context?: LogContext): void {
    if (shouldLog("error")) {
      const formatted = formatMessage("error", message, context);
      const ctx = formatContext(context);
      if (error) {
        ctx ? console.error(formatted, error, ctx) : console.error(formatted, error);
      } else {
        ctx ? console.error(formatted, ctx) : console.error(formatted);
      }
    }
  },
};

export function createLogger(module: string) {
  return {
    debug: (message: string, context?: Omit<LogContext, "module">) =>
      logger.debug(message, { ...context, module }),
    info: (message: string, context?: Omit<LogContext, "module">) =>
      logger.info(message, { ...context, module }),
    warn: (message: string, context?: Omit<LogContext, "module">) =>
      logger.warn(message, { ...context, module }),
    error: (message: string, error?: unknown, context?: Omit<LogContext, "module">) =>
      logger.error(message, error, { ...context, module }),
  };
}
