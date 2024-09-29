import React from 'react';

interface StartScreenProps {
  username: string;
  highScore: number | null;
  startGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ username, highScore, startGame }) => {
  return (
    <div className="start-screen">
      <h1 className="game-title">Matrix Math Challenge</h1>
      <p className="user-info">Welcome, {username}</p>
      <p className="user-info">High Score: {highScore}</p>
      <button className="retro-button" onClick={startGame}>
        Insert Coin
      </button>
      <style jsx>{`
        .start-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          text-align: center;
          padding: 20px;
        }
        .game-title {
          font-size: 2.5em;
          color: #0f0;
          margin-bottom: 30px;
          text-shadow: 2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000;
        }
        .user-info {
          font-size: 1.2em;
          color: #0f0;
          margin-bottom: 15px;
        }
        .retro-button {
          background-color: #000;
          color: #0f0;
          border: 2px solid #0f0;
          padding: 10px 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 1em;
          margin-top: 20px;
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

export default StartScreen;