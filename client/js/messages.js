// Messages page functionality
let selectedConversation = null;
let socket = null;

document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth.isAuthenticated) {
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Load conversations
    await loadConversations();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize WebSocket for real-time messaging
    // initializeSocket();
});

async function loadConversations() {
    try {
        const response = await api.getConversations();
        if (response.success) {
            const list = document.getElementById('conversationsList');
            list.innerHTML = '';
            
            response.data.forEach(conversation => {
                const div = createConversationElement(conversation);
                list.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

function createConversationElement(conversation) {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.innerHTML = `
        <img src="${conversation.user?.profilePicture || 'https://via.placeholder.com/48'}" alt="User">
        <div class="conversation-info">
            <h4>${conversation.user?.firstName} ${conversation.user?.lastName}</h4>
            <p class="last-message">${conversation.lastMessage?.content || 'No messages yet'}</p>
        </div>
        <span class="conversation-time">${new Date(conversation.lastMessageAt).toLocaleDateString()}</span>
    `;
    
    div.addEventListener('click', () => selectConversation(conversation));
    return div;
}

async function selectConversation(conversation) {
    selectedConversation = conversation;
    
    // Update UI
    document.getElementById('noChatSelected').style.display = 'none';
    document.getElementById('chatWindow').style.display = 'flex';
    
    document.getElementById('chatUserName').textContent = `${conversation.user?.firstName} ${conversation.user?.lastName}`;
    document.getElementById('chatUserPic').src = conversation.user?.profilePicture;
    
    // Load messages
    await loadMessages(conversation.id);
}

async function loadMessages(conversationId) {
    try {
        const response = await api.getMessages(conversationId);
        if (response.success) {
            const container = document.getElementById('messagesContainer');
            container.innerHTML = '';
            
            response.data.forEach(message => {
                const div = createMessageElement(message);
                container.appendChild(div);
            });
            
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function createMessageElement(message) {
    const div = document.createElement('div');
    const isOwn = message.senderId === checkAuth().user.id;
    div.className = `message ${isOwn ? 'own' : 'other'}`;
    div.innerHTML = `
        <div class="message-content">
            <p>${message.content}</p>
            <span class="message-time">${new Date(message.created_at).toLocaleTimeString()}</span>
        </div>
    `;
    return div;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !selectedConversation) return;
    
    try {
        const response = await api.sendMessage(selectedConversation.id, content);
        if (response.success) {
            input.value = '';
            await loadMessages(selectedConversation.id);
        }
    } catch (error) {
        UIHelper.showToast('Failed to send message', 'error');
    }
}

function setupEventListeners() {
    // Send button
    document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
    
    // Send on Enter
    document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Search conversations
    document.getElementById('searchConversations')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.conversation-item').forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            item.style.display = name.includes(query) ? 'flex' : 'none';
        });
    });
}
