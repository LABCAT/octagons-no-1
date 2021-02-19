import React, { useRef, useEffect } from "react";
import * as p5 from "p5";

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.setup = () => {
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.startingCount = Math.floor(p.random(0, 8));
    };

    p.draw = () => {
      p.background(0);
      p.strokeWeight(4);
      p.drawOctagonGrid();
    };

    p.colours = [
      {
        fillR: 255,
        fillG: 255,
        fillB: 0,
        strokeR: 127,
        strokeG: 127,
        strokeB: 0,
      },
      {
        fillR: 127,
        fillG: 255,
        fillB: 0,
        strokeR: 63,
        strokeG: 127,
        strokeB: 0,
      },
      {
        fillR: 255,
        fillG: 127,
        fillB: 0,
        strokeR: 127,
        strokeG: 63,
        strokeB: 0,
      },
      {
        fillR: 255,
        fillG: 0,
        fillB: 255,
        strokeR: 127,
        strokeG: 0,
        strokeB: 127,
      },
      {
        fillR: 127,
        fillG: 0,
        fillB: 255,
        strokeR: 63,
        strokeG: 0,
        strokeB: 127,
      },
      {
        fillR: 255,
        fillG: 0,
        fillB: 127,
        strokeR: 127,
        strokeG: 0,
        strokeB: 63,
      },
      {
        fillR: 0,
        fillG: 255,
        fillB: 255,
        strokeR: 0,
        strokeG: 127,
        strokeB: 127,
      },
      {
        fillR: 0,
        fillG: 127,
        fillB: 255,
        strokeR: 0,
        strokeG: 63,
        strokeB: 127,
      },
      {
        fillR: 0,
        fillG: 255,
        fillB: 127,
        strokeR: 0,
        strokeG: 127,
        strokeB: 63,
      },
    ];

    p.drawOctagonGrid = () => {
      const size = p.width / 8;
      const reducer = size / 8;
      let radius = size;
      let count = p.startingCount;
      console.log(count);
      let colour = p.colours[count];
      

      for (let x = 0; x <= p.width + size; x += size) {
        for (let y = 0; y <= p.height + size; y += size) {
          radius = size;
          colour = p.colours[count];
          p.fill(colour.fillR, colour.fillG, colour.fillB, 67);
          p.stroke(colour.strokeR, colour.strokeG, colour.strokeB);
          while (radius > 0) {
            p.octagon(x, y, radius);
            radius = radius - reducer;
          }
          count++;
          if(count > 8){
              count = 0;
          }
        }
      }
    };

    /*
     * function to draw a octagon shape
     * adapted from: https://p5js.org/examples/form-regular-polygon.html
     * @param {Number} x        - x-coordinate of the octagon
     * @param {Number} y      - y-coordinate of the octagon
     * @param {Number} radius   - radius of the octagon
     */
    p.octagon = (x, y, radius) => {
      radius = radius / 2;
      p.angleMode(p.RADIANS);
      const angle = p.TWO_PI / 8;
      p.beginShape();
      for (let a = p.TWO_PI / 16; a < p.TWO_PI + p.TWO_PI / 16; a += angle) {
        let sx = x + p.cos(a) * radius;
        let sy = y + p.sin(a) * radius;
        p.vertex(sx, sy);
      }
      p.endShape(p.CLOSE);
    };

    p.updateCanvasDimensions = () => {
      p.canvasWidth = window.innerWidth;
      p.canvasHeight = window.innerHeight;
      p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.redraw();
    };

    if (window.attachEvent) {
      window.attachEvent("onresize", function () {
        p.updateCanvasDimensions();
      });
    } else if (window.addEventListener) {
      window.addEventListener(
        "resize",
        function () {
          p.updateCanvasDimensions();
        },
        true
      );
    } else {
      //The browser does not support Javascript event binding
    }
  };

  useEffect(() => {
    new p5(Sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch;
