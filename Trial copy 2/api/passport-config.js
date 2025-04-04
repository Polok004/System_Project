import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./lib/prisma.js";
import crypto from "crypto";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8800/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ignore users with null googleId
        let user = await prisma.user.findFirst({
          where: { googleId: profile.id }, // Adjusted to findFirst()
        });

        // If no user exists, create one
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              role: "user",
              password: crypto.randomBytes(16).toString("hex"),
            },
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);
export default passport;