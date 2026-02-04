export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    // eslint-disable-next-line no-console
    console.log(message, meta ?? "");
  },
  error(message: string, meta?: Record<string, unknown>) {
    // eslint-disable-next-line no-console
    console.error(message, meta ?? "");
  }
};
