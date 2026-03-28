import db from './db.js';

const getAllCategories = async () => {
    try {
        const query = `
            SELECT id, name, description
            FROM categories 
            ORDER BY name
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        return [];
    }
};

// NEW: Get single category by ID
const getCategoryById = async (categoryId) => {
    try {
        const query = `
            SELECT id, name, description
            FROM categories
            WHERE id = $1
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        throw error;
    }
};

// NEW: Get all projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT 
                p.project_id,
                p.organization_id,
                p.title,
                p.description,
                p.location,
                p.date,
                o.name as organization_name
            FROM projects p
            JOIN organizations o ON p.organization_id = o.organization_id
            JOIN project_categories pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.date ASC
        `;
        const result = await db.query(query, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getProjectsByCategoryId:', error);
        throw error;
    }
};

// NEW: Get all categories for a given project
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT 
                c.id,
                c.name
            FROM categories c
            JOIN project_categories pc ON c.id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.name
        `;
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getCategoriesByProjectId:', error);
        throw error;
    }
};

export { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId };