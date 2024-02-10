const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail({ to, subject, resetLink }) {
    // Create a transporter with SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'quake.dev08@gmail.com', 
            pass: 'hpun iujm ingz nzek'
        }
    });
    const emailTemplate = fs.readFileSync('./passwordResetTemplate.html', 'utf-8');
    const emailContent = emailTemplate.replace('%RESET_LINK%', resetLink);
     // Define the email options
    const mailOptions = {
        from: 'EGhost <quake.dev08@gmail.com>', 
        to, // Recipient email address
        subject, // Email subject
        html : emailContent // HTML content of the email body
    };
    transporter.sendMail(mailOptions, (error, info) => 
    {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
}

module.exports = sendEmail;
