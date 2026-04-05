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

// NEW: Categories routes - CREATE
router.get('/new-category', showCreateCategoryForm);
router.post('/new-category', createCategoryHandler);

// NEW: Categories routes - UPDATE
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', updateCategoryHandler);

// NEW: Category assignment routes (Rubric Criterion #3)
router.get('/assign-categories/:id', showAssignCategoriesPage);
router.post('/assign-categories/:id', assignCategoriesHandler);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;