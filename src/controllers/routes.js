// src/controllers/routes.js
import express from 'express';
import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage, addVolunteerHandler, removeVolunteerHandler } from './projects.js';
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
import { getUserVolunteerProjects } from '../models/volunteers.js';

const router = express.Router();

// Public routes (no login required)
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected routes (require login)
router.get('/', requireLogin, showHomePage);
router.get('/organizations', requireLogin, showOrganizationsPage);
router.get('/organization/:id', requireLogin, showOrganizationDetailsPage);
router.get('/projects', requireLogin, showProjectsPage);
router.get('/project/:id', requireLogin, showProjectDetailsPage);
router.get('/categories', requireLogin, showCategoriesPage);
router.get('/category/:id', requireLogin, showCategoryDetailsPage);

// Volunteer routes (protected by login)
router.post('/project/:id/volunteer', requireLogin, addVolunteerHandler);
router.post('/project/:id/remove-volunteer', requireLogin, removeVolunteerHandler);

// Admin only routes
router.get('/new-category', requireAdmin, showCreateCategoryForm);
router.post('/new-category', requireAdmin, createCategoryHandler);
router.get('/edit-category/:id', requireAdmin, showEditCategoryForm);
router.post('/edit-category/:id', requireAdmin, updateCategoryHandler);
router.get('/assign-categories/:id', requireAdmin, showAssignCategoriesPage);
router.post('/assign-categories/:id', requireAdmin, assignCategoriesHandler);
router.get('/users', requireAdmin, getAllUsers);

// Dashboard route (requires login)
router.get('/dashboard', requireLogin, showDashboard);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;