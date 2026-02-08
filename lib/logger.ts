import { green, red, yellow, blue } from "console-log-colors";

export type LogMeta = {
  userId?: string | null;
  userName?: string;
  timestamp?: string;
  timeOfDay?: string;
  [key: string]: any;
};

export const logger = {
  /**
   * Log an informational message
   */
  info: (message: string, meta?: Record<string, any>) => {
    console.log(blue(`ℹ️  INFO: ${message}`));
    if (meta) console.log(meta);
  },

  /**
   * Log an error message
   */
  error: (message: string, meta?: Record<string, any>) => {
    console.log(red(`❌ ERROR: ${message}`));
    if (meta) console.log(red(JSON.stringify(meta, null, 2)));
  },

  /**
   * Log a warning message
   */
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(yellow(`⚠️  WARN: ${message}`));
    if (meta) console.log(meta);
  },

  /**
   * Log a success message
   */
  success: (message: string, meta?: LogMeta) => {
    console.log(green(`✅ SUCCESS: ${message}`));
    if (meta?.userId || meta?.userName) {
      const user = meta.userName
        ? `${meta.userName} (${meta.userId || "Unknown"})`
        : meta.userId || "Unknown";
      console.log(
        green(
          `   By: ${user} at ${meta.timestamp || ""} ${meta.timeOfDay || ""}`,
        ),
      );
    }
    console.log(yellow("═".repeat(80)));
  },

  /**
   * Log a request with user info and timestamp
   */
  request: (
    action: string,
    meta: {
      userId?: string | null;
      userName?: string;
      timestamp: string;
      timeOfDay: string;
      data?: any;
    },
  ) => {
    console.log(yellow("═".repeat(80)));
    console.log(yellow(`📝 ${action}`));
    console.log(yellow(`👤 User ID: ${meta.userId || "Unknown"}`));
    if (meta.userName) {
      console.log(yellow(`👤 User Name: ${meta.userName}`));
    }
    console.log(yellow(`📅 Date: ${meta.timestamp}`));
    console.log(yellow(`🕐 Time: ${meta.timeOfDay}`));
    console.log(yellow("═".repeat(80)));
    if (meta.data) {
      console.log("📗 LOG [ Request Data ]:", meta.data);
    }
  },

  /**
   * Log data with a label
   */
  data: (label: string, data: any) => {
    console.log(`📗 LOG [ ${label} ]:`, data);
  },
};
