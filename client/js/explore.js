// Explore page functionality
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Load trending
    loadTrending();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadTrending() {
    try {
        const response = await api.get('/posts/trending/tags');
        if (response.success && response.data) {
            const trendingList = document.getElementById('trendingList');
            trendingList.innerHTML = '';
            response.data.slice(0, 6).forEach(tag => {
                const div = document.createElement('div');
                div.className = 'trending-item';
                div.innerHTML = `
                    <h4>#${tag.tag || tag.name}</h4>
                    <p>${tag.count || 0} posts</p>
                `;
                div.style.cursor = 'pointer';
                div.addEventListener('click', () => {
                    document.getElementById('searchInput').value = '#' + (tag.tag || tag.name);
                    search();
                });
                trendingList.appendChild(div);
            });
        } else {
            loadDefaultTrending();
        }
    } catch (error) {
        console.error('Error loading trending:', error);
        loadDefaultTrending();
    }
}

function loadDefaultTrending() {
    const trendingList = document.getElementById('trendingList');
    trendingList.innerHTML = `
        <div class="trending-item">
            <h4>#Technology</h4>
            <p>1.2M posts</p>
        </div>
        <div class="trending-item">
            <h4>#Programming</h4>
            <p>890K posts</p>
        </div>
        <div class="trending-item">
            <h4>#WebDevelopment</h4>
            <p>456K posts</p>
        </div>
        <div class="trending-item">
            <h4>#ReactJS</h4>
            <p>345K posts</p>
        </div>
        <div class="trending-item">
            <h4>#JavaScript</h4>
            <p>678K posts</p>
        </div>
        <div class="trending-item">
            <h4>#NodeJS</h4>
            <p>234K posts</p>
        </div>
    `;
}

async function search() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    try {
        let response;
        if (currentFilter === 'all') {
            response = await api.search(query, 'all');
        } else if (currentFilter === 'users') {
            response = await api.searchUsers(query);
        } else if (currentFilter === 'posts') {
            response = await api.searchPosts(query);
        }
        
        if (response.success) {
            displaySearchResults(response.data);
        }
    } catch (error) {
        console.error('Search error:', error);
        UIHelper.showToast('Search failed', 'error');
    }
}

function displaySearchResults(results) {
    document.getElementById('trendingList').style.display = 'none';
    document.getElementById('searchResults').style.display = 'block';
    
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    if (!results || (Array.isArray(results) && results.length === 0)) {
        resultsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No results found</p>';
        return;
    }
    
    // Handle different response formats
    if (Array.isArray(results)) {
        // Single array of results
        results.forEach(item => {
            if (item.username) {
                // It's a user
                const div = document.createElement('div');
                div.className = 'result-item user-result';
                div.style.cursor = 'pointer';
                div.innerHTML = `
                    <img src="${item.profilePicture || 'https://via.placeholder.com/40'}" alt="User" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <h4>${item.firstName} ${item.lastName}</h4>
                        <p>@${item.username}</p>
                    </div>
                `;
                div.addEventListener('click', () => {
                    window.location.href = `/pages/profile.html?id=${item.id}`;
                });
                resultsList.appendChild(div);
            } else if (item.content) {
                // It's a post
                const div = document.createElement('div');
                div.className = 'result-item post-result';
                div.style.cursor = 'pointer';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.author?.profilePicture || 'https://via.placeholder.com/40'}" alt="User" style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <strong>${item.author?.firstName} ${item.author?.lastName}</strong>
                            <p>${item.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                `;
                resultsList.appendChild(div);
            }
        });
    } else {
        // Object with users and posts
        if (results.users && results.users.length > 0) {
            results.users.forEach(user => {
                const div = document.createElement('div');
                div.className = 'result-item user-result';
                div.style.cursor = 'pointer';
                div.innerHTML = `
                    <img src="${user.profilePicture || 'https://via.placeholder.com/40'}" alt="User" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <h4>${user.firstName} ${user.lastName}</h4>
                        <p>@${user.username}</p>
                    </div>
                `;
                div.addEventListener('click', () => {
                    window.location.href = `/pages/profile.html?id=${user.id}`;
                });
                resultsList.appendChild(div);
            });
        }
        
        if (results.posts && results.posts.length > 0) {
            results.posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'result-item post-result';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${post.author?.profilePicture || 'https://via.placeholder.com/40'}" alt="User" style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <strong>${post.author?.firstName} ${post.author?.lastName}</strong>
                            <p>${post.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                `;
                resultsList.appendChild(div);
            });
        }
        
        if (!results.users && !results.posts) {
            resultsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No results found</p>';
        }
    }
}

function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        if (e.target.value.trim()) {
            searchTimeout = setTimeout(() => {
                search();
            }, 300);
        } else {
            document.getElementById('trendingList').style.display = 'grid';
            document.getElementById('searchResults').style.display = 'none';
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            
            const searchQuery = document.getElementById('searchInput').value.trim();
            if (searchQuery) {
                search();
            }
        });
    });
}
