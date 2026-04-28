import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isVerified) {
      // If unverified user tries to access dashboard, send to verify-email
      const userStr = request.cookies.get("user")?.value;
      const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
      const verifyUrl = new URL("/verify-email", request.url);
      if (user?.email) {
        verifyUrl.searchParams.set("email", user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
  }

  // ALLOW unverified users to access login/register/verify-email if they want to switch accounts
  // Only redirect away if they are FULLY logged in AND verified
  if (
    token &&
    isVerified &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/verify-email")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};
