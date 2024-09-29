import { initializeDb } from '../db';

initializeDb().then(() => {
  console.log('Database initialized successfully');
}).catch((error) => {
  console.error('Failed to initialize database:', error);
});