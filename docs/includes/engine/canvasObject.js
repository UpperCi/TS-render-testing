import { Vector } from "./vector.js";
export class GameRect {
    constructor(pos, size, color) {
        this.visible = true;
        this.zIndex = 0;
        this.color = 'transparent';
        this.stroke = 'transparent';
        this.strokeWeight = 3;
        this.position = pos;
        this.size = size;
        this.color = color;
    }
    update(game) {
    }
    createDiv() {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        return div;
    }
    updateDiv(game) {
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
    drawCanvas(ctx, game) {
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
export class GamePolygon {
    constructor(points, color) {
        this.visible = true;
        this.zIndex = 0;
        this.stroke = 'transparent';
        this.strokeWeight = 3;
        this.color = 'transparent';
        this.points = [];
        this.points = points;
        this.color = color;
    }
    update(game) {
    }
    createDiv() {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        div.style.width = '100%';
        div.style.height = '100%';
        return div;
    }
    updateDiv(game) {
        if (this.visible) {
            let clipStr = 'polygon(';
            for (let i = 0; i < this.points.length; i += 2) {
                if (this.points.length - i < 1)
                    break;
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
            this.div.setAttribute('style', `${this.div.getAttribute('style')};-webkit-clip-path: ${clipStr}`);
        }
    }
    drawCanvas(ctx, game) {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(game.renderEngine.convertN(this.points[0]), game.renderEngine.convertN(this.points[1]));
            for (let i = 2; i < this.points.length; i += 2) {
                if (this.points.length - i < 1)
                    break;
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
    constructor(pos, radius, color) {
        this.visible = true;
        this.zIndex = 0;
        this.color = 'transparent';
        this.stroke = 'transparent';
        this.strokeWeight = 3;
        this.radius = 10;
        this.position = pos;
        this.radius = radius;
        this.color = color;
    }
    createDiv() {
        let div = document.createElement('div');
        div.style.backgroundColor = this.color;
        div.style.width = '100%';
        div.style.height = '100%';
        return div;
    }
    update(game) {
    }
    drawCanvas(ctx, game) {
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
    updateDiv(game) {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let r = game.renderEngine.convertN(this.radius);
            this.div.style.left = `${pos.x}px`;
            this.div.style.top = `${pos.y}px`;
            this.div.style.width = `${r * 2}px`;
            this.div.style.height = `${r * 2}px`;
            let clipStr = `ellipse(${r}px ${r}px at 50% 50%)`;
            this.div.style.clipPath = clipStr;
            this.div.setAttribute('style', `${this.div.getAttribute('style')};-webkit-clip-path: ${clipStr}`);
        }
    }
}
// source file drawn onto given position
export class GameImage {
    constructor(src, pos) {
        this.visible = true;
        this.zIndex = 0;
        this.sizeMod = 1;
        this.img = new Image();
        this.img.src = `assets/${src}`;
        ;
        this.position = pos;
    }
    createDiv() {
        let div = document.createElement('div');
        return div;
    }
    update(game) {
    }
    drawCanvas(ctx, game) {
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let img = game.renderEngine.convert(new Vector(this.img.width * this.sizeMod, this.img.height * this.sizeMod));
            ctx.drawImage(this.img, pos.x, pos.y, img.x, img.y);
        }
    }
    updateDiv(game) {
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
    constructor(src, w, pos, fps = 15, game, selfDestruct = false) {
        super(src, pos);
        this.currentFrame = 0;
        this.fpsTimer = 0;
        this.selfDestruct = false;
        this.frameWidth = w;
        this.frameTime = 60 / fps;
        this.selfDestruct = selfDestruct;
        this.frames = Math.floor(this.img.width / this.frameWidth);
        game.addUpdateObj(this);
    }
    update(game) {
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
                }
                else {
                    this.currentFrame = 0;
                }
            }
        }
    }
    drawCanvas(ctx, game) {
        let clipPos = this.currentFrame * this.frameWidth;
        if (this.visible) {
            let pos = game.renderEngine.convert(this.position);
            let img = game.renderEngine.convert(new Vector(this.frameWidth * this.sizeMod, this.img.height * this.sizeMod));
            ctx.drawImage(this.img, clipPos, 0, this.frameWidth, this.img.height, pos.x, pos.y, img.x, img.y);
        }
    }
    updateDiv(game) {
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
        let clipStr = `inset(${0}px ${right}px ${0}px ${clipPos}px)`;
        this.div.style.clipPath = clipStr;
        this.div.setAttribute('style', `${this.div.getAttribute('style')};-webkit-clip-path: ${clipStr}`);
    }
}
// text drawn onto canvas
export class GameText {
    constructor(text, pos) {
        this.visible = true;
        this.zIndex = 0;
        this.align = "start";
        this.font = "Arial";
        this.fallBack = "sans-serif";
        this.fontSize = 8;
        this.fill = "#fff";
        this.position = pos;
        this.text = text;
    }
    createDiv() {
        let div = document.createElement('div');
        div.style.fontSize = `${this.fontSize}px`;
        return div;
    }
    update(game) {
    }
    drawCanvas(ctx, game) {
        let pos = game.renderEngine.convert(this.position.add(new Vector(0, this.fontSize)));
        ctx.font = `${game.renderEngine.convertN(this.fontSize)}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text, pos.x, pos.y);
    }
    updateDiv(game) {
        let pos = game.renderEngine.convert(this.position);
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.fontSize = `${game.renderEngine.convertN(this.fontSize)}px`;
        this.div.style.fontFamily = `${this.font}, ${this.fallBack}`;
        this.div.innerText = this.text;
    }
}
export class GameCenterText extends GameText {
    constructor(text, pos, size) {
        super(text, pos);
        this.align = 'center';
        this.size = size;
    }
    createDiv() {
        let div = super.createDiv();
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        return div;
    }
    updateDiv(game) {
        let pos = game.renderEngine.convert(this.position.add(this.size.divide(2)));
        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;
        this.div.style.fontSize = `${game.renderEngine.convertN(this.fontSize)}px`;
        this.div.style.fontFamily = `${this.font}, ${this.fallBack}`;
        this.div.innerText = this.text;
    }
    drawCanvas(ctx, game) {
        let pos = game.renderEngine.convert(this.position.add(this.size.divide(2))
            .add(new Vector(0, this.fontSize / 2 - 1)));
        ctx.font = `${game.renderEngine.convertN(this.fontSize)}px ${this.font}`;
        ctx.textAlign = this.align;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text, pos.x, pos.y);
    }
}
// image drawn onto canvas, executes function if a click is detected within boundaries of button
export class GameButton {
    constructor(pos, size, game, effect) {
        this.visible = true;
        this.zIndex = 0;
        this.hover = false;
        this.cursorHover = true;
        this.position = pos;
        this.size = size;
        this.effect = effect;
        this.game = game;
        game.addUpdateObj(this);
    }
    createDiv() {
        let div = document.createElement('div');
        return div;
    }
    update(game) {
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
    posIn(v) {
        let p = this.position;
        let s = this.size;
        return (v.x > p.x && v.x < p.x + s.x && v.y > p.y && v.y < p.y + s.y);
    }
    checkHover(v) {
        this.hover = this.posIn(v);
    }
    drawCanvas(ctx, game) { }
    updateDiv(game) { }
}
export class GameImgButton extends GameButton {
    constructor(bgSrc, pos, size, game, effect) {
        super(pos, size, game, effect);
        this.bgSrc = bgSrc;
        this.img = new GameImage(`assets/${bgSrc}`, pos);
        game.addObj(this.img);
    }
    createDiv() {
        if (this.cursorHover) {
            this.img.div.style.cursor = 'pointer';
        }
        return super.createDiv();
    }
    update(game) {
        super.update(game);
        if (this.hover && this.hoverSrc != undefined) {
            this.img.img.src = `assets/${this.hoverSrc}`;
        }
        else {
            this.img.img.src = `assets/${this.bgSrc}`;
        }
    }
}
export class GameRectButton extends GameButton {
    constructor(pos, size, game, effect, text, col) {
        super(pos, size, game, effect);
        this.baseColor = col;
        this.hoverColor = col;
        this.textStr = text;
        this.rect = game.createRect(pos, size, col);
        this.text = new GameCenterText(text, pos, size);
        game.addObj(this.text);
        game.addObj(this);
    }
    createDiv() {
        if (this.cursorHover) {
            this.rect.div.style.cursor = 'pointer';
        }
        return super.createDiv();
    }
    updateDiv(game) {
        super.updateDiv(game);
    }
    update(game) {
        super.update(game);
        if (this.hover) {
            this.rect.color = this.hoverColor;
        }
        else {
            this.rect.color = this.baseColor;
        }
        this.text.text = this.textStr;
    }
}
