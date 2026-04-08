import db from './db.js';

// Add a volunteer to a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO user_project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

// Remove a volunteer from a project
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM user_project_volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

// Get all projects a user has volunteered for
const getUserVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, o.name as organization_name
        FROM user_project_volunteers upv
        JOIN projects p ON upv.project_id = p.project_id
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE upv.user_id = $1
        ORDER BY p.date DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// Check if a user is already volunteering for a project
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT * FROM user_project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { addVolunteer, removeVolunteer, getUserVolunteerProjects, isUserVolunteering };