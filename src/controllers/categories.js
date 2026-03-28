// Import any needed model functions
import { getAllCategories } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error in showCategoriesPage:', error);
        const err = new Error('Failed to load categories');
        err.status = 500;
        throw err;
    }
};

// Export any controller functions
export { showCategoriesPage };