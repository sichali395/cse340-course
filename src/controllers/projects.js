// Import any needed model functions
import { getUpcomingProjects, getProjectDetails, getCategoriesForProject } from '../models/projects.js';

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

// Updated controller function for project details page to include categories
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesForProject(projectId);
        
        // Check if project exists
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const title = project.title;
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        const err = new Error('Failed to load project details');
        err.status = 500;
        next(err);
    }
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };