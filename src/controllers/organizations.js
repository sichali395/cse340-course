// src/controllers/organizations.js
import { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization, 
    updateOrganization 
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Display all organizations page
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const message = req.query.message || null;
        res.render('organizations', { 
            title: 'Our Partner Organizations', 
            organizations, 
            message
        });
    } catch (error) {
        console.error('Error in showOrganizationsPage:', error);
        const err = new Error('Failed to load organizations');
        err.status = 500;
        next(err);
    }
};

// Display organization details page
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        
        if (!organizationDetails) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('organization', { 
            title: organizationDetails.name, 
            organizationDetails, 
            projects
        });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage:', error);
        const err = new Error('Failed to load organization details');
        err.status = 500;
        next(err);
    }
};

// Display create organization form
const showCreateOrganizationForm = (req, res) => {
    console.log('Showing create organization form');
    res.render('new-organization', { 
        title: 'Create New Organization',
        errors: null,
        formData: {}
    });
};

// Process create organization
const createOrganizationHandler = async (req, res, next) => {
    const { name, description, contact_email, logo_filename } = req.body;
    const errors = [];
    
    if (!name || name.trim() === '') {
        errors.push('Organization name is required');
    } else if (name.length > 150) {
        errors.push('Organization name must be 150 characters or less');
    }
    
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }
    
    if (!contact_email || contact_email.trim() === '') {
        errors.push('Contact email is required');
    } else if (!contact_email.includes('@') || !contact_email.includes('.')) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        return res.render('new-organization', {
            title: 'Create New Organization',
            errors: errors,
            formData: { name, description, contact_email, logo_filename }
        });
    }
    
    try {
        await createOrganization(name.trim(), description.trim(), contact_email.trim(), logo_filename || 'default-logo.png');
        res.redirect('/organizations?message=Organization+created+successfully!');
    } catch (error) {
        console.error('Error in createOrganizationHandler:', error);
        const err = new Error('Failed to create organization');
        err.status = 500;
        next(err);
    }
};

// Display edit organization form
const showEditOrganizationForm = async (req, res, next) => {
    console.log('Showing edit organization form for ID:', req.params.id);
    try {
        const organizationId = req.params.id;
        const organization = await getOrganizationDetails(organizationId);
        
        if (!organization) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('edit-organization', { 
            title: `Edit Organization: ${organization.name}`,
            category: organization,
            errors: null,
            formData: {
                name: organization.name,
                description: organization.description,
                contact_email: organization.contact_email,
                logo_filename: organization.logo_filename
            }
        });
    } catch (error) {
        console.error('Error in showEditOrganizationForm:', error);
        const err = new Error('Failed to load edit form');
        err.status = 500;
        next(err);
    }
};

// Process edit organization
const updateOrganizationHandler = async (req, res, next) => {
    const { name, description, contact_email, logo_filename } = req.body;
    const organizationId = req.params.id;
    const errors = [];
    
    if (!name || name.trim() === '') {
        errors.push('Organization name is required');
    } else if (name.length > 150) {
        errors.push('Organization name must be 150 characters or less');
    }
    
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }
    
    if (!contact_email || contact_email.trim() === '') {
        errors.push('Contact email is required');
    } else if (!contact_email.includes('@') || !contact_email.includes('.')) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        const organization = await getOrganizationDetails(organizationId);
        return res.render('edit-organization', {
            title: 'Edit Organization',
            category: organization,
            errors: errors,
            formData: { name, description, contact_email, logo_filename }
        });
    }
    
    try {
        await updateOrganization(organizationId, name.trim(), description.trim(), contact_email.trim(), logo_filename || 'default-logo.png');
        res.redirect(`/organization/${organizationId}?message=Organization+updated+successfully!`);
    } catch (error) {
        console.error('Error in updateOrganizationHandler:', error);
        const err = new Error('Failed to update organization');
        err.status = 500;
        next(err);
    }
};

export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showCreateOrganizationForm,
    createOrganizationHandler,
    showEditOrganizationForm,
    updateOrganizationHandler
};