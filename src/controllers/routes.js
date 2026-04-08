// src/controllers/routes.js
import express from 'express';
import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showCreateCategoryForm,
    createCategoryHandler,
    showEditCategoryForm,
    updateCategoryHandler,
    showAssignCategoriesPage,
    assignCategoriesHandler
} from './categories.js';
import { testErrorPage } from './errors.js';
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,
    requireAdmin,
    showDashboard,
    getAllUsers
} from './users.js';

const router = express.Router();

// Home page
router.get('/', showHomePage);

// Organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Categories routes - READ
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Categories routes - CREATE (Admin only)
router.get('/new-category', requireAdmin, showCreateCategoryForm);
router.post('/new-category', requireAdmin, createCategoryHandler);

// Categories routes - UPDATE (Admin only)
router.get('/edit-category/:id', requireAdmin, showEditCategoryForm);
router.post('/edit-category/:id', requireAdmin, updateCategoryHandler);

// Category assignment routes (Admin only)
router.get('/assign-categories/:id', requireAdmin, showAssignCategoriesPage);
router.post('/assign-categories/:id', requireAdmin, assignCategoriesHandler);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route (requires login)
router.get('/dashboard', requireLogin, showDashboard);

// Users list route (Admin only)
router.get('/users', requireAdmin, getAllUsers);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;