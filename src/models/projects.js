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

export { getAllProjects, getProjectsByOrganizationId };