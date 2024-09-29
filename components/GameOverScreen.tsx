import React from 'react';
import Link from 'next/link';

interface GameOverScreenProps {
  score: number;
  startGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  startGame,
}) => {
  return (
    <div className="game-over-screen">
      <h2 className="game-over-title">Game Over</h2>
      <p className="final-score">Your Score: {score}</p>
      <div className="button-container">
        <button className="retro-button" onClick={startGame}>
          Play Again
        </button>
        <Link href="/leaderboard" passHref>
          <button className="retro-button">
            View Leaderboard
          </button>
        </Link>
      </div>
      <style jsx>{`
        .game-over-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          text-align: center;
          padding: 20px;
        }
        .game-over-title {
          font-size: 2.5em;
          color: #f00;
          margin-bottom: 20px;
        }
        .final-score {
          font-size: 1.5em;
          color: #0f0;
          margin-bottom: 30px;
        }
        .button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .retro-button {
          background-color: #000;
          color: #0f0;
          border: 2px solid #0f0;
          padding: 10px 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 1em;
          margin: 10px 0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .retro-button:hover {
          background-color: #0f0;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default GameOverScreen;