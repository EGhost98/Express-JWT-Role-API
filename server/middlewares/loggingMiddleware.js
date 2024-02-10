const fs = require('fs');
const path = require('path');

function loggingMiddleware(req, res, next) {
    const logFilePath = path.join(__dirname, '../logs/access.log');
    const { method, url, headers, ip } = req;
    const userAgent = headers['user-agent'];
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${ip} - ${method} ${url} - ${userAgent}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    // console.log(req.path, req.method, res.statusCode);
    // if (req.path === '/api/auth/login' && req.method === 'POST' && res.statusCode === 401) {
    //     const failedLoginMessage = `${timestamp} - ${ip} - Failed login attempt\n`;
    //     console.log(failedLoginMessage);
    //     fs.appendFile(logFilePath, failedLoginMessage, (err) => {
    //         if (err) {
    //             console.error('Error writing to log file:', err);
    //         }
    //     });
    // }
    // if (res.statusCode === 403) {
    //     const unauthorizedAccessMessage = `${timestamp} - ${ip} - Unauthorized access attempt to ${url}\n`;
    //     console.log(unauthorizedAccessMessage);
    //     fs.appendFile(logFilePath, unauthorizedAccessMessage, (err) => {
    //         if (err) {
    //             console.error('Error writing to log file:', err);
    //         }
    //     });
    // }
    next();
}

module.exports = loggingMiddleware;
