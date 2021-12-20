export default class Octagon {
    constructor(p5, x, y, radius, colour, whiteStroke) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.radius = radius; 
        this.colour =colour;
        this.whiteStroke = whiteStroke;
        this.canDraw = false;
        this.angleAdjuster = 0;
    }

    update() {
        if(this.canDraw){
            this.angleAdjuster++;
        }
    }

    draw() {
        if(this.canDraw){
            this.p.stroke(
                this.colour.strokeR,
                this.colour.strokeG,
                this.colour.strokeB
            );
            this.p.angleMode(this.p.DEGREES);
            const angle = 360 / 8;
            for (let i = 0; i < 4; i++) {
                const size = this.radius - (this.radius / 4 * i)  
                this.p.fill(this.colour.fillR, this.colour.fillG, this.colour.fillB, 64 / 4 * i);
                this.p.beginShape();
                for (let a = 360 / 16; a < 360 + 360 / 16; a += angle) {
                    let sx = this.x + this.p.cos(a + this.angleAdjuster) * size;
                    let sy = this.y + this.p.sin(a + this.angleAdjuster) * size;
                    this.p.vertex(sx, sy);
                }
                this.p.endShape(this.p.CLOSE);
            }
        }
    }
}