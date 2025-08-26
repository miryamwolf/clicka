import fs from 'node:fs';

/**
 * Logs user activity to a file.
 * @param {string} userId - The ID of the user.
 * @param {string} activity - The activity.
 */
export function logUserActivity(userId: string, activity: string) {
    const logEntry = `${new Date().toISOString()} - User: ${userId} - Activity: ${activity}\n`;

    fs.appendFile('user_activity.log', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
}

