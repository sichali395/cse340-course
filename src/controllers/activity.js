// src/controllers/activity.js
import db from '../models/db.js';
import { getUserVolunteerProjects } from '../models/volunteers.js';

// Display My Activity page
const showMyActivityPage = async (req, res) => {
    try {
        const user = req.session.user;
        const message = req.query.message || null;
        
        // Get user's volunteer projects
        const volunteerProjects = await getUserVolunteerProjects(user.user_id);
        
        // Get user's project history (all projects they've volunteered for)
        const historyQuery = `
            SELECT p.project_id, p.title, p.description, p.location, p.date, o.name as organization_name,
                   upv.volunteered_at
            FROM user_project_volunteers upv
            JOIN projects p ON upv.project_id = p.project_id
            JOIN organizations o ON p.organization_id = o.organization_id
            WHERE upv.user_id = $1
            ORDER BY upv.volunteered_at DESC
        `;
        const historyResult = await db.query(historyQuery, [user.user_id]);
        
        res.render('my-activity', {
            title: 'My Activity',
            user: user,
            volunteerProjects: volunteerProjects,
            historyProjects: historyResult.rows,
            message: message,
            isLoggedIn: true
        });
    } catch (error) {
        console.error('Error in showMyActivityPage:', error);
        res.redirect('/dashboard?error=Failed to load activity');
    }
};

export { showMyActivityPage };