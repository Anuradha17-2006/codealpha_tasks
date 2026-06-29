// Profile page functionality
let currentUserId = null;
let isOwnProfile = false;

document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Get user ID from URL or use current user
    const urlParams = new URLSearchParams(window.location.search);
    currentUserId = urlParams.get('id') || auth.user.id;
    isOwnProfile = currentUserId === auth.user.id;
    
    // Load profile
    await loadProfile();
    
    // Load initial posts
    await loadUserPosts();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadProfile() {
    try {
        const response = await api.getUser(currentUserId);
        if (response.success) {
            const user = response.data;
            
            document.getElementById('fullName').textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById('username').textContent = `@${user.username}`;
            document.getElementById('bio').textContent = user.bio || 'No bio yet';
            document.getElementById('location').textContent = user.location ? `📍 ${user.location}` : '';
            document.getElementById('profilePic').src = user.profilePicture;
            document.getElementById('postsCount').textContent = '0';
            document.getElementById('followerCount').textContent = '0';
            document.getElementById('followingCount').textContent = '0';
            
            // Show appropriate buttons
            if (isOwnProfile) {
                document.getElementById('editProfileBtn').style.display = 'block';
            } else {
                document.getElementById('followBtn').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        UIHelper.showToast('Failed to load profile', 'error');
    }
}

function setupEventListeners() {
    // Edit profile button
    document.getElementById('editProfileBtn')?.addEventListener('click', openEditModal);
    
    // Follow button
    document.getElementById('followBtn')?.addEventListener('click', followUser);
    
    // Unfollow button
    document.getElementById('unfollowBtn')?.addEventListener('click', unfollowUser);
    
    // Edit form
    document.getElementById('editProfileForm')?.addEventListener('submit', saveProfile);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Close modal
    document.querySelector('.close')?.addEventListener('click', closeEditModal);
}

function openEditModal() {
    // Populate form with current data
    document.getElementById('editFirstName').value = document.getElementById('fullName').textContent.split(' ')[0];
    document.getElementById('editLastName').value = document.getElementById('fullName').textContent.split(' ')[1] || '';
    document.getElementById('editBio').value = document.getElementById('bio').textContent;
    document.getElementById('editLocation').value = document.getElementById('location').textContent.replace('📍 ', '');
    
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function saveProfile(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('firstName', document.getElementById('editFirstName').value);
        formData.append('lastName', document.getElementById('editLastName').value);
        formData.append('bio', document.getElementById('editBio').value);
        formData.append('location', document.getElementById('editLocation').value);
        formData.append('website', document.getElementById('editWebsite').value);
        
        // Handle profile picture upload if selected
        const profilePicInput = document.getElementById('editProfilePic');
        if (profilePicInput && profilePicInput.files.length > 0) {
            formData.append('profilePicture', profilePicInput.files[0]);
        }
        
        const response = await fetch(`/api/v1/users/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            UIHelper.showToast('Profile updated!', 'success');
            closeEditModal();
            await loadProfile();
            await loadUserPosts();
        }
    } catch (error) {
        UIHelper.showToast(error.message || 'Failed to update profile', 'error');
    }
}

async function loadUserPosts() {
    try {
        const response = await api.get(`/posts?userId=${currentUserId}&limit=50`);
        if (response.success) {
            const userPosts = document.getElementById('userPosts');
            userPosts.innerHTML = '';
            
            if (response.data.length === 0) {
                userPosts.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No posts yet</p>';
                return;
            }
            
            response.data.forEach(post => {
                const postEl = createProfilePostElement(post);
                userPosts.appendChild(postEl);
            });
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('userPosts').innerHTML = '<p style="color: red;">Error loading posts</p>';
    }
}

async function loadUserMedia() {
    try {
        const response = await api.get(`/posts?userId=${currentUserId}&hasMedia=true&limit=50`);
        if (response.success) {
            const userMedia = document.getElementById('userMedia');
            userMedia.innerHTML = '';
            
            if (response.data.length === 0) {
                userMedia.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No media posts yet</p>';
                return;
            }
            
            response.data.forEach(post => {
                if (post.image) {
                    const mediaEl = document.createElement('div');
                    mediaEl.className = 'media-item';
                    mediaEl.innerHTML = `
                        <img src="${post.image}" alt="Media" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="alert('${post.content}')">
                    `;
                    userMedia.appendChild(mediaEl);
                }
            });
        }
    } catch (error) {
        console.error('Error loading media:', error);
    }
}

async function loadUserLikes() {
    try {
        const response = await api.get(`/posts/likes?userId=${currentUserId}&limit=50`);
        if (response.success) {
            const userLikes = document.getElementById('userLikes');
            userLikes.innerHTML = '';
            
            if (response.data.length === 0) {
                userLikes.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No liked posts yet</p>';
                return;
            }
            
            response.data.forEach(post => {
                const postEl = createProfilePostElement(post);
                userLikes.appendChild(postEl);
            });
        }
    } catch (error) {
        console.error('Error loading likes:', error);
    }
}

function createProfilePostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.innerHTML = `
        <div class="post-header">
            <img src="${post.author?.profilePicture || 'https://via.placeholder.com/48'}" alt="User" class="post-avatar">
            <div class="post-meta">
                <strong>${post.author?.firstName} ${post.author?.lastName}</strong>
                <span class="post-username">@${post.author?.username}</span>
                <span class="post-time">${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">` : ''}
        </div>
        <div class="post-engagement">
            <button class="engagement-btn">❤️ ${post.likesCount || 0}</button>
            <button class="engagement-btn">💬 ${post.commentsCount || 0}</button>
            <button class="engagement-btn">🔄 ${post.sharesCount || 0}</button>
        </div>
    `;
    return div;
}

async function followUser() {
    try {
        const response = await api.followUser(currentUserId);
        if (response.success) {
            UIHelper.showToast('Following user!', 'success');
            document.getElementById('followBtn').style.display = 'none';
            document.getElementById('unfollowBtn').style.display = 'block';
        }
    } catch (error) {
        UIHelper.showToast('Failed to follow user', 'error');
    }
}

async function unfollowUser() {
    try {
        const response = await api.unfollowUser(currentUserId);
        if (response.success) {
            UIHelper.showToast('Unfollowed user', 'success');
            document.getElementById('unfollowBtn').style.display = 'none';
            document.getElementById('followBtn').style.display = 'block';
        }
    } catch (error) {
        UIHelper.showToast('Failed to unfollow user', 'error');
    }
}

function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    e.target.classList.add('active');
    
    // Load tab content
    if (tabName === 'posts') {
        loadUserPosts();
    } else if (tabName === 'media') {
        loadUserMedia();
    } else if (tabName === 'likes') {
        loadUserLikes();
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeEditModal();
    }
});
