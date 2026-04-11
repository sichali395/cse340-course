// src/controllers/projects.js
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesForProject,
    createProject,
    updateProject,
    getAllOrganizationsForSelect
} from '../models/projects.js';
import { addVolunteer, removeVolunteer, isUserVolunteering } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Display all projects page
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const message = req.query.message || null;
        res.render('projects', { 
            title: 'Upcoming Service Projects', 
            projects, 
            message
        });
    } catch (error) {
        console.error('Error in showProjectsPage:', error);
        const err = new Error('Failed to load projects');
        err.status = 500;
        next(err);
    }
};

// Display project details page
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesForProject(projectId);
        const message = req.query.message || null;
        
        let isVolunteering = false;
        if (req.session && req.session.user) {
            isVolunteering = await isUserVolunteering(req.session.user.user_id, projectId);
        }
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('project', { 
            title: project.title,
            project, 
            categories, 
            message,
            isVolunteering: isVolunteering
        });
    } catch (error) {
        console.error('Error in showProjectDetailsPage:', error);
        const err = new Error('Failed to load project details');
        err.status = 500;
        next(err);
    }
};

// Display create project form
const showCreateProjectForm = async (req, res, next) => {
    console.log('Showing create project form');
    try {
        const organizations = await getAllOrganizationsForSelect();
        res.render('new-project', { 
            title: 'Create New Project',
            organizations: organizations,
            errors: null,
            formData: {}
        });
    } catch (error) {
        console.error('Error in showCreateProjectForm:', error);
        const err = new Error('Failed to load create project form');
        err.status = 500;
        next(err);
    }
};

// Process create project
const createProjectHandler = async (req, res, next) => {
    const { organization_id, title, description, location, date } = req.body;
    const errors = [];
    
    if (!organization_id) {
        errors.push('Please select an organization');
    }
    
    if (!title || title.trim() === '') {
        errors.push('Project title is required');
    } else if (title.length > 200) {
        errors.push('Project title must be 200 characters or less');
    }
    
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }
    
    if (!location || location.trim() === '') {
        errors.push('Location is required');
    } else if (location.length > 255) {
        errors.push('Location must be 255 characters or less');
    }
    
    if (!date) {
        errors.push('Project date is required');
    }
    
    if (errors.length > 0) {
        const organizations = await getAllOrganizationsForSelect();
        return res.render('new-project', {
            title: 'Create New Project',
            organizations: organizations,
            errors: errors,
            formData: { organization_id, title, description, location, date }
        });
    }
    
    try {
        await createProject(organization_id, title.trim(), description.trim(), location.trim(), date);
        res.redirect('/projects?message=Project+created+successfully!');
    } catch (error) {
        console.error('Error in createProjectHandler:', error);
        const err = new Error('Failed to create project');
        err.status = 500;
        next(err);
    }
};

// Display edit project form
const showEditProjectForm = async (req, res, next) => {
    console.log('Showing edit project form for ID:', req.params.id);
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizationsForSelect();
        
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('edit-project', { 
            title: `Edit Project: ${project.title}`,
            category: project,
            organizations: organizations,
            errors: null,
            formData: {
                organization_id: project.organization_id,
                title: project.title,
                description: project.description,
                location: project.location,
                date: project.date
            }
        });
    } catch (error) {
        console.error('Error in showEditProjectForm:', error);
        const err = new Error('Failed to load edit project form');
        err.status = 500;
        next(err);
    }
};

// Process edit project
const updateProjectHandler = async (req, res, next) => {
    const { organization_id, title, description, location, date } = req.body;
    const projectId = req.params.id;
    const errors = [];
    
    if (!organization_id) {
        errors.push('Please select an organization');
    }
    
    if (!title || title.trim() === '') {
        errors.push('Project title is required');
    } else if (title.length > 200) {
        errors.push('Project title must be 200 characters or less');
    }
    
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }
    
    if (!location || location.trim() === '') {
        errors.push('Location is required');
    } else if (location.length > 255) {
        errors.push('Location must be 255 characters or less');
    }
    
    if (!date) {
        errors.push('Project date is required');
    }
    
    if (errors.length > 0) {
        const organizations = await getAllOrganizationsForSelect();
        const project = await getProjectDetails(projectId);
        return res.render('edit-project', {
            title: 'Edit Project',
            category: project,
            organizations: organizations,
            errors: errors,
            formData: { organization_id, title, description, location, date }
        });
    }
    
    try {
        await updateProject(projectId, organization_id, title.trim(), description.trim(), location.trim(), date);
        res.redirect(`/project/${projectId}?message=Project+updated+successfully!`);
    } catch (error) {
        console.error('Error in updateProjectHandler:', error);
        const err = new Error('Failed to update project');
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

export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showCreateProjectForm,
    createProjectHandler,
    showEditProjectForm,
    updateProjectHandler,
    addVolunteerHandler, 
    removeVolunteerHandler
};