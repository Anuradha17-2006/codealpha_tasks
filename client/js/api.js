// API Configuration
class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:5000/api/v1';
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // Set tokens
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Clear tokens
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    // Get headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        return headers;
    }

    // Refresh token
    async refreshAccessToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data.accessToken, data.refreshToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            let response = await fetch(url, config);

            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    config.headers = this.getHeaders();
                    response = await fetch(url, config);
                } else {
                    this.clearTokens();
                    window.location.href = '/pages/login.html';
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    // PUT request
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // File upload
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);

        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const headers = { ...this.getHeaders() };
        delete headers['Content-Type']; // Let browser set it

        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: formData
        });
    }

    // ===== AUTH ENDPOINTS =====

    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async login(email, password, rememberMe = false) {
        return this.post('/auth/login', { email, password, rememberMe });
    }

    async logout() {
        return this.post('/auth/logout', {});
    }

    async verifyEmail(token) {
        return this.post('/auth/verify-email', { token });
    }

    async forgotPassword(email) {
        return this.post('/auth/forgot-password', { email });
    }

    async resetPassword(token, password, confirmPassword) {
        return this.post('/auth/reset-password', { token, password, confirmPassword });
    }

    // ===== USER ENDPOINTS =====

    async getUser(userId) {
        return this.get(`/users/${userId}`);
    }

    async updateProfile(userId, data) {
        return this.put(`/users/${userId}`, data);
    }

    async getFollowers(userId) {
        return this.get(`/users/${userId}/followers`);
    }

    async getFollowing(userId) {
        return this.get(`/users/${userId}/following`);
    }

    // ===== POST ENDPOINTS =====

    async getPosts() {
        return this.get('/posts');
    }

    async getPost(postId) {
        return this.get(`/posts/${postId}`);
    }

    async createPost(postData) {
        return this.post('/posts', postData);
    }

    async updatePost(postId, postData) {
        return this.put(`/posts/${postId}`, postData);
    }

    async deletePost(postId) {
        return this.delete(`/posts/${postId}`);
    }

    async bookmarkPost(postId) {
        return this.post(`/posts/${postId}/bookmark`, {});
    }

    // ===== ENGAGEMENT ENDPOINTS =====

    async likePost(postId) {
        return this.post(`/likes/post/${postId}`, {});
    }

    async unlikePost(postId) {
        return this.delete(`/likes/post/${postId}`);
    }

    async getPostComments(postId) {
        return this.get(`/comments/${postId}`);
    }

    async createComment(postId, content) {
        return this.post('/comments', { postId, content });
    }

    // ===== FOLLOW ENDPOINTS =====

    async followUser(userId) {
        return this.post(`/follow/${userId}`, {});
    }

    async unfollowUser(userId) {
        return this.delete(`/follow/${userId}`);
    }

    async blockUser(userId) {
        return this.post(`/follow/${userId}/block`, {});
    }

    // ===== NOTIFICATION ENDPOINTS =====

    async getNotifications() {
        return this.get('/notifications');
    }

    async markNotificationAsRead(notificationId) {
        return this.put(`/notifications/${notificationId}/read`, {});
    }

    // ===== MESSAGE ENDPOINTS =====

    async getConversations() {
        return this.get('/messages/conversations');
    }

    async getMessages(conversationId) {
        return this.get(`/messages/conversations/${conversationId}`);
    }

    async sendMessage(conversationId, content) {
        return this.post('/messages', { conversationId, content });
    }

    // ===== SEARCH ENDPOINTS =====

    async search(query, type = 'all') {
        return this.get(`/search?query=${encodeURIComponent(query)}&type=${type}`);
    }

    async searchUsers(query) {
        return this.get(`/search/users?query=${encodeURIComponent(query)}`);
    }

    async searchPosts(query) {
        return this.get(`/search/posts?query=${encodeURIComponent(query)}`);
    }
}

// Create global instance
const api = new APIClient();
