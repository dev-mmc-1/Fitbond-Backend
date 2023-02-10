const User = require('../../models/User');
const Interest = require('../../models/Interest');
const Sport = require('../../models/Sports');
const ForgotPassword = require('../../models/ForgotPassword');
var jwt = require('jsonwebtoken');
const { createHash } = require('../../helpers/authHelper');
const errorName = require('../../utilities/errors');
const { handleError } = require('../../helpers/errorHelper');
const { forgotPasswordEmail } = require('../../helpers/emailHelper');
const moment = require('moment');
const bcrypt = require("bcrypt");
require('dotenv').config();
var ObjectId = require('mongoose').Types.ObjectId;
const { INVALIDEMAILORPASSWORD, INTERNALSERVER, USERALREADYEXISTS, EMAILNOTEXISTS, FULLNAMEREQUIRED, MOBILEREQUIRED, GENDERREQUIRED, PASSWORDREQUIRED, EMAILREQUIRED, EMAILFORMATEQUIRED, OTPLENGTH, OTPNOTEXISTS, PASSWORDGT, PASSWORDLT, OTPINVALID, OTPEXPIRED, SHOULDNOTHAVESAMEPASSWORD, SPORTALREADYEXIST, INTEREST, AUTHTOKENREQUIRED, NAMEREQUIRED, TOKENEXPIRED } = errorName;


// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const userResolver = {
    Query: {
        sports: async (_, args, { user }) => {
            try {
                const newSport = await Sport.find({})
                console.log("asdasdasdasd", newSport);
                return newSport;
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
    },

    Mutation: {
        createUser: async (_, args, context) => {
            try {
                const { email, password, gender, mobileNumber, fullName } = args.input;
                console.log("crateUSer", email);

                const findMail = await User.findOne({ email }).select('email');
                if (email === "" || email === undefined || email.trim().length < 1) {
                    return handleError(EMAILREQUIRED.message, 'FORBIDDEN', EMAILREQUIRED.statusCode)
                }
                if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) {
                    return handleError(EMAILFORMATEQUIRED.message, 'FORBIDDEN', EMAILFORMATEQUIRED.statusCode)
                }
                if (findMail?.email === email) {
                    return handleError(USERALREADYEXISTS.message, 'FORBIDDEN', USERALREADYEXISTS.statusCode)
                }
                if (password === "" || password === undefined || password.trim().length < 1) {
                    return handleError(PASSWORDREQUIRED.message, 'FORBIDDEN', PASSWORDREQUIRED.statusCode)
                }
                if (gender === "" || gender === undefined || gender.trim().length < 1) {
                    return handleError(GENDERREQUIRED.message, 'FORBIDDEN', GENDERREQUIRED.statusCode)
                }
                if (mobileNumber === "" || mobileNumber === undefined || mobileNumber.trim().length < 1) {
                    return handleError(MOBILEREQUIRED.message, 'FORBIDDEN', MOBILEREQUIRED.statusCode)
                }
                if (fullName === "" || fullName === undefined || fullName.trim().length < 1) {
                    return handleError(FULLNAMEREQUIRED.message, 'FORBIDDEN', FULLNAMEREQUIRED.statusCode)
                }
                if (password.length < 8) {
                    return handleError(PASSWORDGT.message, 'FORBIDDEN', PASSWORDGT.statusCode)
                }
                if (password.length > 15) {
                    return handleError(PASSWORDLT.message, 'FORBIDDEN', PASSWORDLT.statusCode)
                }

                const encryptedPass = createHash(password);

                const result = new User({
                    email,
                    password: encryptedPass,
                    gender,
                    mobileNumber,
                    fullName
                })
                console.log("yyyyyyyy", result);
                result.save();
                return { message: "Congratulations, your account has been successfully created." }
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        loginUser: async (_, args, context) => {
            try {
                const { email, password } = args.input;

                if (email === "" || email === undefined || email.trim().length < 1) {
                    return handleError(EMAILREQUIRED.message, 'FORBIDDEN', EMAILREQUIRED.statusCode);
                }
                if (password === "" || password === undefined || password.trim().length < 1) {
                    return handleError(PASSWORDREQUIRED.message, 'FORBIDDEN', PASSWORDREQUIRED.statusCode);
                }

                const result = await User.findOne({ email });
                let decryptPass;
                if (result?.password != null) {
                    decryptPass = bcrypt.compareSync(password, result?.password, 10);
                }

                if (result?.email != email || !decryptPass) {
                    return handleError(INVALIDEMAILORPASSWORD.message, 'FORBIDDEN', 400);
                }

                const encryptPass = jwt.sign({ email }, 'secretToken', { expiresIn: '5h' });
                await User.findOneAndUpdate({ email }, { $set: { deviceId: [encryptPass] } });
                result.token = encryptPass;
                return result;
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        forgotPassword: async (_, args, context) => {
            try {
                const { email } = args.input;

                if (email === "" || email === undefined || email.trim().length < 1) {
                    return handleError(EMAILREQUIRED.message, 'FORBIDDEN', EMAILREQUIRED.statusCode)
                }

                const findMail = await User.findOne({ email }).select('email fullName');
                if (findMail?.email != email) {
                    return handleError(EMAILNOTEXISTS.message, 'FORBIDDEN', EMAILNOTEXISTS.statusCode);
                }
                const codeGen = Math.floor(1000 + Math.random() * 9000);

                function addMinutes(date, minutes) {
                    date.setMinutes(date.getMinutes() + minutes);
                    return date;
                }

                const date = new Date();

                const newDate = addMinutes(date, 5);
                const obj = { userId: findMail._id, otp: codeGen, otpExpire: newDate, email: email }
                const findUser = await ForgotPassword.updateOne({ userId: findMail._id }, obj, {
                    upsert: true,
                    setDefaultsOnInsert: true
                });

                forgotPasswordEmail(email, codeGen, findMail.fullName);

                return { message: "Verification code send to your email" }

            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        verifyOTP: async (_, args, context) => {
            try {
                const { otpCode } = args.input;
                const otpInvalid = String(otpCode);
                if (otpInvalid.length < 1) {
                    return handleError(OTPLENGTH.message, 'FORBIDDEN', OTPLENGTH.statusCode);
                }
                const fetchOtpDb = await ForgotPassword.findOne({ otp: otpCode });

                if (fetchOtpDb?.otp == null) {
                    return handleError(OTPNOTEXISTS.message, 'FORBIDDEN', OTPNOTEXISTS.statusCode);
                }

                if (fetchOtpDb?.otp !== otpCode) {
                    return handleError(OTPINVALID.message, 'FORBIDDEN', OTPINVALID.statusCode);
                }
                const curentTime = new Date().getTime();
                const expiryTime = new Date(fetchOtpDb?.otpExpire).getTime();
                console.log("new_data", curentTime > expiryTime);
                console.log("expiryTime", expiryTime);
                console.log("curentTime", curentTime);
                if (curentTime > expiryTime) {
                    return handleError(OTPEXPIRED.message, 'FORBIDDEN', OTPEXPIRED.statusCode);
                }
                // const result = await ForgotPassword.findOne({ otp: otpCode, otpExpire: { [Op.gte]: Date.now() - 3600000 } })
                return { message: "Your account has been successfully verified." }
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        resetPassword: async (_, args, context) => {
            try {
                const { email, password } = args.input;
                const findMail = await ForgotPassword.findOne({ email });
                const curentTime = new Date().getTime();
                const expiryTime = new Date(findMail?.otpExpire).getTime();
                console.log("reset_data", curentTime > expiryTime);
                console.log("reset_expiryTime", expiryTime);
                console.log("reset_curentTime", curentTime);
                if (curentTime > expiryTime) {
                    return handleError(OTPEXPIRED.message, 'FORBIDDEN', OTPEXPIRED.statusCode);
                }
                if (email === "" || email === undefined || email.trim().length < 1) {
                    return handleError(EMAILREQUIRED.message, 'FORBIDDEN', EMAILREQUIRED.statusCode);
                }
                if (password === "" || password === undefined || password.trim().length < 1) {
                    return handleError(PASSWORDREQUIRED.message, 'FORBIDDEN', PASSWORDREQUIRED.statusCode)
                }
                if (findMail?.email !== email) {
                    return handleError(EMAILNOTEXISTS.message, 'FORBIDDEN', EMAILNOTEXISTS.statusCode);
                }
                const result = await User.findOne({ email });
                let decryptPass = bcrypt.compareSync(password, result?.password, 10);
                if (decryptPass) {
                    return handleError(SHOULDNOTHAVESAMEPASSWORD.message, 'FORBIDDEN', SHOULDNOTHAVESAMEPASSWORD.statusCode);
                }
                findMail.otp = null;
                findMail.otpExpire = null;
                const encryptedPass = createHash(password);
                result.password = encryptedPass;
                const findUser = await ForgotPassword.updateOne({ email }, findMail, {
                    upsert: true,
                    setDefaultsOnInsert: true
                });
                const updatedUser = await User.updateOne({ email }, result, {
                    upsert: true,
                    setDefaultsOnInsert: true
                });

                return { message: "Password has been reset." }
            } catch (err) {
                console.log("sadasdasd", err);
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        addSport: async (_, args, context) => {
            try {
                const { name, image } = args.input;
                if (name === "" || name === undefined || name.trim().length < 1) {
                    return handleError(NAMEREQUIRED.message, 'FORBIDDEN', NAMEREQUIRED.statusCode)
                }
                const check = await Sport.findOne({ name });
                if (check?.name == name) {
                    return handleError(SPORTALREADYEXIST.message, "FORBIDDEN", SPORTALREADYEXIST.statusCode);
                }
                const newSport = new Sport({
                    name
                })
                newSport.save();
                return { message: "Sport Added." }
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        addUserInterest: async (_, args, { user }) => {
            try {
                if (user === undefined || user === '') {
                    return handleError(AUTHTOKENREQUIRED.message, 'FORBIDDEN', AUTHTOKENREQUIRED.statusCode);
                }
                console.log("saveInterest", user);
                if (user?.deviceId == null) {
                    return handleError(TOKENEXPIRED.message, 'FORBIDDEN', TOKENEXPIRED.statusCode);
                }
                console.log("saveInterest", user);
                const userInterestList = args.input;
                const result = await Interest.findOne({ userId: new ObjectId(user._id) });
                console.log("result", result)
                if (result !== null) {
                    return handleError(INTEREST.message, 'FORBIDDEN', INTEREST.statusCode);
                }
                const saveInterest = await Interest.insertMany(userInterestList);
                return { message: "Interest Added." }
            } catch (err) {
                console.log("hhhhh", err);
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        },
        logoutUser: async (_, args, { user }) => {
            try {
                const { token } = args.input;
                // if (token === "" || token === undefined || token.trim().length < 1) {
                //     return handleError(AUTHTOKENREQUIRED.message, 'FORBIDDEN', AUTHTOKENREQUIRED.statusCode)
                // }
                if (user === undefined || user === '') {
                    return handleError(AUTHTOKENREQUIRED.message, 'FORBIDDEN', AUTHTOKENREQUIRED.statusCode);
                }
                await User.findOneAndUpdate({ email: user.email }, { $set: { deviceId: null } });
                // const encryptPass = jwt.sign({ email: user.email }, 'secretToken', { expiresIn: '5h' });
                return { message: "Logout Successfully!" }
            } catch {
                return handleError(INTERNALSERVER.message, 'FORBIDDEN', INTERNALSERVER.statusCode);
            }
        }
    }
};

module.exports = userResolver;