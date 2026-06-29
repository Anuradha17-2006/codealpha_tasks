// Notifications page functionality

document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Load notifications
    await loadNotifications();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadNotifications() {
    try {
        const response = await api.getNotifications();
        if (response.success) {
            const list = document.getElementById('notificationsList');
            list.innerHTML = '';
            
            response.data.forEach(notification => {
                const div = createNotificationElement(notification);
                list.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = `notification-item ${notification.isRead ? 'read' : 'unread'}`;
    
    let icon = '📢';
    switch(notification.type) {
        case 'follow': icon = '👥'; break;
        case 'like': icon = '❤️'; break;
        case 'comment': icon = '💬'; break;
        case 'mention': icon = '@'; break;
        case 'share': icon = '🔄'; break;
    }
    
    div.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <div class="notification-content">
            <p>${notification.message}</p>
            <span class="notification-time">${new Date(notification.created_at).toLocaleDateString()}</span>
        </div>
        <button class="delete-btn" data-id="${notification.id}">×</button>
    `;
    
    // Mark as read on click
    div.addEventListener('click', () => markAsRead(notification.id));
    
    // Delete button
    div.querySelector('.delete-btn').addEventListener('click', () => deleteNotification(notification.id));
    
    return div;
}

async function markAsRead(notificationId) {
    try {
        await api.markNotificationAsRead(notificationId);
        await loadNotifications();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

async function deleteNotification(notificationId) {
    try {
        const response = await api.delete(`/notifications/${notificationId}`);
        if (response.success) {
            await loadNotifications();
        }
    } catch (error) {
        UIHelper.showToast('Failed to delete notification', 'error');
    }
}

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // TODO: Filter notifications by type
        });
    });
    
    // Mark all as read
    document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
        try {
            // TODO: Implement mark all as read in API
            UIHelper.showToast('All marked as read', 'success');
        } catch (error) {
            UIHelper.showToast('Failed to mark all as read', 'error');
        }
    });
}
