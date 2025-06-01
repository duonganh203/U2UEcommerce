import { withAuth } from "next-auth/middleware";

export default withAuth(
   function middleware(req) {
      // Add any additional middleware logic here
   },
   {
      callbacks: {
         authorized: ({ token, req }) => {
            // Protect dashboard and admin routes
            if (req.nextUrl.pathname.startsWith("/dashboard")) {
               return !!token;
            }
            if (req.nextUrl.pathname.startsWith("/admin")) {
               // Allow access if role is admin OR email is admin@gmail.com
               return (
                  token?.role === "admin" || token?.email === "admin@gmail.com"
               );
            }
            return true;
         },
      },
   }
);

export const config = {
   matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
