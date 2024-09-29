import type { NextApiRequest, NextApiResponse } from 'next'
import { getHighScore, updateHighScore, getLeaderboard, updateLeaderboard } from '../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req

  console.log(`Received ${method} request`);

  switch (method) {
    case 'GET':
      try {
        if (query.leaderboard) {
          const leaderboard = await getLeaderboard();
          res.status(200).json({ leaderboard });
        } else {
          const userId = query.userId as string
          console.log(`Fetching high score for user: ${userId}`);
          const highScore = await getHighScore(userId)
          console.log(`High score for user ${userId}: ${highScore}`);
          res.status(200).json({ highScore })
        }
      } catch (error) {
        console.error('Error in GET request:', error);
        res.status(500).json({ error: 'Failed to get data' })
      }
      break

    case 'POST':
      try {
        const { userId, username, score } = body
        console.log(`Updating high score for user ${userId} (${username}) to ${score}`);
        await updateHighScore(userId, score)
        await updateLeaderboard(userId, username, score)
        
        // Fetch the updated leaderboard
        const updatedLeaderboard = await getLeaderboard();
        
        console.log(`High score and leaderboard updated successfully for user ${userId}`);
        console.log('Updated leaderboard:', updatedLeaderboard);
        
        res.status(200).json({ 
          message: 'High score and leaderboard updated successfully',
          leaderboard: updatedLeaderboard
        })
      } catch (error) {
        console.error('Error in POST request:', error);
        res.status(500).json({ error: 'Failed to update high score and leaderboard' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}