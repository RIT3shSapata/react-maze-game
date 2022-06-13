import React, { useEffect, useRef } from 'react';
import sprite from '../../Assets/sprite.png';

const SPRITE_SHEET_WIDTH = 864;
const SPRITE_SHEET_HEIGHT = 280;
const TRACK_RIGHT = 0;
const TRACK_LEFT = 1;
const COLS = 8;
const ROWS = 2;
const FRAMECOUNT = 8;
const WIDTH = SPRITE_SHEET_WIDTH / COLS;
const HEIGHT = SPRITE_SHEET_HEIGHT / ROWS;

const updateFrame = (curFrame: any, srcX: any) => {
    curFrame.current = (curFrame.current + 1) % FRAMECOUNT;
    srcX.current = curFrame.current * WIDTH;
};
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

const Sprite = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestIDRef = useRef<number>(0);
    const renderOnce = useRef<boolean>(false);

    const curFrame = useRef<number>(0);
    const srcX = useRef<number>(0);
    const srcY = useRef<number>(0);
    const spriteX = useRef<number>(50);
    const spriteY = useRef<number>(50);

    const character = new Image();
    character.src = sprite;
    useEffect(() => {
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

        if (!context) return;
        const draw = () => {
            updateFrame(curFrame, srcX);
            context.drawImage(
                character,
                srcX.current,
                srcY.current,
                WIDTH,
                HEIGHT,
                spriteX.current,
                spriteY.current,
                WIDTH,
                HEIGHT
            );
        };
        draw();
    }, []);

    const moveRight = () => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | undefined | null =
            canvas?.getContext('2d');
        const target = spriteX.current + 96;
        const move = () => {
            if (spriteX.current > target) {
                return;
            }

            requestIDRef.current = requestAnimationFrame(move);
            updateFrame(curFrame, srcX);
            context?.clearRect(spriteX.current, spriteY.current, WIDTH, HEIGHT);
            spriteX.current += 1;
            context?.drawImage(
                character,
                srcX.current,
                srcY.current,
                WIDTH,
                HEIGHT,
                spriteX.current,
                spriteY.current,
                WIDTH,
                HEIGHT
            );
        };
        move();
    };

    const moveLeft = () => {
        console.log('moveLeft');
    };
    return (
        <div>
            <h1>Maze</h1>
            <canvas
                ref={canvasRef}
                className="w-full h-full border-8 border-slate-900"></canvas>
            <div className="flex justify-between px-5 pt-2">
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
};

export default Sprite;
