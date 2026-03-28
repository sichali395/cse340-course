import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/controllers/routes.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Use the imported router to handle routes - THIS MUST COME BEFORE THE 404 HANDLER
console.log('Setting up routes...');
app.use('/', router);

// Catch-all route for 404 errors - THIS MUST COME AFTER ALL ROUTES
app.use((req, res, next) => {
    console.log('404 handler triggered for:', req.url);
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template
    const status = err.status || 500;
    
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
        NODE_ENV: NODE_ENV
    };
    
    // Try to render the error template
    try {
        const template = status === 404 ? 'errors/404' : 'errors/500';
        res.status(status).render(template, context);
    } catch (templateError) {
        // Fallback if error templates don't exist
        console.error('Error template not found, using fallback');
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

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});