module.exports = {
    INVALIDEMAILORPASSWORD: {
        message: 'Invalid email or password!',
        statusCode: 400
    },
    USERALREADYEXISTS: {
        message: 'Email already exists',
        statusCode: 409
    },
    INTERNALSERVER: {
        message: 'Internal server error',
        statusCode: 500
    },
    EMAILNOTEXISTS: {
        message: 'Email not exists',
        statusCode: 404
    },
    EMAILREQUIRED: {
        message: 'Email required',
        statusCode: 400
    },
    PASSWORDREQUIRED: {
        message: 'Password required',
        statusCode: 400
    },
    GENDERREQUIRED: {
        message: 'Gender required',
        statusCode: 400
    },
    MOBILEREQUIRED: {
        message: 'Mobile number required',
        statusCode: 400
    },
    FULLNAMEREQUIRED: {
        message: 'FullName required',
        statusCode: 400
    },
    NAMEREQUIRED: {
        message: 'Sports name required',
        statusCode: 400
    },
    EMAILFORMATEQUIRED: {
        message: 'Invalid email format.',
        statusCode: 400
    },
    OTPLENGTH: {
        message: 'OTP required!',
        statusCode: 400
    },
    OTPNOTEXISTS: {
        message: `Otp doesn't exists.`,
        statusCode: 400
    },
    PASSWORDGT: {
        message: `Password length must be atleast 8 characters.`,
        statusCode: 400
    },
    PASSWORDLT: {
        message: `Password length must not exceed 15 characters`,
        statusCode: 400
    },
    OTPEXPIRED: {
        message: `Your requested OTP has been expired.`,
        statusCode: 400
    },
    OTPINVALID: {
        message: `Invalid OTP entered.`,
        statusCode: 400
    },
    SHOULDNOTHAVESAMEPASSWORD: {
        message: `Sorry, an error occurred. New password must be different from previous one.`,
        statusCode: 400
    },
    SPORTALREADYEXIST: {
        message: `Sport Interest already exists for this user.`,
        statusCode: 400
    },
    INTEREST: {
        message: `Sports already for this user.`,
        statusCode: 400
    },
    AUTHTOKENREQUIRED: {
        message: `Authentication token required.`,
        statusCode: 401
    },
    TOKENEXPIRED: {
        message: `Token expired.`,
        statusCode: 400
    },
    // OTPREQUIRED: {
    //     message: 'OTP required!',
    //     statusCode: 400
    // }
}