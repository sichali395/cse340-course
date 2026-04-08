import bcrypt from 'bcrypt';
import db from '../models/db.js';
import { createUser } from '../models/users.js';
import { authenticateUser } from '../models/users.js';
import { getUserVolunteerProjects } from '../models/volunteers.js';

// Registration form display
const showUserRegistrationForm = (req, res) => {
    const error = req.query.error || null;
    const registered = req.query.registered || null;
    res.render('register', { title: 'Register', error: error, registered: registered });
};

// Process registration
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = await createUser(name, email, passwordHash);
        res.redirect('/?registered=true');
        
    } catch (error) {
        console.error('Error registering user:', error);
        
        let errorMsg = 'registration_error';
        if (error.message === 'A user with this email already exists') {
            errorMsg = 'email_exists';
        }
        res.redirect(`/register?error=${errorMsg}`);
    }
};

// Login form display
const showLoginForm = (req, res) => {
    const error = req.query.error || null;
    res.render('login', { title: 'Login', error: error });
};

// Process login
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            console.log('User logged in:', user);
            res.redirect('/dashboard');
        } else {
            res.redirect('/login?error=invalid');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('/login?error=server');
    }
};

// Process logout
const processLogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};

// Middleware to require login
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login?error=not_logged_in');
    }
    next();
};

// Middleware to require admin role (role_id = 2)
const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login?error=not_logged_in');
    }
    
    if (req.session.user.role_id !== 2) {
        return res.redirect('/dashboard?error=access_denied');
    }
    next();
};

// Dashboard page display
const showDashboard = async (req, res) => {
    const user = req.session.user;
    const error = req.query.error || null;
    const message = req.query.message || null;
    
    // Get user's volunteer projects
    let volunteerProjects = [];
    try {
        volunteerProjects = await getUserVolunteerProjects(user.user_id);
    } catch (error) {
        console.error('Error fetching volunteering projects:', error);
    }
    
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        user: user,
        error: error,
        message: message,
        volunteerProjects: volunteerProjects
    });
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.user_id, u.name, u.email, u.created_at, r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            ORDER BY u.user_id
        `);
        
        res.render('users', { 
            title: 'Manage Users',
            users: result.rows,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.redirect('/dashboard?error=server_error');
    }
};

// Export all functions
export { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,
    requireAdmin,
    showDashboard,
    getAllUsers
};