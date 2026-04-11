import db from './db.js';

// Get all organizations
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

// Get organization by ID
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
        const result = await db.query(query, [organizationId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in getOrganizationDetails:', error);
        throw error;
    }
};

// CREATE: Insert new organization
const createOrganization = async (name, description, contact_email, logo_filename) => {
    try {
        const query = `
            INSERT INTO organizations (name, description, contact_email, logo_filename) 
            VALUES ($1, $2, $3, $4) 
            RETURNING organization_id, name, description, contact_email, logo_filename
        `;
        const result = await db.query(query, [name.trim(), description.trim(), contact_email.trim(), logo_filename || 'default-logo.png']);
        return result.rows[0];
    } catch (error) {
        console.error('Error in createOrganization:', error);
        throw error;
    }
};

// UPDATE: Update existing organization
const updateOrganization = async (organizationId, name, description, contact_email, logo_filename) => {
    try {
        const query = `
            UPDATE organizations 
            SET name = $1, description = $2, contact_email = $3, logo_filename = $4
            WHERE organization_id = $5 
            RETURNING organization_id, name, description, contact_email, logo_filename
        `;
        const result = await db.query(query, [name.trim(), description.trim(), contact_email.trim(), logo_filename || 'default-logo.png', organizationId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error in updateOrganization:', error);
        throw error;
    }
};

// SINGLE EXPORT - all functions at once
export { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization, 
    updateOrganization 
};