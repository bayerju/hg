import { authMiddleware } from "@clerk/nextjs";
import { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {

// }

export default authMiddleware({
  publicRoutes: ["/api/(.*)"],
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
