import db from './db.js';

const getAllOrganizations = async () => {
    try {
        const query = `
            SELECT organization_id, name, description, contact_email, logo_filename
            FROM organizations
            ORDER BY name;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllOrganizations:', error);
        throw error;
    }
};

const getOrganizationDetails = async (organizationId) => {
    try {
        const query = `
            SELECT
                organization_id,
                name,
                description,
                contact_email,
                logo_filename
            FROM organizations
            WHERE organization_id = $1;
        `;
        const query_params = [organizationId];
        const result = await db.query(query, query_params);
        // Return the first row of the result set, or null if no rows are found
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in getOrganizationDetails:', error);
        throw error;
    }
};

export { getAllOrganizations, getOrganizationDetails };