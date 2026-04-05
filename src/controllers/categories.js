// src/controllers/categories.js
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    getAllCategoriesWithSelection,
    updateProjectCategories
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Display all categories page
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const message = req.query.message || null;
        const title = 'Service Categories';
        
        console.log(`Rendering categories page with ${categories.length} categories`);
        
        res.render('categories', { title, categories, message });
    } catch (error) {
        console.error('Error in showCategoriesPage:', error);
        const err = new Error('Failed to load categories');
        err.status = 500;
        next(err);
    }
};

// Display category details page
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);
        
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        
        const title = `${category.name} Projects`;
        res.render('category', { title, category, projects });
    } catch (error) {
        console.error('Error in showCategoryDetailsPage:', error);
        const err = new Error('Failed to load category details');
        err.status = 500;
        next(err);
    }
};

// Display create category form
const showCreateCategoryForm = (req, res) => {
    const title = 'Create New Category';
    res.render('new-category', { 
        title, 
        category: null, 
        errors: null,
        formData: {}
    });
};

// Process create category
const createCategoryHandler = async (req, res, next) => {
    const { name } = req.body;
    const errors = [];
    
    // Server-side validation (min 3 chars, max 100, required)
    if (!name || name.trim() === '') {
        errors.push('Category name is required');
    } else if (name.length > 100) {
        errors.push('Category name must be 100 characters or less');
    } else if (name.length < 3) {
        errors.push('Category name must be at least 3 characters');
    }
    
    if (errors.length > 0) {
        return res.render('new-category', {
            title: 'Create New Category',
            category: null,
            errors: errors,
            formData: { name }
        });
    }
    
    try {
        await createCategory(name.trim());
        res.redirect('/categories?message=Category created successfully!');
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            errors.push('A category with this name already exists');
            return res.render('new-category', {
                title: 'Create New Category',
                category: null,
                errors: errors,
                formData: { name }
            });
        }
        console.error('Error in createCategoryHandler:', error);
        const err = new Error('Failed to create category');
        err.status = 500;
        next(err);
    }
};

// Display edit category form
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        
        const title = `Edit Category: ${category.name}`;
        res.render('edit-category', { 
            title, 
            category, 
            errors: null,
            formData: { name: category.name }
        });
    } catch (error) {
        console.error('Error in showEditCategoryForm:', error);
        const err = new Error('Failed to load edit form');
        err.status = 500;
        next(err);
    }
};

// Process edit category
const updateCategoryHandler = async (req, res, next) => {
    const { name } = req.body;
    const categoryId = req.params.id;
    const errors = [];
    
    // Server-side validation
    if (!name || name.trim() === '') {
        errors.push('Category name is required');
    } else if (name.length > 100) {
        errors.push('Category name must be 100 characters or less');
    } else if (name.length < 3) {
        errors.push('Category name must be at least 3 characters');
    }
    
    if (errors.length > 0) {
        try {
            const category = await getCategoryById(categoryId);
            return res.render('edit-category', {
                title: 'Edit Category',
                category,
                errors: errors,
                formData: { name }
            });
        } catch (error) {
            return next(error);
        }
    }
    
    try {
        const updated = await updateCategory(categoryId, name.trim());
        if (!updated) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.redirect('/categories?message=Category updated successfully!');
    } catch (error) {
        if (error.code === '23505') {
            errors.push('A category with this name already exists');
            const category = await getCategoryById(categoryId);
            return res.render('edit-category', {
                title: 'Edit Category',
                category,
                errors: errors,
                formData: { name }
            });
        }
        console.error('Error in updateCategoryHandler:', error);
        const err = new Error('Failed to update category');
        err.status = 500;
        next(err);
    }
};

// Display assign categories page for a project
const showAssignCategoriesPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const categories = await getAllCategoriesWithSelection(projectId);
        const title = `Assign Categories - ${project.title}`;
        
        res.render('assign-categories', {
            title,
            project,
            categories,
            message: req.query.message,
            errors: null
        });
    } catch (error) {
        console.error('Error in showAssignCategoriesPage:', error);
        const err = new Error('Failed to load assign categories page');
        err.status = 500;
        next(err);
    }
};

// Process category assignment for a project
const assignCategoriesHandler = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        let { categoryIds } = req.body;
        
        // Convert to array if single value or undefined
        if (!categoryIds) {
            categoryIds = [];
        } else if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }
        
        await updateProjectCategories(projectId, categoryIds);
        
        res.redirect(`/project/${projectId}?message=Categories updated successfully!`);
    } catch (error) {
        console.error('Error in assignCategoriesHandler:', error);
        const err = new Error('Failed to assign categories');
        err.status = 500;
        next(err);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showCreateCategoryForm,
    createCategoryHandler,
    showEditCategoryForm,
    updateCategoryHandler,
    showAssignCategoriesPage,
    assignCategoriesHandler
};