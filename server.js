import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { testConnection } from './src/models/db.js';
import router from './src/controllers/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session middleware
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Flash middleware
app.use(flash());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make user and isLoggedIn available to all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    res.locals.user = null;
    
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
    }

    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Routes
console.log('Setting up routes...');
app.use('/', router);

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    
    const status = err.status || 500;
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
        NODE_ENV: NODE_ENV
    };
    
    try {
        const template = status === 404 ? 'errors/404' : 'errors/500';
        res.status(status).render(template, context);
    } catch (templateError) {
        res.status(status).send(`
            <h1>${context.title}</h1>
            <p>${status === 404 ? 'The page you requested does not exist.' : 'An unexpected error occurred.'}</p>
            ${NODE_ENV === 'development' ? `<pre>${err.stack}</pre>` : ''}
            <p><a href="/">Return to homepage</a></p>
        `);
    }
});

// Start the server
const server = app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`✓ Server is running at http://127.0.0.1:${PORT}`);
        console.log(`✓ Environment: ${NODE_ENV}`);
        console.log('✓ Press Ctrl+C to stop the server');
    } catch (error) {
        console.error('✗ Error connecting to the database:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});