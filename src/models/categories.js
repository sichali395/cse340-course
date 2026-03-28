import db from './db.js';

const getAllCategories = async () => {
    try {
        // Check if categories table exists and has description column
        const query = `
            SELECT id, name, description
            FROM categories 
            ORDER BY name
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        // Return empty array if table doesn't exist yet
        return [];
    }
};

export { getAllCategories };