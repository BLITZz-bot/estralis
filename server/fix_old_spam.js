const { Pool } = require('pg');
require('dotenv').config();
const p = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
(async () => {
  const r = await p.query("UPDATE registrations SET status='bot' WHERE email='vrund2003@outlook.com' RETURNING id,full_name,email,college");
  console.log('Tagged:'); console.table(r.rows);
  await p.end();
})();
