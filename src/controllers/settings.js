// src/controllers/settings.js
import db from '../models/db.js';
import bcrypt from 'bcrypt';

// Display Account Settings page
const showAccountSettingsPage = async (req, res) => {
    try {
        const user = req.session.user;
        const message = req.query.message || null;
        const error = req.query.error || null;
        
        res.render('account-settings', {
            title: 'Account Settings',
            user: user,
            name: user.name,
            email: user.email,
            message: message,
            error: error,
            isLoggedIn: true
        });
    } catch (error) {
        console.error('Error in showAccountSettingsPage:', error);
        res.redirect('/dashboard?error=Failed to load settings');
    }
};

// Update Profile (Name and Email)
const updateProfileHandler = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.session.user.user_id;
    const errors = [];
    
    // Validation
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (name.length > 100) {
        errors.push('Name must be 100 characters or less');
    }
    
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!email.includes('@') || !email.includes('.')) {
        errors.push('Please enter a valid email address');
    } else if (email.length > 100) {
        errors.push('Email must be 100 characters or less');
    }
    
    if (errors.length > 0) {
        return res.redirect(`/account-settings?error=${encodeURIComponent(errors.join(', '))}`);
    }
    
    try {
        // Check if email already exists for another user
        const checkQuery = await db.query(
            'SELECT user_id FROM users WHERE email = $1 AND user_id != $2',
            [email.trim(), userId]
        );
        
        if (checkQuery.rows.length > 0) {
            return res.redirect('/account-settings?error=Email already exists for another user');
        }
        
        // Update user profile
        await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE user_id = $3',
            [name.trim(), email.trim(), userId]
        );
        
        // Update session
        req.session.user.name = name.trim();
        req.session.user.email = email.trim();
        
        res.redirect('/account-settings?message=Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.redirect('/account-settings?error=Failed to update profile');
    }
};

// Update Password
const updatePasswordHandler = async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.session.user.user_id;
    const errors = [];
    
    // Validation
    if (!current_password) {
        errors.push('Current password is required');
    }
    
    if (!new_password) {
        errors.push('New password is required');
    } else if (new_password.length < 6) {
        errors.push('New password must be at least 6 characters');
    }
    
    if (new_password !== confirm_password) {
        errors.push('New passwords do not match');
    }
    
    if (errors.length > 0) {
        return res.redirect(`/account-settings?error=${encodeURIComponent(errors.join(', '))}`);
    }
    
    try {
        // Get current user with password hash
        const userResult = await db.query(
            'SELECT password_hash FROM users WHERE user_id = $1',
            [userId]
        );
        
        const currentHash = userResult.rows[0].password_hash;
        
        // Verify current password
        const isMatch = await bcrypt.compare(current_password, currentHash);
        
        if (!isMatch) {
            return res.redirect('/account-settings?error=Current password is incorrect');
        }
        
        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(new_password, saltRounds);
        
        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1 WHERE user_id = $2',
            [newPasswordHash, userId]
        );
        
        res.redirect('/account-settings?message=Password updated successfully!');
    } catch (error) {
        console.error('Error updating password:', error);
        res.redirect('/account-settings?error=Failed to update password');
    }
};

export { showAccountSettingsPage, updateProfileHandler, updatePasswordHandler };