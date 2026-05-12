import { NextResponse } from "next/server";

export function middleware(request) {
  // Skip the login page itself and static assets
  const { pathname } = request.nextUrl;
  if (pathname === "/login" || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const auth = request.cookies.get("auth")?.value;
  if (auth === process.env.APP_PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
