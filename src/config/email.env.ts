import env from "./env";

export const mailService = env('MAIL_SERVICE');
export const mailHost = env('MAIL_HOST');
export const mailPort = env('MAIL_PORT');
export const mailAuthUser = env('MAIL_AUTH_USER');
export const mailAuthPassword = env('MAIL_AUTH_PASSWORD');