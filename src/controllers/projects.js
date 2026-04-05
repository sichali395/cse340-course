// src/controllers/projects.js
import { getUpcomingProjects, getProjectDetails, getCategoriesForProject } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const message = req.query.message || null;  // ← Get message from query params
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects, message });  // ← Always pass message
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        const err = new Error('Failed to load projects');
        err.status = 500;
        next(err);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesForProject(projectId);
        const message = req.query.message || null;
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const title = project.title;
        res.render('project', { title, project, categories, message });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        const err = new Error('Failed to load project details');
        err.status = 500;
        next(err);
    }
};

export { showProjectsPage, showProjectDetailsPage };