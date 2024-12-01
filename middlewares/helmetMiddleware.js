const helmet = require('helmet');

const applyHelmetMiddleware = (app) => {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "data:"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
                scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:", "*"],
                connectSrc: ["'self'", "https://book-store-app-git-main-luongtrzs-projects.vercel.app"],
                frameSrc: ["'self'", "*"], // Allow frames from any source
                mediaSrc: ["'self'", "*"], // Allow media from any source
                objectSrc: ["'self'", "*"], // Allow objects from any source
                childSrc: ["'self'", "*"], // Allow child sources from any source
                workerSrc: ["'self'", "*"], // Allow workers from any source
                manifestSrc: ["'self'", "*"], // Allow manifests from any source
                formAction: ["'self'", "*"], // Allow form actions from any source
                frameAncestors: ["'self'", "*"], // Allow frame ancestors from any source
                baseUri: ["'self'", "*"], // Allow base URIs from any source
                upgradeInsecureRequests: [] // Allow upgrading insecure requests
            }
        }
    }));
};

module.exports = applyHelmetMiddleware;