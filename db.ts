import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// This is a wrapper to get a Database connection
async function getDbConnection() {
  try {
    return await open({
      filename: './highscores.sqlite',
      driver: sqlite3.Database
    });
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
}

// Initialize the database and create the table if it doesn't exist
async function initializeDb() {
  let db;
  try {
    db = await getDbConnection();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS high_scores (
        user_id TEXT PRIMARY KEY,
        high_score INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        score INTEGER NOT NULL
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Get the high score for a user
async function getHighScore(userId: string): Promise<number | undefined> {
  let db;
  try {
    db = await getDbConnection();
    const result = await db.get('SELECT high_score FROM high_scores WHERE user_id = ?', userId);
    return result ? result.high_score : undefined;
  } catch (error) {
    console.error("Error getting high score:", error);
    return undefined;
  } finally {
    if (db) await db.close();
  }
}

// Update the high score for a user
async function updateHighScore(userId: string, newScore: number): Promise<void> {
  let db;
  try {
    db = await getDbConnection();
    await db.run(
      'INSERT OR REPLACE INTO high_scores (user_id, high_score) VALUES (?, ?)',
      userId,
      newScore
    );
  } catch (error) {
    console.error("Error updating high score:", error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

// Get the leaderboard
async function getLeaderboard(): Promise<Array<{ username: string; score: number }>> {
  let db;
  try {
    db = await getDbConnection();
    const results = await db.all('SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10');
    return results;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  } finally {
    if (db) await db.close();
  }
}

// Update the leaderboard
async function updateLeaderboard(userId: string, username: string, score: number): Promise<void> {
  let db;
  try {
    db = await getDbConnection();
    const leaderboard = await db.all('SELECT * FROM leaderboard ORDER BY score DESC');
    
    // Always insert the new score if the leaderboard has less than 10 entries
    if (leaderboard.length < 10) {
      await db.run('INSERT INTO leaderboard (user_id, username, score) VALUES (?, ?, ?)', userId, username, score);
    } else {
      // If the leaderboard has 10 entries, check if the new score is higher than the lowest score
      const lowestScore = leaderboard[leaderboard.length - 1].score;
      if (score > lowestScore) {
        // Remove the lowest score
        await db.run('DELETE FROM leaderboard WHERE id IN (SELECT id FROM leaderboard ORDER BY score ASC LIMIT 1)');
        // Insert the new score
        await db.run('INSERT INTO leaderboard (user_id, username, score) VALUES (?, ?, ?)', userId, username, score);
      }
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

export { getHighScore, updateHighScore, initializeDb, getLeaderboard, updateLeaderboard };