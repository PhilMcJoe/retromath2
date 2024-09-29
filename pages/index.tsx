import { useState, useEffect } from "react";
import localFont from "next/font/local";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = "splash" | "login" | "difficulty" | "playing" | "gameover";
type LeaderboardEntry = { username: string; score: number };
type Leaderboards = Record<Difficulty, LeaderboardEntry[]>;

const difficultySettings = {
  easy: { initialTime: 60, timeBonus: 3 },
  medium: { initialTime: 45, timeBonus: 2 },
  hard: { initialTime: 30, timeBonus: 1 },
};

const initialLeaderboards: Leaderboards = {
  easy: [],
  medium: [],
  hard: [],
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("splash");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(difficultySettings.medium.initialTime);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [leaderboards, setLeaderboards] = useState<Leaderboards>(initialLeaderboards);

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
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      case '/':
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 10) + 1;
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
      setTimeLeft(time => Math.min(time + difficultySettings[difficulty].timeBonus, difficultySettings[difficulty].initialTime));
      generateProblem();
    } else {
      setTimeLeft(time => Math.max(time - 5, 0));
    }
    setUserAnswer("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (gameState === "login") {
        handleLogin();
      } else if (gameState === "playing") {
        handleAnswer();
      }
    }
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState("playing");
    setScore(0);
    setTimeLeft(difficultySettings[selectedDifficulty].initialTime);
  };

  const handleLogin = () => {
    if (username.trim() !== "") {
      setLoggedInUser(username);
      setGameState("difficulty");
    } else {
      alert("Please enter a valid username");
    }
  };

  const updateLeaderboard = () => {
    setLeaderboards(prevLeaderboards => {
      const newLeaderboard = [...prevLeaderboards[difficulty], { username: loggedInUser, score }];
      newLeaderboard.sort((a, b) => b.score - a.score);
      return {
        ...prevLeaderboards,
        [difficulty]: newLeaderboard.slice(0, 5)
      };
    });
  };

  useEffect(() => {
    if (gameState === "gameover") {
      updateLeaderboard();
    }
  }, [gameState]);

  const renderLeaderboard = () => (
    <div className="mt-8">
      <h3 className="text-2xl mb-4">Leaderboard ({difficulty})</h3>
      <ol className="list-decimal list-inside">
        {leaderboards[difficulty].map((entry, index) => (
          <li key={index} className="mb-2">
            {entry.username}: {entry.score}
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className={`${geistMono.variable} font-mono min-h-screen bg-black text-green-500 p-8 relative overflow-hidden`}>
      {gameState === "splash" && (
        <div className="flex flex-col items-center justify-center h-screen relative z-10">
          <h1 className="text-4xl mb-8 animate-pulse">Matrix Math Challenge</h1>
          <button
            className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors mb-4"
            onClick={() => setGameState("login")}
          >
            Enter the Matrix
          </button>
        </div>
      )}

      {gameState === "login" && (
        <div className="flex flex-col items-center justify-center h-screen relative z-10">
          <h2 className="text-3xl mb-8">Login</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-black border border-green-500 text-green-500 px-4 py-2 mb-4"
            placeholder="Username"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-black border border-green-500 text-green-500 px-4 py-2 mb-4"
            placeholder="Password"
          />
          <button
            className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors mb-4"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      )}

      {gameState === "difficulty" && (
        <div className="flex flex-col items-center justify-center h-screen relative z-10">
          <h2 className="text-3xl mb-8">Welcome, {loggedInUser}!</h2>
          <h3 className="text-2xl mb-8">Select Difficulty</h3>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors mb-4 w-48"
              onClick={() => startGame(diff)}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      )}

      {gameState === "playing" && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl mb-4">Player: {loggedInUser}</h2>
          <h2 className="text-2xl mb-4">Score: {score}</h2>
          <h3 className="text-xl mb-4">Time Left: {timeLeft}s</h3>
          <p className="text-3xl mb-4">{currentProblem.question}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-black border border-green-500 text-green-500 px-4 py-2 mb-4"
            placeholder="Enter your answer"
            autoFocus
          />
          <button
            className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
            onClick={handleAnswer}
          >
            Submit
          </button>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl mb-8">Game Over, {loggedInUser}</h1>
          <p className="text-2xl mb-4">Final Score: {score}</p>
          {renderLeaderboard()}
          <button
            className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors mb-4 mt-8"
            onClick={() => setGameState("difficulty")}
          >
            Play Again
          </button>
          <button
            className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors mb-4"
            onClick={() => {
              setLoggedInUser("");
              setGameState("login");
            }}
          >
            Logout
          </button>
        </div>
      )}

      <footer className="fixed bottom-4 left-0 right-0 text-center z-10">
        <p>More math topics coming soon...</p>
      </footer>
    </div>
  );
}