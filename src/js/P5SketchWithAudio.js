import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import ShuffleArray from './functions/ShuffleArray.js';
import Octagon from './classes/Octagon.js';

import audio from "../audio/octagons-no-1.ogg";
import midi from "../audio/octagons-no-1.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.tempo = 104;

        p.barAsSeconds = Math.floor((60 / p.tempo) * 4 * 100000) / 100000;

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

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[2].notes.filter(note => note.midi !== 43); // Redrum 1 - RnB Kit 04
                    const noteSet2 = result.tracks[4].notes; // Synth 3 - Eject
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.melodicOctagons = [];

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.startingCount = Math.floor(Math.random() * 8) + 1;
            p.background(0, 0, 0, 0);
            p.strokeWeight(p.width / 2048);
            p.populateMelodicOctagons();
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                for (let i = 0; i < p.melodicOctagons.length; i++) {
                    const octagon = p.melodicOctagons[i];
                    octagon.draw();
                    octagon.update();
                }
            }
        }

        p.executeCueSet1 = (note) => {
            const { currentCue, ticks } = note, 
                reducer = 6 - (ticks % 61440) / 7680;
            if(currentCue < 105) {
                if(currentCue % 8 === 0){
                    p.startingCount = Math.floor(Math.random() * 8) + 1;
                    if(currentCue >= 78){
                        p.clear();
                        p.background(0);
                    }
                }
                if (currentCue >= 104) {
                    p.strokeWeight(p.width / 1024);
                }
                else if (currentCue >= 26) {
                    p.strokeWeight(p.width / 768);
                } 
                let size = currentCue <= 52 ? p.width / 16 : p.width / 4;
                    size = currentCue <= 104 ? size : p.width / 8;
                p.drawOctagonGrid(reducer, size, currentCue / 2);
            }
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note;
            if(currentCue > 80) {
                let octagons = p.melodicOctagons.filter(oct => oct.canDraw === false);
                octagons = ShuffleArray(octagons);
                if(octagons.length){
                    const octagon = octagons[0];
                    octagon.canDraw = true;
                }
            }
            
        }

        p.populateMelodicOctagons = () => {
            const size = p.width / 8,
                radius = size/2;
            let count = 0;
            for (let x = 0; x <= p.width + size; x += size) {
                for (let y = 0; y <= p.height + size; y += size) {
                    const colour = p.colours[count];
                    p.melodicOctagons.push(
                        new Octagon(p, x, y, radius, colour, p.whiteStroke)
                    );
                    p.whiteStroke = !p.whiteStroke;
                    count++;
                    if (count > 8) {
                        count = 0;
                    }
                }
            }
        }

        p.whiteStroke = false;

        p.drawOctagonGrid = (reducer, size, opacity) => {
      
            reducer = (size / 8) * reducer;
            let radius = size;
            let count = p.startingCount;
            let colour = p.colours[count];
            const maxFillOpacity = opacity < 64 ? opacity : 64;
            if(maxFillOpacity < 32){
                p.background(0, 0, 0, maxFillOpacity * 2);
            }
            for (let x = 0; x <= p.width + size; x += size) {
                for (let y = 0; y <= p.height + size; y += size) {
                radius = size;
                colour = p.colours[count];
                p.fill(colour.fillR, colour.fillG, colour.fillB, maxFillOpacity);
                if(p.whiteStroke) {
                    p.stroke(255, 255, 255, 127);
                }
                else {
                    p.stroke(
                        colour.strokeR,
                        colour.strokeG,
                        colour.strokeB
                    );
                }
                p.whiteStroke = !p.whiteStroke;
                p.octagon(x, y, radius - reducer);
                count++;
                    if (count > 8) {
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

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
