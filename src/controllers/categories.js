// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error in showCategoriesPage:', error);
        const err = new Error('Failed to load categories');
        err.status = 500;
        next(err);
    }
};

// NEW: Controller function for category details page
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);
        
        // Check if category exists
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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };