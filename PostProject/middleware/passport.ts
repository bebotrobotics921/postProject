import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// ⭐ TODO: Passport Types
const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: string, password: string, done: (any))=> {
    // Check if user exists in databse
    const user = await getUserByEmailIdAndPassword(uname, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

// ⭐ TODO: Passport Types
passport.serializeUser(function (user: Express.User, done: (err: Error | null, id?: number) => void) {
  done(null, user.id);
});

// ⭐ TODO: Passport Types
passport.deserializeUser(function (id: number, done: (err: {message: string} | null, user?: any | null) => void) {
  const user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

export default passport.use(localLogin);
