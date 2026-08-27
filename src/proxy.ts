import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/", // Redirect to home if not authorized
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
