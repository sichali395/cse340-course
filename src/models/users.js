import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Creates a new user in the database with the "user" role
 * @param {string} name - User's display name
 * @param {string} email - User's email address (used as username)
 * @param {string} passwordHash - Hashed password
 * @returns {Promise<object>} - The created user object
 */
async function createUser(name, email, passwordHash) {
    // First, get the role_id for the "user" role
    const roleQuery = await db.query(
        'SELECT role_id FROM roles WHERE role_name = $1',
        ['user']
    );
    
    if (roleQuery.rows.length === 0) {
        throw new Error('Default "user" role not found in database');
    }
    
    const userRoleId = roleQuery.rows[0].role_id;
    
    // Insert the new user with the "user" role
    const insertQuery = await db.query(
        `INSERT INTO users (name, email, password_hash, role_id, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
         RETURNING user_id, name, email, role_id, created_at`,
        [name, email, passwordHash, userRoleId]
    );
    
    return insertQuery.rows[0];
}

/**
 * Finds a user by their email address
 * @param {string} email - User's email address
 * @returns {Promise<object|null>} - User object if found, null if not found
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1
    `;
    const query_params = [email];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

/**
 * Verifies if a plain text password matches a hashed password
 * @param {string} password - Plain text password from user input
 * @param {string} passwordHash - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false if not
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email and password
 * @param {string} email - User's email address
 * @param {string} password - Plain text password
 * @returns {Promise<object|null>} - User object without password_hash if authenticated, null if not
 */
const authenticateUser = async (email, password) => {
    // Use findUserByEmail to get the user
    const user = await findUserByEmail(email);
    
    // If no user is found, return null
    if (!user) {
        return null;
    }
    
    // Use verifyPassword to check if the password is correct
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    // If the password is correct, remove password_hash and return user object
    if (isPasswordValid) {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    
    // If password is incorrect, return null
    return null;
};

// Export the functions for use in other parts of the application
export { createUser, authenticateUser };