// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Constant for number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        const err = new Error('Failed to load projects');
        err.status = 500;
        next(err);
    }
};

// New controller function for project details page
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        
        // Check if project exists
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const title = project.title;
        res.render('project', { title, project });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        const err = new Error('Failed to load project details');
        err.status = 500;
        next(err);
    }
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };