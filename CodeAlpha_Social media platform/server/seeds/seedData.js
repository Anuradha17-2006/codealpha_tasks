const { User, Post, Follow } = require('../models/index_fixed');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        
        // Sample users
        const sampleUsers = [
            {
                id: uuidv4(),
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@example.com',
                username: 'alice_dev',
                password: await bcrypt.hash('password123', 10),
                bio: 'Full Stack Developer | React & Node.js enthusiast',
                location: 'San Francisco, CA',
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
            },
            {
                id: uuidv4(),
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob@example.com',
                username: 'bob_designer',
                password: await bcrypt.hash('password123', 10),
                bio: 'UI/UX Designer | Figma addict',
                location: 'New York, NY',
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
            },
            {
                id: uuidv4(),
                firstName: 'Carol',
                lastName: 'Davis',
                email: 'carol@example.com',
                username: 'carol_tech',
                password: await bcrypt.hash('password123', 10),
                bio: 'Tech Blogger | AI/ML Enthusiast',
                location: 'Seattle, WA',
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
            },
            {
                id: uuidv4(),
                firstName: 'David',
                lastName: 'Wilson',
                email: 'david@example.com',
                username: 'david_code',
                password: await bcrypt.hash('password123', 10),
                bio: 'Software Engineer | Open Source Contributor',
                location: 'Austin, TX',
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
            },
            {
                id: uuidv4(),
                firstName: 'Emma',
                lastName: 'Brown',
                email: 'emma@example.com',
                username: 'emma_creative',
                password: await bcrypt.hash('password123', 10),
                bio: 'Creative Developer | Passion for web design',
                location: 'Los Angeles, CA',
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
            }
        ];

        // Create users
        console.log('Creating sample users...');
        for (const userData of sampleUsers) {
            try {
                await User.create(userData);
                console.log(`✓ Created user: ${userData.username}`);
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    console.log(`⚠ User ${userData.username} already exists, skipping...`);
                } else {
                    console.error(`Error creating user ${userData.username}:`, error.message);
                }
            }
        }

        // Fetch created users
        const users = await User.findAll();
        console.log(`\nTotal users in database: ${users.length}`);

        if (users.length < 2) {
            console.warn('⚠ Insufficient users for creating relationships');
            return;
        }

        // Create sample posts
        console.log('\nCreating sample posts...');
        const samplePosts = [
            {
                id: uuidv4(),
                userId: users[0].id,
                content: '🚀 Just launched my new portfolio website! Check it out and let me know what you think. Built with React & Tailwind CSS. #WebDevelopment #React',
                visibility: 'public',
                likesCount: 45,
                commentsCount: 12,
                sharesCount: 8
            },
            {
                id: uuidv4(),
                userId: users[1].id,
                content: 'Excited to announce that I\'m starting a new role as Lead UX Designer! Looking forward to working on some amazing projects. 🎉',
                visibility: 'public',
                likesCount: 67,
                commentsCount: 23,
                sharesCount: 15
            },
            {
                id: uuidv4(),
                userId: users[2].id,
                content: 'New blog post: "Getting Started with Machine Learning in 2024" - covering TensorFlow basics and practical applications. Read it on my blog! 📚',
                visibility: 'public',
                likesCount: 89,
                commentsCount: 34,
                sharesCount: 45
            },
            {
                id: uuidv4(),
                userId: users[3].id,
                content: 'Just contributed to an open-source project for the first time! Feeling proud. If you\'re thinking about contributing, just do it! 💪 #OpenSource #GitHub',
                visibility: 'public',
                likesCount: 156,
                commentsCount: 42,
                sharesCount: 67
            },
            {
                id: uuidv4(),
                userId: users[4].id,
                content: 'Design tip: Don\'t forget about whitespace in your layouts. It\'s not just empty space - it\'s a powerful design element! ✨ #DesignTips #UX',
                visibility: 'public',
                likesCount: 234,
                commentsCount: 56,
                sharesCount: 78
            },
            {
                id: uuidv4(),
                userId: users[0].id,
                content: 'Working on a real-time chat application using Socket.io. Building with TypeScript + React on the frontend and Node.js on the backend. 💻',
                visibility: 'public',
                likesCount: 78,
                commentsCount: 28,
                sharesCount: 34
            },
            {
                id: uuidv4(),
                userId: users[1].id,
                content: 'Finally completed my certification in UX Research! Time to apply these new techniques to my projects. #LearningJourney #Design',
                visibility: 'public',
                likesCount: 92,
                commentsCount: 31,
                sharesCount: 19
            },
            {
                id: uuidv4(),
                userId: users[2].id,
                content: 'Data science insight: Always clean your data before analysis. Garbage in = Garbage out! 📊 #DataScience #Python',
                visibility: 'public',
                likesCount: 134,
                commentsCount: 41,
                sharesCount: 56
            }
        ];

        for (const postData of samplePosts) {
            try {
                await Post.create(postData);
                console.log(`✓ Created post by ${users.find(u => u.id === postData.userId)?.username}`);
            } catch (error) {
                console.error('Error creating post:', error.message);
            }
        }

        // Create follows
        console.log('\nCreating follow relationships...');
        try {
            // User 0 follows 1, 2, 3
            await Follow.create({ followerId: users[0].id, followingId: users[1].id });
            await Follow.create({ followerId: users[0].id, followingId: users[2].id });
            await Follow.create({ followerId: users[0].id, followingId: users[3].id });
            
            // User 1 follows 0, 4
            await Follow.create({ followerId: users[1].id, followingId: users[0].id });
            await Follow.create({ followerId: users[1].id, followingId: users[4].id });
            
            // User 2 follows 0, 1
            await Follow.create({ followerId: users[2].id, followingId: users[0].id });
            await Follow.create({ followerId: users[2].id, followingId: users[1].id });
            
            // User 3 follows everyone
            await Follow.create({ followerId: users[3].id, followingId: users[0].id });
            await Follow.create({ followerId: users[3].id, followingId: users[1].id });
            await Follow.create({ followerId: users[3].id, followingId: users[2].id });
            await Follow.create({ followerId: users[3].id, followingId: users[4].id });
            
            // User 4 follows 0, 2, 3
            await Follow.create({ followerId: users[4].id, followingId: users[0].id });
            await Follow.create({ followerId: users[4].id, followingId: users[2].id });
            await Follow.create({ followerId: users[4].id, followingId: users[3].id });
            
            console.log('✓ Created follow relationships');
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log('⚠ Some follow relationships already exist');
            } else {
                console.error('Error creating follows:', error.message);
            }
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\nSample Credentials:');
        console.log('Email: alice@example.com | Password: password123');
        console.log('Email: bob@example.com | Password: password123');
        console.log('Email: carol@example.com | Password: password123');

    } catch (error) {
        console.error('Seeding error:', error);
    }
}

module.exports = seedDatabase;
