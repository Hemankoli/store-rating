require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('./lib/db');

async function main() {
  const email = 'admin@example.com';
  const { rows } = await pool.query('SELECT id FROM profile WHERE email = $1', [email]);
  if (rows.length) {
    console.log('Admin user already exists:', email);
    return;
  }
  const hash = await bcrypt.hash('Admin123!', 10);
  const id = uuidv4();
  await pool.query(
    'INSERT INTO profile (id, name, email, password, address, role) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, 'System Administrator Account', email, hash, '1 Admin Plaza, Admin City', 'admin']
  );
  console.log('Seed complete. Admin user:', email);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => pool.end());
