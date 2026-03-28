// Import any needed model functions (none are needed for the home page, so this is empty)

// Define any controller functions
const showHomePage = async (req, res) => {
    try {
        const title = 'Home';
        console.log('Rendering home page'); // Add this for debugging
        res.render('home', { title });
    } catch (error) {
        console.error('Error in showHomePage:', error);
        const err = new Error('Failed to load home page');
        err.status = 500;
        throw err;
    }
};

// Export any controller functions
export { showHomePage };