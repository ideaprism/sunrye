import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

// 관리자 로그인: 비밀번호는 Vercel 환경변수 ADMIN_PASSWORD 로 정한다
const COOKIE = "kimsunrye_admin"
const DAYS = 14

const sign = (exp: number) =>
  createHmac("sha256", `${process.env.GUESTBOOK_SECRET}|${process.env.ADMIN_PASSWORD}`).update(`admin:${exp}`).digest("hex")

export const adminReady = () => Boolean(process.env.ADMIN_PASSWORD && process.env.GUESTBOOK_SECRET)

export function checkPassword(pw: string) {
  if (!adminReady()) return false
  const a = Buffer.from(pw)
  const b = Buffer.from(process.env.ADMIN_PASSWORD!)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function setAdminCookie() {
  const exp = Date.now() + DAYS * 86400_000
  ;(await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: DAYS * 86400,
  })
}

export async function clearAdminCookie() {
  ;(await cookies()).delete(COOKIE)
}

export async function isAdmin() {
  if (!adminReady()) return false
  const v = (await cookies()).get(COOKIE)?.value
  if (!v) return false
  const [expS, sig] = v.split(".")
  const exp = Number(expS)
  if (!exp || exp < Date.now() || !sig) return false
  const a = Buffer.from(sign(exp))
  const b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}
