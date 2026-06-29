const seedDatabase = require('./seeds/seedData');
const { sequelize } = require('./models/index_fixed');

async function runSeed() {
    try {
        console.log('🔄 Syncing database...');
        await sequelize.sync({ force: false });
        
        console.log('📝 Running seed script...');
        await seedDatabase();
        
        console.log('✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

runSeed();
