// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error in showOrganizationsPage:', error);
        const err = new Error('Failed to load organizations');
        err.status = 500;
        throw err;
    }
};

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = 'Organization Details';
        
        // Check if organization exists
        if (!organizationDetails) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('organization', { title, organizationDetails, projects });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage:', error);
        const err = new Error('Failed to load organization details');
        err.status = 500;
        next(err);
    }
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };