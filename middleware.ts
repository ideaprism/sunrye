import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth"

/**
 * /api/admin/* 전체를 세션 쿠키로 보호한다.
 *
 * 로그인 엔드포인트만 예외이며, 그 외에는 유효한 세션이 없으면 401을 반환한다.
 * 새 관리자 라우트가 추가돼도 자동으로 보호되도록 개별 핸들러가 아닌 미들웨어에서 처리한다.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/admin/login") {
    return NextResponse.next()
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  if (!sessionSecret) {
    return NextResponse.json(
      { error: "관리자 인증이 설정되지 않았습니다." },
      { status: 503 },
    )
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!(await verifySessionToken(token, sessionSecret))) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/admin/:path*"],
}
