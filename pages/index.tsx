import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import StartScreen from "../components/StartScreen";
import PlayingScreen from "../components/PlayingScreen";
import GameOverScreen from "../components/GameOverScreen";
import Head from 'next/head';

type GameState = "splash" | "playing" | "gameover";
type LeaderboardEntry = { username: string; score: number };

const gameSettings = {
  initialTime: 30,
  timeBonus: 1,
};

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [gameState, setGameState] = useState<GameState>("splash");
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(gameSettings.initialTime);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [topLeaderboard, setTopLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (isSignedIn && user && user.id) {
      fetch(`/api/highscore?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setHighScore(data.highScore ?? 0);
        })
        .catch(error => {
          console.error("Error fetching high score:", error);
          setHighScore(0);
        });
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (gameState === "playing") {
      generateProblem();
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameState("gameover");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const generateProblem = () => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1: number, num2: number, answer: number;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '/':
        num2 = Math.floor(Math.random() * 11) + 2;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      default:
        throw new Error('Invalid operation');
    }

    setCurrentProblem({ 
      question: `${num1} ${operation} ${num2} = ?`, 
      answer: answer 
    });
  };

  const handleAnswer = () => {
    if (parseInt(userAnswer) === currentProblem.answer) {
      setScore(score + 1);
      setTimeLeft(time => Math.min(time + gameSettings.timeBonus, gameSettings.initialTime));
      generateProblem();
    } else {
      setTimeLeft(time => Math.max(time - 5, 0));
    }
    setUserAnswer("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && gameState === "playing") {
      handleAnswer();
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(gameSettings.initialTime);
  };

  const updateLeaderboard = async () => {
    if (isSignedIn && user && user.id) {
      try {
        const res = await fetch('/api/highscore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id, 
            username: user.username || user.firstName || 'Anonymous',
            score 
          }),
        });
        if (!res.ok) {
          throw new Error('Failed to update high score and leaderboard');
        }
        const data = await res.json();
        setTopLeaderboard(data.leaderboard);
      } catch (error) {
        console.error("Failed to update high score and leaderboard:", error);
      }
    }
  };

  useEffect(() => {
    if (gameState === "gameover") {
      updateLeaderboard();
    }
  }, [gameState]);

  useEffect(() => {
    fetch('/api/highscore?leaderboard=true')
      .then(res => res.json())
      .then(data => {
        setTopLeaderboard(data.leaderboard);
      })
      .catch(error => {
        console.error("Error fetching leaderboard:", error);
      });
  }, []);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <div className="game-container">
        <Header />
        {isSignedIn ? (
          <div className="game-screen">
            {gameState === "splash" && (
              <StartScreen
                username={user?.firstName || user?.username || 'Anonymous'}
                highScore={highScore}
                startGame={startGame}
              />
            )}
            {gameState === "playing" && (
              <PlayingScreen
                score={score}
                timeLeft={timeLeft}
                currentProblem={currentProblem}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                handleAnswer={handleAnswer}
                handleKeyPress={handleKeyPress}
              />
            )}
            {gameState === "gameover" && (
              <GameOverScreen
                score={score}
                startGame={startGame}
                showLeaderboard={showLeaderboard}
                setShowLeaderboard={setShowLeaderboard}
                topLeaderboard={topLeaderboard}
              />
            )}
          </div>
        ) : (
          <div className="sign-in-screen">
            <h1 className="game-title">Matrix Math Game</h1>
            <p className="sign-in-text">Sign in to play</p>
          </div>
        )}
      </div>
      <style jsx global>{`
        body {
          background-color: #000;
          color: #0f0;
          font-family: 'Press Start 2P', cursive;
          line-height: 1.5;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .game-container {
          width: 100%;
          max-width: 800px;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .game-screen, .sign-in-screen {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .game-title {
          font-size: 2.5vw;
          text-align: center;
          margin-bottom: 20px;
        }
        .sign-in-text {
          font-size: 1.5vw;
          margin-top: 20px;
        }
        .retro-button {
          background-color: #000;
          color: #0f0;
          border: 2px solid #0f0;
          padding: 10px 20px;
          font-family: 'Press Start 2P', cursive;
          font-size: 16px;
          margin: 10px 0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .retro-button:hover {
          background-color: #0f0;
          color: #000;
        }
      `}</style>
    </>
  );
}