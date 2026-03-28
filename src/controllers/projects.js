// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        const err = new Error('Failed to load projects');
        err.status = 500;
        throw err;
    }
};

// Export any controller functions
export { showProjectsPage };