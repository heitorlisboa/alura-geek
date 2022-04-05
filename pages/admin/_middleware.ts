import { withAuth } from "next-auth/middleware";

/* Using the NextAuth's middleware `withAuth` will force users to be logged in
   to access any page inside the same directory as the middleware */
export default withAuth({
  pages: {
    // `signIn` page will be used when the user need to sign in to access the page
    signIn: "/login",
    // `error` page will be used when an error occurs
    error: "/login",
  },
});
