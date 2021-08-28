import { GameAnimatedImage, GameCenterText, GameImage, GameRectButton } from "./engine/canvasObject.js";
import { Game, RENDERTYPES } from "./engine/game.js";
import { CanvasRenderEngine, HTMLRenderEngine, PixelCanvasRenderEngine } from "./engine/renderEngine.js";
import { Vector } from "./engine/vector.js";
class Hat extends GameImage {
    constructor() {
        super('hat.png', Vector.ZERO());
        this.offset = Vector.ZERO();
        this.rot = 4;
        this.rotDiv = 8;
        this.speed = 0.003;
        this.rot = Math.floor(Math.random() * 3 + 1);
        this.rotDiv = Math.floor(Math.random() * 4 + 2);
        this.speed = (Math.random() * 3.5 + 0.5) * 0.002;
    }
    update(game) {
        let v = new Vector(80 - this.img.width / 2, 160 - this.img.height / 2);
        v = v.add(this.offset);
        let s = this.speed;
        let r = 32 * (1 + Math.sin(-game.deltaTimestamp * s * this.rot) / this.rotDiv);
        v = v.add(new Vector(Math.sin(-game.deltaTimestamp * s) * r, Math.cos(-game.deltaTimestamp * s) * r));
        this.position = v;
    }
}
class Robot extends GameAnimatedImage {
    constructor(game) {
        super("swing.png", 16, new Vector(0, 28).add(new Vector(Math.random() * 100, Math.random() * 216)), 10, game, false);
        this.spd = 1;
    }
    update(game) {
        super.update(game);
        this.position.x += game.delta * this.spd;
        if (this.position.x >= game.renderEngine.canvasSize.x) {
            this.position.x = -20;
        }
    }
    set speed(spd) {
        this.spd = spd;
        this.frameTime = 60 / (10 + 10 * (spd / 2 - 0.5));
    }
}
let a = new Game();
let count = 1;
let colors = {
    dark: '#0C1446',
    base: '#175873',
    highlight: '#2B7C85',
    light: '#87ACA3'
};
function switchEngine(g, btn) {
    g.removeObj(g.renderEngine.fsBtn.img);
    g.removeObj(g.renderEngine.fsBtn);
    g.removeUpdateObj(g.renderEngine.fsBtn);
    let objs = g.renderEngine.gameObjects;
    let fs = g.renderEngine.fullScreen;
    g.gameElement.innerHTML = '';
    switch (g.renderType) {
        case RENDERTYPES.HTML:
            g.renderType = RENDERTYPES.pixelHTML;
            g.renderEngine = new HTMLRenderEngine(g, true);
            btn.textStr = 'pixelHTML';
            break;
        case RENDERTYPES.pixelHTML:
            g.renderType = RENDERTYPES.canvas;
            g.renderEngine = new CanvasRenderEngine(g);
            btn.textStr = 'canvas';
            break;
        case RENDERTYPES.canvas:
            g.renderType = RENDERTYPES.pixelCanvas;
            g.renderEngine = new PixelCanvasRenderEngine(g);
            btn.textStr = 'pixelCanvas';
            break;
        case RENDERTYPES.pixelCanvas:
            g.renderType = RENDERTYPES.HTML;
            g.renderEngine = new HTMLRenderEngine(g);
            btn.textStr = 'HTML';
            break;
    }
    g.renderEngine.fullScreen = fs;
    g.gameElement.style.cursor = 'default';
    g.renderEngine.start();
    g.renderEngine.initFS();
    for (let o of objs) {
        g.addObj(o);
    }
}
function generateBS(g) {
    let amount = 1 + count * (1 + count / 10);
    for (let i = 0; i < Math.floor(amount); i++) {
        for (let i = 0; i < 3; i++) {
            let bot = new Robot(g);
            bot.speed = Math.random() + 1;
            g.addObj(bot);
        }
        let hat = new Hat();
        g.addObj(hat);
        g.addUpdateObj(hat);
    }
    count++;
}
a.startFunc = () => {
    let r = a.createRect(new Vector(-5, 260), new Vector(170, 70), colors.dark);
    r.stroke = colors.light;
    let btn = new GameRectButton(new Vector(8, 272), new Vector(80, 40), a, () => { switchEngine(a, btn); }, 'canvas', colors.base);
    btn.hoverColor = colors.highlight;
    let btn2 = new GameRectButton(new Vector(96, 272), new Vector(56, 16), a, () => { generateBS(a); }, '+', colors.base);
    btn2.hoverColor = colors.highlight;
    let text = new GameCenterText('1', new Vector(96, 292), new Vector(56, 16));
    a.addObj(text);
    a.addUpdateObj({
        update(game) {
            text.text = a.renderEngine.gameObjects.length.toString();
        }
    });
    generateBS(a);
};
a.start();
