"use strict";

import * as twgl from 'twgl.js';
import {createCanvas, printTimes, time, timeEnd} from "./utils";

export default async function simple() {
    const canvas = createCanvas();

    const gl = canvas.getContext('webgl', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: true
    });

    canvas.addEventListener('webglcontextlost', (err) => {
        console.error('Context lost!', err)
    }, false);

    //language=GLSL
        const vertexShader = `
        attribute vec4 position;
    
        void main() {
          gl_Position = position;
        }
    `;


    //language=GLSL
    const fragmentShader = `
        precision mediump float;
    
        uniform vec2 resolution;
        uniform vec4 baseColor;
    
        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;
          float v = uv.x * uv.y;
    
          ${slowCompilationDown(3000)}
          
          gl_FragColor = vec4(v, v, v, 1.0) * baseColor;
        }
    `;


    time('create programs');
    const programInfo = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);

    const arrays = {
        position: [/* 1 */ -0.5, -0.5, 0, /* 2 */ 1, -1, 0, /* 3 */ -1, 1, 0, /* 4 */ -1, 1, 0, /* 5 */ 1, -1, 0, /* 6 */ 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    timeEnd('create programs');

    function render(frameNr, baseColor) {
        time('render' + frameNr);

        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const uniforms = {
            resolution: [gl.canvas.width, gl.canvas.height],
            baseColor: baseColor
        };

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        // force wait for GPU
        gl.getError();

        timeEnd('render' + frameNr);
    }

    render(1, [1, 0, 0, 1]);

    await sleep(200);

    render(2, [0, 1, 0, 1]);

    printTimes();
}

function slowCompilationDown(n) {
    let res = '';
    while (n--) {
        res += `
            if (uv.x < 0.3) {
                v = uv.x * 0.2;
            } else {
                v = uv.x / uv.y;
            }
        `;
    }
    return res;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}