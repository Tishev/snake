import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

const App = () => {
    const localStorageKey = 'snakeGameRecord';

    const generateFood = () => {
        const newFood = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
        };
        return newFood;
    };

    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(generateFood());
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [record, setRecord] = useState(0);
    const [yourPoint, setYourPoint] = useState(0);

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    setDirection('UP');
                    break;
                case 'ArrowDown':
                    setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    setDirection('LEFT');
                    break;
                case 'ArrowRight':
                    setDirection('RIGHT');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const savedRecord = localStorage.getItem(localStorageKey);
        if (savedRecord) {
            setRecord(Number(savedRecord));
        }
    }, []);

    useEffect(() => {
        const moveSnake = () => {
            const newSnake = [...snake];
            const head = { ...newSnake[0] };

            switch (direction) {
                case 'UP':
                    head.y -= 1;
                    break;
                case 'DOWN':
                    head.y += 1;
                    break;
                case 'LEFT':
                    head.x -= 1;
                    break;
                case 'RIGHT':
                    head.x += 1;
                    break;
                default:
                    break;
            }

            newSnake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                setFood(generateFood());
            } else {
                newSnake.pop();
            }
            setYourPoint(newSnake.length);
            checkCollision(newSnake);
            setSnake(newSnake);

            if (newSnake.length > record) {
                setRecord(newSnake.length);
                localStorage.setItem(localStorageKey, newSnake.length);
            }
        };

        const gameInterval = setInterval(moveSnake, 200);

        return () => {
            clearInterval(gameInterval);
        };
    }, [snake, direction, gameOver, food, record]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem(localStorageKey, record);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [record]);

    const checkCollision = (snake) => {
        const head = snake[0];

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            setGameOver(true);
        }

        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                setGameOver(true);
                break;
            }
        }
    };

    const handleButtonClick = (buttonDirection) => {
        setDirection(buttonDirection);
    };

    return (
        <div className="block">
            {gameOver ? (
                <div className="block-retry">
                    <h1 className="record">Рекорд: {record}</h1>
                    <h1 className="record">Вы набрали: {yourPoint}</h1>

                    <p className="title">Game Over!</p>
                    <button onClick={() => window.location.reload()} className="btn">
                        Повторить
                    </button>
                </div>
            ) : (
                <div className="desc">
                    <h1 className="record">Вы набрали: {yourPoint}</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 20px)' }}>
                        {Array.from({ length: 400 }).map((_, index) => {
                            const x = index % 20;
                            const y = Math.floor(index / 20);
                            const isSnake = snake.some((part) => part.x === x && part.y === y);
                            const isFood = food.x === x && food.y === y;

                            return (
                                <div
                                    key={index}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '1px solid #ccc',
                                        backgroundColor: isSnake
                                            ? 'green'
                                            : isFood
                                            ? 'red'
                                            : 'white',
                                        borderRadius: isSnake ? '50%' : isFood ? 0 : 0,
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="block-btn">
                        <button className="up btn-upr" onClick={() => handleButtonClick('UP')}>
                            <ArrowUpwardIcon />
                        </button>
                        <div className="block-btn__down">
                            <button
                                className="left btn-upr"
                                onClick={() => handleButtonClick('LEFT')}
                            >
                                <WestIcon />
                            </button>
                            <button
                                className="down btn-upr"
                                onClick={() => handleButtonClick('DOWN')}
                            >
                                <ArrowDownwardIcon />
                            </button>
                            <button
                                className="right btn-upr"
                                onClick={() => handleButtonClick('RIGHT')}
                            >
                                <EastIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
