import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type LeaderboardEntry = { username: string; score: number };

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch('/api/highscore?leaderboard=true')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data.leaderboard);
      })
      .catch(error => {
        console.error("Error fetching leaderboard:", error);
      });
  }, []);

  // Create an array of 10 items, filled with leaderboard entries or placeholders
  const leaderboardDisplay = Array(10).fill(null).map((_, index) => 
    leaderboard[index] || { username: '---', score: '---' }
  );

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <div className="leaderboard-page">
        <h1 className="page-title">Top 10 Leaderboard</h1>
        <ol className="leaderboard-list">
          {leaderboardDisplay.map((entry, index) => (
            <li key={index} className="leaderboard-item">
              <span className="rank">{(index + 1).toString().padStart(2, ' ')}.</span>
              <span className="username">{entry.username}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
        <Link href="/" passHref>
          <button className="retro-button">Back to Game</button>
        </Link>
        <style jsx>{`
          .leaderboard-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #000;
            color: #0f0;
            font-family: 'Press Start 2P', cursive;
            padding: 20px;
          }
          .page-title {
            font-size: 2em;
            margin-bottom: 30px;
          }
          .leaderboard-list {
            list-style-type: none;
            padding: 0;
            width: 100%;
            max-width: 500px;
          }
          .leaderboard-item {
            font-size: 1.2em;
            margin-bottom: 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .rank {
            width: 45px;
            text-align: right;
            padding-right: 10px;
          }
          .username {
            flex-grow: 1;
            text-align: left;
            padding-left: 10px;
          }
          .score {
            width: 80px;
            text-align: right;
          }
          .retro-button {
            background-color: #000;
            color: #0f0;
            border: 2px solid #0f0;
            padding: 10px 20px;
            font-family: 'Press Start 2P', cursive;
            font-size: 1em;
            margin-top: 30px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .retro-button:hover {
            background-color: #0f0;
            color: #000;
          }
        `}</style>
      </div>
    </>
  );
};

export default LeaderboardPage;