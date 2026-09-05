import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ADMIN_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getAdminSecrets,
  timingSafeEqual,
  verifySessionToken,
} from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** 현재 세션이 유효한지 확인한다. 클라이언트 초기 렌더링에서 사용. */
export async function GET() {
  const secrets = getAdminSecrets()
  if (!secrets) return NextResponse.json({ authenticated: false, configured: false })

  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  const authenticated = await verifySessionToken(token, secrets.sessionSecret)
  return NextResponse.json({ authenticated, configured: true })
}

export async function POST(request: Request) {
  const secrets = getAdminSecrets()
  if (!secrets) {
    return NextResponse.json(
      { error: "관리자 인증이 설정되지 않았습니다. ADMIN_PASSWORD와 ADMIN_SESSION_SECRET을 지정하세요." },
      { status: 503 },
    )
  }

  let password = ""
  try {
    const body = await request.json()
    password = typeof body?.password === "string" ? body.password : ""
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  if (!timingSafeEqual(password, secrets.password)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 })
  }

  const response = NextResponse.json({ authenticated: true })
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: await createSessionToken(secrets.sessionSecret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}

/** 로그아웃. */
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
