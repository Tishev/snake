import React, { useState, useEffect } from 'react';

const App = () => {
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
        if (gameOver) return;

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

            checkCollision(newSnake);
            setSnake(newSnake);
        };

        const gameInterval = setInterval(moveSnake, 200);

        return () => {
            clearInterval(gameInterval);
        };
    }, [snake, direction, gameOver, food]);

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

    return (
        <div className="block">
            {gameOver ? (
                <div className="block-retry">
                    <p className="title">Game Over!</p>
                    <button onClick={() => window.location.reload()} className="btn">
                        Повторить
                    </button>
                </div>
            ) : (
                <div className="desc">
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
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
