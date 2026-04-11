// src/models/projects.js
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
        const result = await db.query(query, [organizationId]);
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
        const result = await db.query(query, [number_of_projects]);
        
        if (result.rows.length === 0) {
            const allProjectsQuery = `
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
                ORDER BY p.date DESC
                LIMIT $1;
            `;
            const allResult = await db.query(allProjectsQuery, [number_of_projects]);
            return allResult.rows;
        }
        
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
        const result = await db.query(query, [projectId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in getProjectDetails:', error);
        throw error;
    }
};

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

// Get all organizations for dropdown
const getAllOrganizationsForSelect = async () => {
    try {
        const query = `SELECT organization_id, name FROM organizations ORDER BY name`;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllOrganizationsForSelect:', error);
        throw error;
    }
};

// CREATE: Insert new project
const createProject = async (organization_id, title, description, location, date) => {
    try {
        const query = `
            INSERT INTO projects (organization_id, title, description, location, date) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING project_id, organization_id, title, description, location, date
        `;
        const result = await db.query(query, [organization_id, title.trim(), description.trim(), location.trim(), date]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in createProject:', error);
        throw error;
    }
};

// UPDATE: Update existing project
const updateProject = async (projectId, organization_id, title, description, location, date) => {
    try {
        const query = `
            UPDATE projects 
            SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
            WHERE project_id = $6 
            RETURNING project_id, organization_id, title, description, location, date
        `;
        const result = await db.query(query, [organization_id, title.trim(), description.trim(), location.trim(), date, projectId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in updateProject:', error);
        throw error;
    }
};

// SINGLE EXPORT - all functions at once
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesForProject,
    getAllOrganizationsForSelect,
    createProject,
    updateProject
};