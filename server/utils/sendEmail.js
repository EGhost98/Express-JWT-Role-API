const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail({ to, subject, resetLink }) {
    // Create a transporter with SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aditya09proud@gmail.com', 
            pass: 'bews oqqz fykz sprq'
        }
    });
    const emailTemplate = fs.readFileSync('server/utils/passwordResetTemplate.html', 'utf-8');
    const emailContent = emailTemplate.replace('%RESET_LINK%', resetLink);
     // Define the email options
    const mailOptions = {
        from: 'EGhost <aditya09proud@gmail.com>', 
        to, // Recipient email address
        subject, // Email subject
        html : emailContent // HTML content of the email body
    };
    transporter.sendMail(mailOptions, (error, info) => 
    {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
