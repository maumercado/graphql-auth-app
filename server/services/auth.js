const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLocaleLowerCase() });
            if (user) {
                const isMatch = await user.comparePassword(password);
                if (isMatch) {
                    return done(null, user);
                }
            }
            return done(null, false, "Invalid Credentials");
        } catch (err) {
            return done(err);
        }
    })
);

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
async function signup({ email, password, req }) {
    try {
        const newUser = new User({ email, password });
        if (!email || !password) {
            throw new Error("You must provide an email and password.");
        }
        const user = await User.findOne({ email }).exec();
        if (user) {
            throw new Error("Email in use");
        }
        const savedUser = await newUser.save();

        return new Promise((resolve, reject) => {
            req.logIn(savedUser, err => {
                if (err) {
                    reject(err);
                }
                resolve(savedUser);
            });
        });
    } catch (err) {
        throw err;
    }
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
function login({ email, password, req }) {
    return new Promise((resolve, reject) => {
        passport.authenticate("local", (err, user) => {
            if (!user) {
                reject("Invalid credentials.");
            }

            req.login(user, () => resolve(user));
        })({ body: { email, password } });
    });
}

module.exports = { signup, login };
