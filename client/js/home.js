// Home page functionality
let currentPage = 1;
let isLoading = false;
let pollOptions = [];
let selectedEmojis = [];

document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }

    // Load user profile in sidebar
    await loadUserProfile();
    
    // Load posts
    await loadPosts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load trending tags/users for suggestions
    loadSuggestedUsers();
    loadTrendingTags();
});

async function loadUserProfile() {
    try {
        const response = await api.get(`/users/${checkAuth().user.id}`);
        if (response.success) {
            const user = response.data;
            document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById('userUsername').textContent = `@${user.username}`;
            document.getElementById('userBio').textContent = user.bio || 'No bio yet';
            document.getElementById('followerCount').textContent = '0';
            document.getElementById('followingCount').textContent = '0';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadPosts() {
    try {
        isLoading = true;
        const response = await api.get(`/posts?page=${currentPage}&limit=10`);
        
        if (response.success) {
            const feed = document.getElementById('postsFeed');
            
            if (currentPage === 1) {
                feed.innerHTML = '';
            }
            
            response.data.forEach(post => {
                feed.appendChild(createPostElement(post));
            });
            
            if (response.data.length >= 10) {
                document.getElementById('loadMore').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        UIHelper.showToast('Failed to load posts', 'error');
    } finally {
        isLoading = false;
    }
}

function createPostElement(post) {
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
        </div>
        <div class="post-engagement">
            <button class="engagement-btn like-btn" data-post-id="${post.id}">
                ❤️ ${post.likesCount}
            </button>
            <button class="engagement-btn comment-btn" data-post-id="${post.id}">
                💬 ${post.commentsCount}
            </button>
            <button class="engagement-btn share-btn" data-post-id="${post.id}">
                🔄 ${post.sharesCount}
            </button>
            <button class="engagement-btn bookmark-btn" data-post-id="${post.id}">
                🔖 Save
            </button>
        </div>
    `;
    
    // Add event listeners
    div.querySelector('.like-btn').addEventListener('click', () => likePost(post.id));
    div.querySelector('.comment-btn').addEventListener('click', () => openCommentModal(post.id, post));
    div.querySelector('.bookmark-btn').addEventListener('click', () => bookmarkPost(post.id));
    
    return div;
}

async function likePost(postId) {
    try {
        const response = await api.likePost(postId);
        if (response.success) {
            UIHelper.showToast('Post liked!', 'success');
        }
    } catch (error) {
        UIHelper.showToast('Failed to like post', 'error');
    }
}

async function bookmarkPost(postId) {
    try {
        const response = await api.bookmarkPost(postId);
        if (response.success) {
            UIHelper.showToast('Post saved!', 'success');
        }
    } catch (error) {
        UIHelper.showToast('Failed to save post', 'error');
    }
}

async function createPost() {
    const content = document.getElementById('postContent').value.trim();
    const visibility = document.getElementById('postVisibility').value;
    
    if (!content) {
        UIHelper.showToast('Please enter some content', 'error');
        return;
    }
    
    try {
        const response = await api.createPost({
            content,
            visibility,
            postType: 'text'
        });
        
        if (response.success) {
            document.getElementById('postContent').value = '';
            UIHelper.showToast('Post created!', 'success');
            currentPage = 1;
            await loadPosts();
        }
    } catch (error) {
        UIHelper.showToast(error.message || 'Failed to create post', 'error');
    }
}

async function loadSuggestedUsers() {
    try {
        const response = await api.get('/users?limit=5');
        if (response.success) {
            const suggestedList = document.getElementById('suggestedUsers');
            suggestedList.innerHTML = '';
            response.data.slice(0, 3).forEach(user => {
                const div = document.createElement('div');
                div.className = 'suggested-user';
                div.innerHTML = `
                    <img src="${user.profilePicture || 'https://via.placeholder.com/40'}" alt="User" class="suggested-avatar">
                    <div class="suggested-info">
                        <strong>${user.firstName} ${user.lastName}</strong>
                        <span>@${user.username}</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="followUserFromSuggestion('${user.id}')">Follow</button>
                `;
                suggestedList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading suggested users:', error);
    }
}

async function loadTrendingTags() {
    try {
        const response = await api.get('/posts/trending/tags');
        if (response.success) {
            const trendingList = document.getElementById('trendingTags');
            trendingList.innerHTML = '';
            response.data.slice(0, 5).forEach(tag => {
                const div = document.createElement('div');
                div.className = 'trending-tag';
                div.innerHTML = `
                    <div class="tag-info">
                        <strong>#${tag.tag}</strong>
                        <span>${tag.count} posts</span>
                    </div>
                `;
                trendingList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading trending tags:', error);
        const trendingList = document.getElementById('trendingTags');
        trendingList.innerHTML = `
            <div class="trending-tag"><strong>#Technology</strong><span>1.2M posts</span></div>
            <div class="trending-tag"><strong>#Programming</strong><span>890K posts</span></div>
            <div class="trending-tag"><strong>#WebDevelopment</strong><span>456K posts</span></div>
        `;
    }
}

function openPollModal() {
    pollOptions = [];
    const modal = document.createElement('div');
    modal.id = 'pollModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closePollModal()">&times;</span>
            <h2>Create a Poll</h2>
            <form id="pollForm">
                <div class="form-group">
                    <label>Question</label>
                    <input type="text" id="pollQuestion" placeholder="Ask a question" required>
                </div>
                <div id="pollOptionsContainer">
                    <div class="form-group">
                        <label>Option 1</label>
                        <input type="text" class="poll-option" placeholder="Option 1" required>
                    </div>
                    <div class="form-group">
                        <label>Option 2</label>
                        <input type="text" class="poll-option" placeholder="Option 2" required>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="addPollOption()">+ Add Option</button>
                <div style="margin-top: 15px;">
                    <button type="submit" class="btn btn-primary">Create Poll</button>
                    <button type="button" class="btn btn-outline" onclick="closePollModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    document.getElementById('pollForm').addEventListener('submit', (e) => {
        e.preventDefault();
        insertPollToPost();
        closePollModal();
    });
}

function closePollModal() {
    const modal = document.getElementById('pollModal');
    if (modal) modal.remove();
}

function addPollOption() {
    const container = document.getElementById('pollOptionsContainer');
    const optionCount = container.querySelectorAll('.poll-option').length + 1;
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
        <label>Option ${optionCount}</label>
        <input type="text" class="poll-option" placeholder="Option ${optionCount}">
    `;
    container.appendChild(div);
}

function insertPollToPost() {
    const question = document.getElementById('pollQuestion').value;
    const options = Array.from(document.querySelectorAll('.poll-option')).map(opt => opt.value).filter(v => v);
    const pollText = `📊 POLL: ${question}\n${options.map((opt, i) => `  ${i+1}. ${opt}`).join('\n')}`;
    document.getElementById('postContent').value += (document.getElementById('postContent').value ? '\n' : '') + pollText;
}

function openEmojiPicker() {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '❤️', '🔥', '👍', '🎉', '🚀', '💯', '✨', '🙌'];
    const modal = document.createElement('div');
    modal.id = 'emojiModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close" onclick="closeEmojiModal()">&times;</span>
            <h2>Pick an Emoji</h2>
            <div class="emoji-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 20px 0;">
                ${emojis.map(emoji => `
                    <button type="button" class="emoji-btn" style="font-size: 24px; padding: 10px; border: none; cursor: pointer; border-radius: 8px; background: #f0f0f0; hover:background: #e0e0e0;" onclick="insertEmoji('${emoji}')">${emoji}</button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeEmojiModal() {
    const modal = document.getElementById('emojiModal');
    if (modal) modal.remove();
}

function insertEmoji(emoji) {
    const textArea = document.getElementById('postContent');
    textArea.value += emoji;
    closeEmojiModal();
}

async function followUserFromSuggestion(userId) {
    try {
        const response = await api.followUser(userId);
        if (response.success) {
            UIHelper.showToast('Following!', 'success');
        }
    } catch (error) {
        UIHelper.showToast('Failed to follow user', 'error');
    }
}

function openCommentModal(postId, post) {
    const modal = document.createElement('div');
    modal.id = 'commentModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeCommentModal()">&times;</span>
            <h2>Comments</h2>
            
            <!-- Original Post -->
            <div class="post-preview" style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div class="post-header">
                    <img src="${post.author?.profilePicture || 'https://via.placeholder.com/40'}" alt="User" class="post-avatar" style="width: 40px; height: 40px;">
                    <div class="post-meta">
                        <strong>${post.author?.firstName} ${post.author?.lastName}</strong>
                        <span class="post-username">@${post.author?.username}</span>
                    </div>
                </div>
                <div class="post-content" style="margin: 10px 0;">
                    <p>${post.content}</p>
                </div>
            </div>
            
            <!-- Comments List -->
            <div id="commentsList" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 10px;">
                <div class="loading">Loading comments...</div>
            </div>
            
            <!-- Comment Form -->
            <form id="commentForm" style="display: flex; gap: 10px;">
                <img src="${checkAuth().user.profilePicture || 'https://via.placeholder.com/40'}" alt="You" style="width: 40px; height: 40px; border-radius: 50%;">
                <div style="flex: 1;">
                    <textarea id="commentInput" placeholder="Write a comment..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical; min-height: 60px;"></textarea>
                    <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Post Comment</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Load existing comments
    loadComments(postId);
    
    // Handle form submission
    document.getElementById('commentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitComment(postId);
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCommentModal();
        }
    });
}

function closeCommentModal() {
    const modal = document.getElementById('commentModal');
    if (modal) modal.remove();
}

async function loadComments(postId) {
    try {
        const response = await api.getPostComments(postId);
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        if (response.success && response.data.length > 0) {
            response.data.forEach(comment => {
                const div = document.createElement('div');
                div.style.cssText = 'padding: 10px; border-bottom: 1px solid #eee;';
                div.innerHTML = `
                    <div style="display: flex; gap: 10px;">
                        <img src="${comment.author?.profilePicture || 'https://via.placeholder.com/40'}" alt="User" style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;">
                        <div style="flex: 1;">
                            <strong>${comment.author?.firstName} ${comment.author?.lastName}</strong>
                            <span style="color: #999; font-size: 0.9em;">@${comment.author?.username}</span>
                            <p style="margin: 5px 0; line-height: 1.4;">${comment.content}</p>
                            <span style="font-size: 0.85em; color: #999;">${new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                commentsList.appendChild(div);
            });
        } else {
            commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No comments yet. Be the first to comment!</p>';
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        document.getElementById('commentsList').innerHTML = '<p style="color: red;">Error loading comments</p>';
    }
}

async function submitComment(postId) {
    try {
        const content = document.getElementById('commentInput').value.trim();
        if (!content) {
            UIHelper.showToast('Comment cannot be empty', 'error');
            return;
        }
        
        const response = await api.createComment(postId, content);
        if (response.success) {
            document.getElementById('commentInput').value = '';
            await loadComments(postId);
            UIHelper.showToast('Comment posted!', 'success');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        UIHelper.showToast('Failed to post comment', 'error');
    }
}

async function likePost(postId) {
    try {
        const response = await api.likePost(postId);
        if (response.success) {
            // Reload posts to reflect like count change
            await loadPosts();
        }
    } catch (error) {
        UIHelper.showToast('Failed to like post', 'error');
    }
}

async function bookmarkPost(postId) {
    try {
        const response = await api.bookmarkPost(postId);
        if (response.success) {
            UIHelper.showToast('Post bookmarked!', 'success');
        }
    } catch (error) {
        UIHelper.showToast('Failed to bookmark post', 'error');
    }
}

function setupEventListeners() {
    // Post button
    document.getElementById('postBtn')?.addEventListener('click', createPost);
    
    // Poll button
    document.querySelectorAll('.post-action-btn')[1]?.addEventListener('click', openPollModal);
    
    // Emoji button
    document.querySelectorAll('.post-action-btn')[2]?.addEventListener('click', openEmojiPicker);
    
    // Load more
    document.getElementById('loadMore')?.addEventListener('click', () => {
        currentPage++;
        loadPosts();
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        logout();
    });
}