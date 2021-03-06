import { useRef, useEffect } from 'react';
import maze from './maze';

const getPixelRatio = (context: any) => {
    var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

    return (window.devicePixelRatio || 1) / backingStore;
};

const convertToCord = (n: number): number => {
    return n * 80 + 50;
};

const BLOCK_LENGHT = 78;
const BLOCK_WIDHT = 78;

const canMove = (x: number, y: number): boolean => {
    return maze[y][x] !== '#';
};

const didWin = (x: number, y: number): boolean => {
    return maze[y][x] === '!';
};
function Maze() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //to store the id generated by requestAnimationFrame
    const requestIDRef = useRef<number>(0);
    const renderOnce = useRef<boolean>(false);
    //for keeping the position of the sprite
    const sprite_x = useRef<number>(0);
    const sprite_y = useRef<number>(0);
    //for animating the sprite
    const sprite_x_cord = useRef<number>(0);
    const sprite_y_cord = useRef<number>(0);

    //Rendering the maze
    useEffect(() => {
        if (renderOnce.current) return;
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');

        let ratio = getPixelRatio(context);
        const canvasEle: Element = canvas
            ? canvas
            : document.createElement('canvas');
        /*@ts-ignore*/
        let width: number = getComputedStyle(canvasEle)
            .getPropertyValue('width')
            .slice(0, -2);
        /*@ts-ignore*/
        let height: number = getComputedStyle(canvasEle)
            .getPropertyValue('height')
            .slice(0, -2);

        if (canvas) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        const renderMaze = (
            context: CanvasRenderingContext2D | undefined | null
        ) => {
            if (!context) return;
            for (let i = 0; i < maze.length; i++) {
                for (let j = 0; j < maze[i].length; j++) {
                    const x: number = convertToCord(j);
                    const y: number = convertToCord(i);
                    switch (maze[i][j]) {
                        case '#':
                            context.fillStyle = '#000';
                            context.fillRect(x, y, BLOCK_LENGHT, BLOCK_WIDHT);
                            break;
                        case '.':
                            context.fillStyle = '#fff';
                            context.fillRect(x, y, BLOCK_LENGHT, BLOCK_WIDHT);
                            break;
                        case '_':
                            context.fillStyle = 'blue';
                            context.fillRect(x, y, BLOCK_LENGHT, BLOCK_WIDHT);
                            sprite_x.current = j;
                            sprite_y.current = i;
                            break;
                        case '!':
                            context.fillStyle = 'green';
                            context.fillRect(x, y, BLOCK_LENGHT, BLOCK_WIDHT);
                            break;
                    }
                }
            }
        };

        renderMaze(context);

        return () => {
            cancelAnimationFrame(requestIDRef.current);
        };
    }, []);

    const moveRight = () => {
        if (!canMove(sprite_x.current + 1, sprite_y.current)) {
            alert('cannot move right');
            return;
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');
        sprite_x_cord.current = convertToCord(sprite_x.current);
        sprite_y_cord.current = convertToCord(sprite_y.current);
        const target = convertToCord(sprite_x.current + 1);
        const move = () => {
            if (sprite_x_cord.current > target) {
                return;
            }
            requestIDRef.current = requestAnimationFrame(move);
            if (!context) return;
            context.clearRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
            sprite_x_cord.current += 1;
            context.fillStyle = 'blue';
            context.fillRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
        };
        sprite_x.current += 1;
        move();
        if (didWin(sprite_x.current, sprite_y.current)) {
            alert('You won');
        }
    };

    const moveLeft = () => {
        if (!canMove(sprite_x.current - 1, sprite_y.current)) {
            alert('cannot move left');
            return;
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');
        sprite_x_cord.current = convertToCord(sprite_x.current);
        sprite_y_cord.current = convertToCord(sprite_y.current);
        const target = convertToCord(sprite_x.current - 1);
        const move = () => {
            if (sprite_x_cord.current < target) {
                return;
            }
            requestIDRef.current = requestAnimationFrame(move);
            if (!context) return;
            context.clearRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
            sprite_x_cord.current -= 1;
            context.fillStyle = 'blue';
            context.fillRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
        };
        sprite_x.current -= 1;
        move();
        if (didWin(sprite_x.current, sprite_y.current)) {
            alert('You won');
        }
    };

    const moveDown = () => {
        if (!canMove(sprite_x.current, sprite_y.current + 1)) {
            alert('cannot move down');
            return;
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');
        sprite_x_cord.current = convertToCord(sprite_x.current);
        sprite_y_cord.current = convertToCord(sprite_y.current);
        const target = convertToCord(sprite_y.current + 1);
        const move = () => {
            if (sprite_y_cord.current > target) {
                return;
            }
            requestIDRef.current = requestAnimationFrame(move);
            if (!context) return;
            context.clearRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
            sprite_y_cord.current += 1;
            context.fillStyle = 'blue';
            context.fillRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
        };
        sprite_y.current += 1;
        move();
        if (didWin(sprite_x.current, sprite_y.current)) {
            alert('You won');
        }
    };

    const moveUp = () => {
        if (!canMove(sprite_x.current, sprite_y.current - 1)) {
            alert('cannot move up');
            return;
        }
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');
        sprite_x_cord.current = convertToCord(sprite_x.current);
        sprite_y_cord.current = convertToCord(sprite_y.current);
        const target = convertToCord(sprite_y.current - 1);
        const move = () => {
            if (sprite_y_cord.current < target) {
                return;
            }
            requestIDRef.current = requestAnimationFrame(move);
            if (!context) return;
            context.clearRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
            sprite_y_cord.current -= 1;
            context.fillStyle = 'blue';
            context.fillRect(
                sprite_x_cord.current,
                sprite_y_cord.current,
                BLOCK_LENGHT,
                BLOCK_WIDHT
            );
        };
        sprite_y.current -= 1;
        move();
        if (didWin(sprite_x.current, sprite_y.current)) {
            alert('You won');
        }
    };
    return (
        <div className="App">
            <h1>Maze</h1>
            <canvas
                ref={canvasRef}
                className="w-full h-full border-8 border-slate-900"></canvas>
            <div className="flex justify-between px-5 pt-2">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={moveUp}>
                    up
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={moveDown}>
                    down
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={moveLeft}>
                    left
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={moveRight}>
                    right
                </button>
            </div>
        </div>
    );
}

export default Maze;
