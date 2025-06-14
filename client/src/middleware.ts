import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  
  // Check if the request is for the admin subdomain
  const isAdminSubdomain = hostname.startsWith("admin.");
  
  // If not on admin subdomain and trying to access admin routes, redirect to admin subdomain
  if (!isAdminSubdomain && url.pathname.startsWith("/admin")) {
    const adminUrl = new URL(url.pathname, `https://admin.${hostname}`);
    return NextResponse.redirect(adminUrl);
  }
  
  // If on admin subdomain but not on admin routes, redirect to main site
  if (isAdminSubdomain && !url.pathname.startsWith("/admin")) {
    const mainUrl = new URL(url.pathname, `https://${hostname.replace("admin.", "")}`);
    return NextResponse.redirect(mainUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 