// src/controllers/projects.js
import { getUpcomingProjects, getProjectDetails, getCategoriesForProject } from '../models/projects.js';
import { addVolunteer, removeVolunteer, isUserVolunteering } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const message = req.query.message || null;
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects, message });
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
        
        // Check if user is logged in and volunteering
        let isVolunteering = false;
        if (req.session && req.session.user) {
            isVolunteering = await isUserVolunteering(req.session.user.user_id, projectId);
        }
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const title = project.title;
        res.render('project', { 
            title, 
            project, 
            categories, 
            message,
            isVolunteering: isVolunteering,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        const err = new Error('Failed to load project details');
        err.status = 500;
        next(err);
    }
};

// Add volunteer handler
const addVolunteerHandler = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;
        
        await addVolunteer(userId, projectId);
        res.redirect(`/project/${projectId}?message=You+are+now+volunteering+for+this+project!`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.redirect(`/project/${projectId}?message=Unable+to+volunteer.+Please+try+again.`);
    }
};

// Remove volunteer handler
const removeVolunteerHandler = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;
        
        await removeVolunteer(userId, projectId);
        res.redirect(`/project/${projectId}?message=You+have+been+removed+from+this+project.`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.redirect(`/project/${projectId}?message=Unable+to+remove+volunteering.+Please+try+again.`);
    }
};

export { showProjectsPage, showProjectDetailsPage, addVolunteerHandler, removeVolunteerHandler };