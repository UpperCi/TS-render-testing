import { GameButton, GameAnimatedImage, GameImage, GameObject, GameText, GameImgButton } from "./canvasObject.js";
import { Game } from "./game.js";
import { Vector } from "./vector.js";

export abstract class RenderEngine {
    public canvasSize: Vector = new Vector(160, 320);
	public fullScreen = false;
	public fsBtn: GameImgButton;
	public resMult = 1;
	public toHover = false;
	
	protected game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	public initFS() {
		window.addEventListener('resize', () => this.updateDisplaySize(!this.fullScreen));
		this.fsBtn = this.game.createImgButton("fullscreen.png", new Vector(134, 6), new Vector(32, 32), () => this.toggleFullscreen());
		let x = this.canvasSize.x - 40;
		this.fsBtn.position.x = x;
		this.fsBtn.zIndex = 100;
	}

	public start() {
		this.updateDisplaySize(!this.fullScreen);
	}

	private toggleFullscreen() { // thx W3schools: https://www.w3schools.com/howto/howto_js_fullscreen.asp
		let elem = document.documentElement;
		if (!this.fullScreen && elem.requestFullscreen) {
			elem.requestFullscreen();
			this.fullScreen = true;
			this.fsBtn.bgSrc = "unfullscreen.png";
		} else if (this.fullScreen && document.exitFullscreen) {
			document.exitFullscreen();
			this.fullScreen = false;
			this.fsBtn.bgSrc = "fullscreen.png";
		}
	}

    public addObj(obj: GameObject): void {
	}

	public updateDisplaySize(fs: boolean) {
	}

	public removeObj(obj: GameObject) {
	}

	public loop() {
	}

	public convert(v: Vector) : Vector {
		return v;
	}

	public convertN(n: number) : number {
		return this.convert(new Vector(n, 0)).x;
	}

	get gameObjects() : GameObject[] {
		return [];
	}
}

export class HTMLRenderEngine extends RenderEngine {
	private HTMLObjs: GameObject[] = [];
	private pixelated = false;

	constructor(game: Game, pixelated = false) {
		super(game);
		this.pixelated = pixelated;
	}

	public start(): void {
		super.start();
		if (this.pixelated) {
			this.game.gameElement.style.imageRendering = 'optimizeSpeed';
		} else {
			this.game.gameElement.style.imageRendering = 'optimizeQuality';
		}
		this.game.gameElement.style.backgroundColor = "#4b5bab";
		this.game.gameElement.style.position = "absolute";
		this.updateDisplaySize();
	}

	public addObj(obj: GameObject): void {
		this.HTMLObjs.push(obj);
		let div = obj.createDiv();
		div.classList.add('gameObject');
		obj.div = div;
		this.game.gameElement.appendChild(div);
	}

	public removeObj(obj: GameObject): void {
		obj.div.remove();
		let pos = this.HTMLObjs.indexOf(obj);
		this.HTMLObjs.splice(pos, 1);
	}

	public updateDisplaySize(doMargins = true) {
		let docSize = document.querySelector('html').getBoundingClientRect();
		let w = docSize.width;
		let h = docSize.height;

		let ratio = this.canvasSize.y / this.canvasSize.x;

		if (doMargins) {
			if (w * ratio > h) {
				h = h - this.game.margins;
				w = h / ratio;
			} else {
				w = w - this.game.margins / ratio;
				h = w * ratio;
			}
		} else {
			if (w * ratio > h) {
				h = h;
				w = h / ratio;
			} else {
				w = w;
				h = w * ratio;
			}
		}

		this.game.gameElement.style.left = `calc(50% - ${w / 2}px)`;
		this.game.gameElement.style.top = `calc(50% - ${h / 2}px)`;

		this.game.gameElement.style.height = `${h}px`;
		this.game.gameElement.style.width = `${w}px`;

		this.resMult = h / this.canvasSize.y;
		this.game.touch.resMult = this.resMult;
		let canvasBox = this.game.gameElement.getBoundingClientRect();
		this.game.touch.offset = new Vector(canvasBox.x, canvasBox.y);
	}

	public loop(): void {
		for (let obj of this.HTMLObjs) {
			obj.updateDiv(this.game);
		}
	}

	public convert(v: Vector) : Vector {
		return v.multiply(this.resMult);
	}

	get gameObjects() : GameObject[] {
		return this.HTMLObjs;
	}
}

export class CanvasRenderEngine extends RenderEngine {
	private ctx: CanvasRenderingContext2D;
	private canvasObjs: GameObject[][] = [];
	protected canvas: HTMLCanvasElement;

	constructor(game: Game) {
		super(game);
		this.canvas = document.createElement('canvas');
		game.gameElement.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d', { alpha: false });
	}
	
    public addObj(obj: GameObject): void {
		if (this.canvasObjs.length < obj.zIndex + 1) {
			this.canvasObjs[obj.zIndex] = [obj];
		} else {
			this.canvasObjs[obj.zIndex].push(obj);
		}
	}

	public removeObj(obj: GameObject): void {
		for (let i = 0; i < this.canvasObjs.length; i++) {
			if (this.canvasObjs[i] == undefined) {
				continue;
			}
			let pos = this.canvasObjs[i].indexOf(obj);
			if (pos != -1) {
				this.canvasObjs[i].splice(pos, 1);
			}
		}
	}

	public loop(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = '#4b5bab';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = 0; i < this.canvasObjs.length; i++) {
			if (this.canvasObjs[i] != undefined) {
				for (let j of this.canvasObjs[i]) {
					if (j.zIndex != i) {
						this.removeObj(j);
						if (this.canvasObjs.length < j.zIndex + 1 || this.canvasObjs[j.zIndex] === undefined) {
							this.canvasObjs[j.zIndex] = [j];
						} else {
							this.canvasObjs[j.zIndex].push(j);
						}
					}
				}
			}
		}

		for (let i of this.canvasObjs) {
			if (i != undefined) {
				for (let j of i) {
					j.drawCanvas(this.ctx, this.game);
				}
			}
		}
		if (this.game.touch.justMoved) {
            if (this.toHover) {
                this.game.gameElement.style.cursor = 'pointer';
            } else {
                this.game.gameElement.style.cursor = 'default';
            }
        }
		this.toHover = false;
	}

	public updateDisplaySize(doMargins = true): void {
		let docSize = document.querySelector('html').getBoundingClientRect();
		let w = docSize.width;
		let h = docSize.height;

		let ratio = this.canvasSize.y / this.canvasSize.x;

		if (doMargins) {
			if (w * ratio > h) {
				h = h - this.game.margins;
				w = h / ratio;
			} else {
				w = w - this.game.margins / ratio;
				h = w * ratio;
			}
		} else {
			if (w * ratio > h) {
				h = h;
				w = h / ratio;
			} else {
				w = w;
				h = w * ratio;
			}
		}

		this.canvas.width = w;
		this.canvas.height = h;

		this.canvas.style.height = `${h}px`;
		this.canvas.style.width = `${w}px`;

		this.game.touch.resMult = h / this.canvasSize.y;
		this.resMult = h / this.canvasSize.y;

		this.canvas.style.left = `calc(50% - ${w / 2}px)`;
		this.canvas.style.top = `calc(50% - ${h / 2}px)`;

		let canvasBox = this.canvas.getBoundingClientRect();
		this.game.touch.offset = new Vector(canvasBox.x, canvasBox.y);
	}

	public convert(v: Vector) : Vector {
		return v.multiply(this.resMult);
	}

	get gameObjects() : GameObject[] {
		let objs : GameObject[] = [];
		for (let i of this.canvasObjs) {
			if (!i) {
				continue;
			}
			for (let j of i) {
				objs.push(j);
			}
		}
		return objs;
	}
}

export class PixelCanvasRenderEngine extends CanvasRenderEngine {
	public updateDisplaySize(doMargins = true): void {
		let docSize = document.querySelector('html').getBoundingClientRect();
		let w = docSize.width;
		let h = docSize.height;

		let ratio = this.canvasSize.y / this.canvasSize.x;

		if (doMargins) {
			if (w * ratio > h) {
				h = h - this.game.margins;
				w = h / ratio;
			} else {
				w = w - this.game.margins / ratio;
				h = w * ratio;
			}
		} else {
			if (w * ratio > h) {
				h = h;
				w = h / ratio;
			} else {
				w = w;
				h = w * ratio;
			}

		}

		this.canvas.width = this.canvasSize.x;
		this.canvas.height = this.canvasSize.y;

		this.canvas.style.height = `${h}px`;
		this.canvas.style.width = `${w}px`;

		this.game.touch.resMult = h / this.canvasSize.y;
		this.resMult = h / this.canvasSize.y;

		this.canvas.style.left = `calc(50% - ${w / 2}px)`;
		this.canvas.style.top = `calc(50% - ${h / 2}px)`;

		let canvasBox = this.canvas.getBoundingClientRect();
		this.game.touch.offset = new Vector(canvasBox.x, canvasBox.y);
	}

	public convert(v: Vector) : Vector {
		return v;
	}
}
