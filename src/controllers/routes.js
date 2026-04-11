// src/controllers/routes.js
import express from 'express';
import { showHomePage } from './index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showCreateOrganizationForm,
    createOrganizationHandler,
    showEditOrganizationForm,
    updateOrganizationHandler
} from './organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showCreateProjectForm,
    createProjectHandler,
    showEditProjectForm,
    updateProjectHandler,
    addVolunteerHandler, 
    removeVolunteerHandler
} from './projects.js';
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

// ========== PUBLIC ROUTES ==========
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

// ========== PROTECTED ROUTES ==========
router.get('/dashboard', requireLogin, showDashboard);

// ========== VOLUNTEER ROUTES ==========
router.post('/project/:id/volunteer', requireLogin, addVolunteerHandler);
router.post('/project/:id/remove-volunteer', requireLogin, removeVolunteerHandler);

// ========== ADMIN ONLY ROUTES - ORGANIZATIONS ==========
console.log('Loading organization admin routes...');
router.get('/new-organization', requireAdmin, showCreateOrganizationForm);
router.post('/new-organization', requireAdmin, createOrganizationHandler);
router.get('/edit-organization/:id', requireAdmin, showEditOrganizationForm);
router.post('/edit-organization/:id', requireAdmin, updateOrganizationHandler);
console.log('Organization admin routes loaded');

// ========== ADMIN ONLY ROUTES - PROJECTS ==========
console.log('Loading project admin routes...');
router.get('/new-project', requireAdmin, showCreateProjectForm);
router.post('/new-project', requireAdmin, createProjectHandler);
router.get('/edit-project/:id', requireAdmin, showEditProjectForm);
router.post('/edit-project/:id', requireAdmin, updateProjectHandler);
console.log('Project admin routes loaded');

// ========== ADMIN ONLY ROUTES - CATEGORIES ==========
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