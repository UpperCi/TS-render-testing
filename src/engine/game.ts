import { GameButton, GameAnimatedImage, GameImage, GameObject, GameText, GameImgButton, GameRect, GamePolygon, GameCircle } from "./canvasObject.js";
import { CanvasRenderEngine, HTMLRenderEngine, PixelCanvasRenderEngine, RenderEngine } from "./renderEngine.js";
import { TouchManager } from "./touchManager.js";
import { Vector } from "./vector.js";

export enum RENDERTYPES {
	HTML,
	pixelHTML,
	canvas,
	pixelCanvas
}

export class Game {
	public gameElement: HTMLElement;
	public touch: TouchManager;
	public renderEngine: RenderEngine;
	public startFunc: () => void;

	public renderType: RENDERTYPES = RENDERTYPES.canvas;

	public margins = 64;

	public deltaTimestamp = 0
	public delta = 0;
	private frameCounter = 0;
	private frameTimer = 0;
	public frameRate = 0;
	private frameText: GameText;

	private updateObjs: [{update: (game: Game) => void}] = [{update: () => {}}];

	constructor() {
		this.touch = new TouchManager();
		this.touch.initListeners();
	}

	public start(): void {
		this.gameElement = document.querySelector('game');
		if (this.renderType === RENDERTYPES.pixelCanvas) {
			this.renderEngine = new PixelCanvasRenderEngine(this);
		} else if (this.renderType === RENDERTYPES.canvas) {
			this.renderEngine = new CanvasRenderEngine(this);
		} else if (this.renderType === RENDERTYPES.HTML) {
			this.renderEngine = new HTMLRenderEngine(this);
		} else if (this.renderType === RENDERTYPES.pixelHTML) {
			this.renderEngine = new HTMLRenderEngine(this, true);
		}
		this.renderEngine.start();
		this.renderEngine.initFS();
		this.startFunc();
		this.frameText = this.createText('10', new Vector(4, 4));
		this.frameText.fontSize = 8;
		requestAnimationFrame((ms: number) => this.loop(ms));
	}

	private updateFrames(ms: number): void {
		this.delta = (ms - this.deltaTimestamp) / 1000 * 60;
		this.deltaTimestamp = ms;

		this.frameTimer += this.delta / 60;
		this.frameCounter++;
		if (this.frameTimer > 1) {
			this.frameTimer -= 1;
			this.frameRate = this.frameCounter;
			this.frameCounter = 0;
		}
		this.frameText.text = this.frameRate.toString();
	}

	private loop(ms: number): void {
		this.updateFrames(ms);

		for (let obj of this.updateObjs) {
			obj.update(this);
		}

		this.renderEngine.loop();

		this.touch.update();

		requestAnimationFrame((ms: number) => this.loop(ms));
	}

	public addUpdateObj(obj: {update: (game: Game) => void}): void {
		this.updateObjs.push(obj);
	}

	public removeUpdateObj(obj: {update: (game: Game) => void}): void {
		let pos = this.updateObjs.indexOf(obj);
		if (pos != -1) {
			this.updateObjs.splice(pos, 1);
		}
	}

    public addObj(obj: GameObject): void {
		this.renderEngine.addObj(obj);
	}

	public removeObj(obj: GameObject) {
		this.renderEngine.removeObj(obj);
	}

	// create an animated image from a spritesheet
	public createAnimatedImage(src: string, w: number, pos: Vector, fps: number = 15, selfDestruct = false): GameAnimatedImage {
		let anim = new GameAnimatedImage(src, w, pos, fps, this, selfDestruct);
		this.addObj(anim);

		return anim;
	}

	// creates an image object that will be rendered at given position
	public createImage(src: string, pos: Vector): GameImage {
		let image = new GameImage(src, pos);
		this.addObj(image);

		return image;
	}

	public createText(str: string, pos: Vector): GameText {
		let text = new GameText(str, pos);
		this.addObj(text);

		return text;
	}

	public createButton(bgSrc: string, pos: Vector, size: Vector, effect: () => void): GameButton {
		let button = new GameButton(pos, size, this, effect);
		this.addObj(button);

		return button;
	}

	public createImgButton(bgSrc: string, pos: Vector, size: Vector, effect: () => void): GameImgButton {
		let button = new GameImgButton(bgSrc, pos, size, this, effect);
		this.addObj(button);

		return button;
	}

	public createRect(pos: Vector, size: Vector, col: string): GameRect {
		let rect = new GameRect(pos, size, col);
		this.addObj(rect);

		return rect;
	}

	public createPoly(path: number[], col: string): GamePolygon {
		let poly = new GamePolygon(path, col);
		this.addObj(poly);

		return poly;
	}

	public createCircle(pos: Vector, rad: number, col: string): GameCircle {
		let circle = new GameCircle(pos, rad, col);
		this.addObj(circle)

		return circle;
	}
}
