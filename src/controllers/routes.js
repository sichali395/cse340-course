// src/controllers/routes.js
import express from 'express';
import { showMyActivityPage } from './activity.js';
import { showAccountSettingsPage, updateProfileHandler, updatePasswordHandler } from './settings.js';
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

const router = express.Router();

// ========== PUBLIC ROUTES (NO LOGIN REQUIRED - anyone can view) ==========
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// ========== AUTHENTICATION ROUTES ==========
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// ========== PROTECTED ROUTES (require login) ==========
router.get('/dashboard', requireLogin, showDashboard);

// My Activity route
router.get('/my-projects', requireLogin, showMyActivityPage);

// Account Settings routes
router.get('/account-settings', requireLogin, showAccountSettingsPage);
router.post('/account-settings/profile', requireLogin, updateProfileHandler);
router.post('/account-settings/password', requireLogin, updatePasswordHandler);

// ========== VOLUNTEER ROUTES (require login) ==========
router.post('/project/:id/volunteer', requireLogin, addVolunteerHandler);
router.post('/project/:id/remove-volunteer', requireLogin, removeVolunteerHandler);

// ========== ADMIN ONLY ROUTES (require admin role) ==========
router.get('/new-category', requireAdmin, showCreateCategoryForm);
router.post('/new-category', requireAdmin, createCategoryHandler);
router.get('/edit-category/:id', requireAdmin, showEditCategoryForm);
router.post('/edit-category/:id', requireAdmin, updateCategoryHandler);
router.get('/assign-categories/:id', requireAdmin, showAssignCategoriesPage);
router.post('/assign-categories/:id', requireAdmin, assignCategoriesHandler);
router.get('/users', requireAdmin, getAllUsers);

// ========== ERROR ROUTES ==========
router.get('/test-error', testErrorPage);

export default router;