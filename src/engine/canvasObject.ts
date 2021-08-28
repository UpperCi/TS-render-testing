import { Game } from "./game.js";
import { Vector } from "./vector.js";

export interface GameObject {
    visible: boolean;
    zIndex: number;
    div: HTMLElement;
    drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void;
    update(game: Game): void
    createDiv(): HTMLElement;
    updateDiv(game: Game): void;
}

export class GameRect implements GameObject {
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;
    
    public position: Vector;
    public size: Vector;
    public color: string = 'transparent';
    public stroke: string = 'transparent';
    public strokeWeight: number = 3;

    constructor(pos: Vector, size: Vector, color: string) {
        this.position = pos;
        this.size = size;
        this.color = color;
    }

    update(game: Game): void {

    }

    createDiv(): HTMLElement {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        return div;
    }

    updateDiv(game: Game): void {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let size = game.renderEngine.convert(this.size);
            this.div.style.left = `${pos.x}px`;
            this.div.style.top = `${pos.y}px`;
            this.div.style.width = `${size.x}px`;
            this.div.style.height = `${size.y}px`;
            let w = game.renderEngine.convertN(this.strokeWeight);
            this.div.style.border = `${w}px solid ${this.stroke}`;
            this.div.style.backgroundColor = this.color;
        }
    }

    drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let size = game.renderEngine.convert(this.size);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.stroke;
            ctx.lineWidth = game.renderEngine.convertN(this.strokeWeight);
            ctx.fillRect(pos.x, pos.y, size.x, size.y);
            ctx.strokeRect(pos.x, pos.y, size.x, size.y);
        }
    }
}
/* to-do:
* fix border on HTML. Bigger parent element w/ border color? 
* fix border on Canvas. Outline last line.
*/
export class GamePolygon implements GameObject { 
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;
    public stroke: string = 'transparent';
    public strokeWeight: number = 3;

    public color: string = 'transparent';
    public points: number[] = [];

    constructor(points: number[], color: string) {
        this.points = points;
        this.color = color;
    }

    update(game: Game): void {

    }

    createDiv(): HTMLElement {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        div.style.width = '100%';
        div.style.height = '100%';
        return div;
    }

    updateDiv(game: Game): void {
        if (this.visible) {
            let clipStr = 'polygon(';
            for (let i = 0; i < this.points.length; i += 2) {
                if (this.points.length - i < 1) break;
                if (clipStr != 'polygon(') {
                    clipStr += ', ';
                }
                let x = game.renderEngine.convertN(this.points[i]);
                let y = game.renderEngine.convertN(this.points[i + 1]);
                clipStr += `${x}px ${y}px`;
                let w = game.renderEngine.convertN(this.strokeWeight);
                this.div.style.border = `${w}px solid ${this.stroke}`;
            }
            this.div.style.clipPath = `${clipStr})`;
        }
    }

    drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(game.renderEngine.convertN(this.points[0]), game.renderEngine.convertN(this.points[1]));
            for (let i = 2; i < this.points.length; i += 2) {
                if (this.points.length - i < 1) break;
                let x = game.renderEngine.convertN(this.points[i]);
                let y = game.renderEngine.convertN(this.points[i + 1]);
                ctx.lineTo(x, y);
            }
            ctx.closePath;
            ctx.fill();
            ctx.lineWidth = game.renderEngine.convertN(this.strokeWeight);
            ctx.strokeStyle = this.stroke;
            ctx.stroke();
        }
    }
}

export class GameCircle {
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;

    public color: string = 'transparent';
    public stroke: string = 'transparent';
    public strokeWeight: number = 3;
    public position: Vector;
    public radius: number = 10;

    constructor(pos: Vector, radius: number, color: string) {
        this.position = pos;
        this.radius = radius;
        this.color = color;
    }

    public createDiv(): HTMLElement {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        div.style.width = '100%';
        div.style.height = '100%';
        return div;
    }

    public update(game: Game): void {
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position.add(new Vector(this.radius, this.radius)));
            let r = game.renderEngine.convertN(this.radius);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.lineWidth = game.renderEngine.convertN(this.strokeWeight);
            ctx.strokeStyle = this.stroke;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
        }
    }

    public updateDiv(game: Game): void {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let r = game.renderEngine.convertN(this.radius);
            this.div.style.left = `${pos.x}px`;
            this.div.style.top = `${pos.y}px`;
            this.div.style.width = `${r * 2}px`;
            this.div.style.height = `${r * 2}px`;
            this.div.style.clipPath = `ellipse(${r}px ${r}px at 50% 50%)`;
        }
    }
}

// source file drawn onto given position
export class GameImage implements GameObject {
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;

    public position: Vector;
    public img: HTMLImageElement;
    public sizeMod: number = 1;

    constructor(src: string, pos: Vector) {
        this.img = new Image();
        this.img.src = `assets/${src}`;;
        this.position = pos;
    }

    public createDiv(): HTMLElement {
        let div = document.createElement('div');
        return div;
    }

    public update(game: Game): void {
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let img = game.renderEngine.convert(new Vector(this.img.width * this.sizeMod, this.img.height * this.sizeMod));
            ctx.drawImage(this.img, pos.x, pos.y, img.x, img.y);
        }
    }

    public updateDiv(game: Game): void {
        let pos = game.renderEngine.convert(this.position);
        let img = game.renderEngine.convert(new Vector(this.img.width * this.sizeMod, this.img.height * this.sizeMod));
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.width = `${img.x}px`;
        this.div.style.height = `${img.y}px`;
        this.div.style.backgroundImage = `url(${this.img.src})`;
    }
}

// aniamted images through spritesheets. Only supports horizontal spritesheets where all sprites are the same size
export class GameAnimatedImage extends GameImage {
    // width of singular frame
    private frameWidth: number;
    private currentFrame: number = 0;
    protected frameTime: number;
    private fpsTimer: number = 0;
    private frames: number;
    private selfDestruct = false;

    constructor(src: string, w: number, pos: Vector, fps: number = 15, game: Game , selfDestruct = false) {
        super(src, pos);
        this.frameWidth = w;
        this.frameTime = 60 / fps;
        this.selfDestruct = selfDestruct;
        this.frames = Math.floor(this.img.width / this.frameWidth);
        game.addUpdateObj(this);
    }

    public update(game: Game): void {
        this.fpsTimer += game.delta;
        if (this.fpsTimer > this.frameTime) {
            this.fpsTimer -= this.frameTime;
            if (this.fpsTimer > this.frameTime) {
                this.fpsTimer = this.frameTime;
            }
            this.currentFrame++;
            if (this.currentFrame >= this.frames) {
                if (this.selfDestruct) {
                    game.removeObj(this);
                } else {
                    this.currentFrame = 0;
                }
            }
        }
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        let clipPos = this.currentFrame * this.frameWidth;
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let img = game.renderEngine.convert(
                new Vector(this.frameWidth * this.sizeMod, this.img.height * this.sizeMod));
            ctx.drawImage(this.img, clipPos, 0, 
                this.frameWidth, this.img.height,  pos.x, pos.y, img.x, img.y);
        }
    }

    public updateDiv(game: Game): void {
        let clipPos = this.currentFrame * this.frameWidth;
        let pos = game.renderEngine.convert(this.position.subtract(new Vector(clipPos, 0)));
        let img = game.renderEngine.convert(new Vector(this.img.width * this.sizeMod, this.img.height * this.sizeMod));
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.width = `${img.x}px`;
        this.div.style.height = `${img.y}px`;
        this.div.style.backgroundImage = `url(${this.img.src})`;
        clipPos = game.renderEngine.convertN(clipPos);
        let right = img.x - clipPos - game.renderEngine.convertN(this.frameWidth);
        this.div.style.clipPath = `inset(${0}px ${right}px ${0}px ${clipPos}px)`;
    }
}

// text drawn onto canvas
export class GameText implements GameObject {
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;
    public game: Game;
    
    public position: Vector;
    public text: string;
    public align: CanvasTextAlign = "start";
    public font: string = "Arial";
    public fallBack: string = "sans-serif";
    public fontSize: number = 8;
    public fill: string = "#fff";

    constructor(text: string, pos: Vector) {
        this.position = pos;
        this.text = text;
    }

    public createDiv(): HTMLElement {
        let div = document.createElement('div');
        div.style.fontSize = `${this.fontSize}px`;
        return div;
    }

    public update(game: Game): void {
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        let pos = game.renderEngine.convert(this.position.add(new Vector(0, this.fontSize)));
        ctx.font = `${game.renderEngine.convertN(this.fontSize)}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text, pos.x, pos.y);
    }

    public updateDiv(game: Game): void {
        let pos = game.renderEngine.convert(this.position);
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.fontSize = `${game.renderEngine.convertN(this.fontSize)}px`;
        this.div.style.fontFamily = `${this.font}, ${this.fallBack}`;
        this.div.innerText = this.text;
    }
}

export class GameCenterText extends GameText { // jank
    public size: Vector;    

    constructor(text: string, pos: Vector, size: Vector) {
        super(text, pos)
        this.align = 'center';
        this.size = size;
    }

    public createDiv(): HTMLElement {
        let div = super.createDiv();
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        return div;
    }

    public updateDiv(game: Game): void {
        let pos = game.renderEngine.convert(this.position.add(this.size.divide(2)));
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.fontSize = `${game.renderEngine.convertN(this.fontSize)}px`;
        this.div.style.fontFamily = `${this.font}, ${this.fallBack}`;
        this.div.innerText = this.text;
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {
        let pos = game.renderEngine.convert(this.position.add(this.size.divide(2))
        .add(new Vector(0, this.fontSize / 2 - 1)));
        ctx.font = `${game.renderEngine.convertN(this.fontSize)}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text, pos.x, pos.y);
    }
}

// image drawn onto canvas, executes function if a click is detected within boundaries of button
export class GameButton implements GameObject {
    public visible: boolean = true;
    public zIndex: number = 0;
    public div: HTMLElement;

    public game: Game;
    public position: Vector;

    private size: Vector;
    public effect: () => void;

    public hover = false;

    public cursorHover: boolean = true;
    
    constructor(pos: Vector, size: Vector, game: Game, effect: () => void) {
        this.position = pos;
        this.size = size;
        this.effect = effect;
        this.game = game;
        game.addUpdateObj(this);
    }

    public createDiv(): HTMLElement {
        let div = document.createElement('div');
        return div;
    }

    public update(game: Game): void {
        if (game.touch.justMoved) {
            this.checkHover(game.touch.lastMove);
            if (this.cursorHover && !game.renderEngine.toHover && this.hover) {
                game.renderEngine.toHover = true;
            }
        }
        if (game.touch.justTapped && this.posIn(game.touch.lastTap)) {
            this.effect();
        }
    }

    public posIn(v: Vector) : boolean {
        let p = this.position;
        let s = this.size;
        return (v.x > p.x && v.x < p.x + s.x && v.y > p.y && v.y < p.y + s.y);
    }

    public checkHover(v: Vector) : void {
        this.hover = this.posIn(v);
    }

    public drawCanvas(ctx: CanvasRenderingContext2D, game: Game) : void {}

    public updateDiv(game: Game): void {}
} 

export class GameImgButton extends GameButton {
    public bgSrc: string;
    public hoverSrc: string;

    public img: GameImage;

    constructor(bgSrc: string, pos: Vector, size: Vector, game: Game, effect: () => void) {
        super (pos, size, game, effect);
        this.bgSrc = bgSrc;
        this.img = new GameImage(`assets/${bgSrc}`, pos);
        game.addObj(this.img);
    }

    public createDiv(): HTMLElement {
        if (this.cursorHover) {
            this.img.div.style.cursor = 'pointer';
        }
        return super.createDiv();
    }

    public update(game: Game): void {
        super.update(game);
        if (this.hover && this.hoverSrc != undefined) {
            this.img.img.src = `assets/${this.hoverSrc}`;
        } else {
            this.img.img.src = `assets/${this.bgSrc}`;
        }
    }
}

export class GameRectButton extends GameButton {
    public rect: GameRect;
    public text: GameCenterText;

    public baseColor: string;
    public hoverColor: string;

    public textStr: string;

    constructor(pos: Vector, size: Vector, game: Game, effect: () => void, text: string, col: string) {
        super(pos, size, game, effect);
        this.baseColor = col;
        this.hoverColor = col;
        this.textStr = text;
        this.rect = game.createRect(pos, size, col);
        this.text = new GameCenterText(text, pos, size);
        game.addObj(this.text);
        game.addObj(this);
    }

    public createDiv(): HTMLElement {
        if (this.cursorHover) {
            this.rect.div.style.cursor = 'pointer';
        }
        return super.createDiv();
    }

    public updateDiv(game: Game) {
        super.updateDiv(game);
    }

    public update(game: Game) {
        super.update(game);
        if (this.hover) {
            this.rect.color = this.hoverColor;
        } else {
            this.rect.color = this.baseColor;
        }
        this.text.text = this.textStr;
    }
}
