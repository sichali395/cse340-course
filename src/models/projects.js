import db from './db.js';

const getAllProjects = async () => {
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
            ORDER BY p.date ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllProjects:', error);
        throw error;
    }
};

const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const query = `
            SELECT
                project_id,
                organization_id,
                title,
                description,
                location,
                date
            FROM projects
            WHERE organization_id = $1
            ORDER BY date;
        `;
        const query_params = [organizationId];
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (error) {
        console.error('Error in getProjectsByOrganizationId:', error);
        throw error;
    }
};

const getUpcomingProjects = async (number_of_projects) => {
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
            WHERE p.date >= CURRENT_DATE
            ORDER BY p.date ASC
            LIMIT $1;
        `;
        const query_params = [number_of_projects];
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (error) {
        console.error('Error in getUpcomingProjects:', error);
        throw error;
    }
};

const getProjectDetails = async (projectId) => {
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
            WHERE p.project_id = $1;
        `;
        const query_params = [projectId];
        const result = await db.query(query, query_params);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in getProjectDetails:', error);
        throw error;
    }
};

// NEW: Get categories for a specific project
const getCategoriesForProject = async (projectId) => {
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
        console.error('Error in getCategoriesForProject:', error);
        throw error;
    }
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getCategoriesForProject };