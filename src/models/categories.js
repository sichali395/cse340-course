import db from './db.js';  // Note the .js extension

async function getCategories() {
    try {
        const result = await db.query(
            'SELECT id, name FROM categories ORDER BY name'
        );
        return result.rows;  // Important: return result.rows, not just result
    } catch (error) {
        console.error('Error in getCategories:', error);
        throw error;
    }
}

export {
    getCategories
};