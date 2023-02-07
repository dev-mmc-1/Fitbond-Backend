const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: "mmcgbl@gmail.com", pass: "odffaluyhmwfclep" },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    forgotPasswordEmail: (email, codeGen, name) => {
        const mailOptions = {
            from: 'mmcgbl@gmail.com',
            to: email,
            subject: 'FitBond',
            text: 'OTP Verification',
            html: `
            <div style="font-family:'Lato',sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
              <a href="" style="font-family:'Lato',sans-serif;font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FitBond</a>
            </div>
              <p style="font-size:1.1em";font-family:'Lato',sans-serif;>Hey ${name},</p>
              <p style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:400;font-family:'Lato',sans-serif;">You recently requested to reset your password for your Fitbond account. If you've lost your password or wish to reset it use the OTP below to reset it.</p>
              <p style="font-family:'Lato',sans-serif;font-weight:600;font-size:1.4em;">This password reset is only valid for the next 2 minutes.</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${codeGen}</h2>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p style="font-family:'Lato',sans-serif;">FitBond</p>
            </div>
        </div>
        </div> `
        };
        new Promise((reslove, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                } else {
                    console.log("check");
                    reslove('Email sent: ' + info.response);
                }
            })
        })
    }
}