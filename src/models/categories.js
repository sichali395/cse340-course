// src/models/categories.js
import db from './db.js';

// Get all categories
const getAllCategories = async () => {
    try {
        const query = `
            SELECT id, name 
            FROM categories 
            ORDER BY name
        `;
        const result = await db.query(query);
        console.log(`Found ${result.rows.length} categories`);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        throw error;
    }
};

// Get category by ID
const getCategoryById = async (categoryId) => {
    try {
        const query = `
            SELECT id, name 
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

// Get projects by category ID
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT 
                p.project_id,
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

// CREATE: Insert new category
const createCategory = async (name) => {
    try {
        const query = `
            INSERT INTO categories (name) 
            VALUES ($1) 
            RETURNING id, name
        `;
        const result = await db.query(query, [name.trim()]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in createCategory:', error);
        throw error;
    }
};

// UPDATE: Update existing category
const updateCategory = async (categoryId, name) => {
    try {
        const query = `
            UPDATE categories 
            SET name = $1 
            WHERE id = $2 
            RETURNING id, name
        `;
        const result = await db.query(query, [name.trim(), categoryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in updateCategory:', error);
        throw error;
    }
};

// Get all categories with selection status for a project
const getAllCategoriesWithSelection = async (projectId) => {
    try {
        const query = `
            SELECT 
                c.id, 
                c.name,
                CASE WHEN pc.project_id IS NOT NULL THEN true ELSE false END as selected
            FROM categories c
            LEFT JOIN project_categories pc ON c.id = pc.category_id AND pc.project_id = $1
            ORDER BY c.name
        `;
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCategoriesWithSelection:', error);
        throw error;
    }
};

// Update category assignments for a project
const updateProjectCategories = async (projectId, categoryIds) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        
        // Remove all existing assignments
        await client.query('DELETE FROM project_categories WHERE project_id = $1', [projectId]);
        
        // Add new assignments
        if (categoryIds && categoryIds.length > 0) {
            for (const categoryId of categoryIds) {
                await client.query(
                    'INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)',
                    [projectId, categoryId]
                );
            }
        }
        
        await client.query('COMMIT');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateProjectCategories:', error);
        throw error;
    } finally {
        client.release();
    }
};

export { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    getAllCategoriesWithSelection,
    updateProjectCategories
};