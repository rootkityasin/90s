// Database initialization script
// Use the core module to avoid the Next.js server-only guard when running via Node.
import { initializeDatabase } from './mongoStore.core';

initializeDatabase()
  .then(() => {
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });
