import { GameButton, GameAnimatedImage, GameImage, GameText, GameImgButton, GameRect, GamePolygon, GameCircle } from "./canvasObject.js";
import { CanvasRenderEngine, HTMLRenderEngine, PixelCanvasRenderEngine } from "./renderEngine.js";
import { TouchManager } from "./touchManager.js";
import { Vector } from "./vector.js";
export var RENDERTYPES;
(function (RENDERTYPES) {
    RENDERTYPES[RENDERTYPES["HTML"] = 0] = "HTML";
    RENDERTYPES[RENDERTYPES["pixelHTML"] = 1] = "pixelHTML";
    RENDERTYPES[RENDERTYPES["canvas"] = 2] = "canvas";
    RENDERTYPES[RENDERTYPES["pixelCanvas"] = 3] = "pixelCanvas";
})(RENDERTYPES || (RENDERTYPES = {}));
export class Game {
    constructor() {
        this.renderType = RENDERTYPES.canvas;
        this.margins = 64;
        this.deltaTimestamp = 0;
        this.delta = 0;
        this.frameCounter = 0;
        this.frameTimer = 0;
        this.frameRate = 0;
        this.updateObjs = [{ update: () => { } }];
        this.touch = new TouchManager();
        this.touch.initListeners();
    }
    start() {
        this.gameElement = document.querySelector('game');
        if (this.renderType === RENDERTYPES.pixelCanvas) {
            this.renderEngine = new PixelCanvasRenderEngine(this);
        }
        else if (this.renderType === RENDERTYPES.canvas) {
            this.renderEngine = new CanvasRenderEngine(this);
        }
        else if (this.renderType === RENDERTYPES.HTML) {
            this.renderEngine = new HTMLRenderEngine(this);
        }
        else if (this.renderType === RENDERTYPES.pixelHTML) {
            this.renderEngine = new HTMLRenderEngine(this, true);
        }
        this.renderEngine.start();
        this.renderEngine.initFS();
        this.startFunc();
        this.frameText = this.createText('10', new Vector(4, 4));
        this.frameText.fontSize = 8;
        requestAnimationFrame((ms) => this.loop(ms));
    }
    updateFrames(ms) {
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
    loop(ms) {
        this.updateFrames(ms);
        for (let obj of this.updateObjs) {
            obj.update(this);
        }
        this.renderEngine.loop();
        this.touch.update();
        requestAnimationFrame((ms) => this.loop(ms));
    }
    addUpdateObj(obj) {
        this.updateObjs.push(obj);
    }
    removeUpdateObj(obj) {
        let pos = this.updateObjs.indexOf(obj);
        if (pos != -1) {
            this.updateObjs.splice(pos, 1);
        }
    }
    addObj(obj) {
        this.renderEngine.addObj(obj);
    }
    removeObj(obj) {
        this.renderEngine.removeObj(obj);
    }
    // create an animated image from a spritesheet
    createAnimatedImage(src, w, pos, fps = 15, selfDestruct = false) {
        let anim = new GameAnimatedImage(src, w, pos, fps, this, selfDestruct);
        this.addObj(anim);
        return anim;
    }
    // creates an image object that will be rendered at given position
    createImage(src, pos) {
        let image = new GameImage(src, pos);
        this.addObj(image);
        return image;
    }
    createText(str, pos) {
        let text = new GameText(str, pos);
        this.addObj(text);
        return text;
    }
    createButton(bgSrc, pos, size, effect) {
        let button = new GameButton(pos, size, this, effect);
        this.addObj(button);
        return button;
    }
    createImgButton(bgSrc, pos, size, effect) {
        let button = new GameImgButton(bgSrc, pos, size, this, effect);
        this.addObj(button);
        return button;
    }
    createRect(pos, size, col) {
        let rect = new GameRect(pos, size, col);
        this.addObj(rect);
        return rect;
    }
    createPoly(path, col) {
        let poly = new GamePolygon(path, col);
        this.addObj(poly);
        return poly;
    }
    createCircle(pos, rad, col) {
        let circle = new GameCircle(pos, rad, col);
        this.addObj(circle);
        return circle;
    }
}
