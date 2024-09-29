import React from 'react';

interface PlayingScreenProps {
  score: number;
  timeLeft: number;
  currentProblem: { question: string; answer: number };
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PlayingScreen: React.FC<PlayingScreenProps> = ({
  score,
  timeLeft,
  currentProblem,
  userAnswer,
  setUserAnswer,
  handleAnswer,
  handleKeyPress
}) => {
  return (
    <div className="playing-screen">
      <div className="game-info">
        <div className="info-item">Score: {score}</div>
        <div className="info-item">Time: {timeLeft}s</div>
      </div>
      <div className="problem-container">
        <div className="problem">{currentProblem.question}</div>
      </div>
      <div className="answer-container">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="retro-input"
          placeholder="?"
          autoFocus
        />
        <button className="retro-button" onClick={handleAnswer}>
          Submit
        </button>
      </div>
      <style jsx>{`
        .playing-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          padding: 20px;
        }
        .game-info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 30px;
        }
        .info-item {
          font-size: 1.2em;
          color: #0f0;
        }
        .problem-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          width: 100%;
          margin-bottom: 30px;
        }
        .problem {
          font-size: 2.5em;
          color: #0f0;
        }
        .answer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .retro-input {
          background-color: #000;
          color: #0f0;
          border: 2px solid #0f0;
          padding: 10px;
          font-family: 'Press Start 2P', cursive;
          font-size: 1.5em;
          margin-bottom: 20px;
          text-align: center;
          width: 80%;
          max-width: 300px;
        }
        .retro-button {
          background-color: #000;
          color: #0f0;
          border: 2px solid #0f0;
          padding: 10px 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 1em;
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

export default PlayingScreen;