// Track user activity and handle auto-logout after 10 minutes of inactivity

let activityInterval = null;

function updateActivity() {
    localStorage.setItem('last_activity', Date.now().toString());
}
export function startActivityTracking() {
    // Update activity timestamp every time user interacts

    // Track various user activities
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    // Update activity timestamp every 30 seconds while page is open
    activityInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            updateActivity();
        }
    }, 30000); // 30 seconds

    // Initial update
    updateActivity();
}

export function stopActivityTracking() {
    if (activityInterval) {
        clearInterval(activityInterval);
        activityInterval = null;
    }

    window.removeEventListener('mousedown', updateActivity);
    window.removeEventListener('keydown', updateActivity);
    window.removeEventListener('scroll', updateActivity);
    window.removeEventListener('touchstart', updateActivity);
}

// Check if session expired (10 minutes of inactivity)
export function checkSessionExpiry() {
    const lastActivity = localStorage.getItem('last_activity');

    if (!lastActivity) return false;

    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000; // 10 minutes

    return (now - parseInt(lastActivity)) > tenMinutes;
}