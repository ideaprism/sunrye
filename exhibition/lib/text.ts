export const strip = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim()
export const cleanMessage = (s: string) => strip(s).replace(/\n{3,}/g, "\n\n")
