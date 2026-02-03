const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetAllPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'esoft'
    });

    try {
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        console.log('🔑 Generated password hash:', passwordHash);

        const [result] = await connection.query(
            'UPDATE users SET password_hash = ?',
            [passwordHash]
        );

        console.log('✅ All user passwords reset to: password123');
        console.log(`✅ Updated ${result.affectedRows} users`);

        const [users] = await connection.query('SELECT username, role, branch_id FROM users');
        console.log('\n📋 Login credentials:');
        users.forEach(user => {
            console.log(`   Username: ${user.username} | Role: ${user.role} | Branch: ${user.branch_id || 'All'}`);
        });
        console.log('   Password: password123 (for all users)\n');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await connection.end();
        process.exit(1);
    }
}

resetAllPasswords();
