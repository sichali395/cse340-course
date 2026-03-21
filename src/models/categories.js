import db from './db.js';  // Note the .js extension

// Using arrow notation as required by Criteria 3
const getCategories = async () => {
    try {
        const result = await db.query(
            'SELECT id, name FROM categories ORDER BY name'
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getCategories:', error);
        throw error;
    }
}

export {
    getCategories
};