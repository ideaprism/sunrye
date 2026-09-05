/**
 * 관리자 세션 인증 유틸리티.
 *
 * 세션 토큰은 `<만료시각>.<HMAC-SHA256 서명>` 형태이며 httpOnly 쿠키로만 전달된다.
 * Web Crypto만 사용하므로 Edge(middleware)와 Node(route handler) 양쪽에서 동작한다.
 *
 * 필요한 환경변수:
 *   ADMIN_PASSWORD        관리자 로그인 비밀번호
 *   ADMIN_SESSION_SECRET  세션 서명용 시크릿 (32자 이상 권장)
 *
 * 둘 중 하나라도 없으면 모든 인증이 실패한다(fail closed).
 */

export const ADMIN_COOKIE_NAME = "admin_session"
export const SESSION_TTL_SECONDS = 60 * 60 * 8

const encoder = new TextEncoder()

function toBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return toBase64Url(new Uint8Array(signature))
}

/** 길이·내용 노출을 줄이기 위한 상수 시간 비교. */
export function timingSafeEqual(a: string, b: string) {
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  let diff = aBytes.length ^ bBytes.length
  const max = Math.max(aBytes.length, bBytes.length)
  for (let i = 0; i < max; i += 1) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }
  return diff === 0
}

export function getAdminSecrets() {
  const password = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  if (!password || !sessionSecret) return null
  return { password, sessionSecret }
}

export async function createSessionToken(sessionSecret: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = String(expiresAt)
  return `${payload}.${await sign(payload, sessionSecret)}`
}

export async function verifySessionToken(token: string | undefined, sessionSecret: string) {
  if (!token) return false

  const separator = token.lastIndexOf(".")
  if (separator <= 0) return false

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false

  return timingSafeEqual(signature, await sign(payload, sessionSecret))
}
