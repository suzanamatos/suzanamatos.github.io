"use strict";


var gl;
const maxPos = 500;
var index = 0;
var floatSize = 4;
var dimension = 2;


init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    // initialization
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, dimension*floatSize*maxPos, gl.STATIC_DRAW)
    
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, dimension, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);


    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 4*floatSize*maxPos, gl.STATIC_DRAW);
    
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var cIndex = 0;
    var colors = [
        vec4(0.0, 0.0, 0.0, 1.0), // black
        vec4(1.0, 0.0, 0.0, 1.0), // red
        vec4(1.0, 1.0, 0.0, 1.0), // yellow
        vec4(0.0, 1.0, 0.0, 1.0), // green
        vec4(0.0, 0.0, 1.0, 1.0), // blue
        vec4(1.0, 0.0, 1.0, 1.0), // magenta
        vec4(0.0, 1.0, 1.0, 1.0) // cyan
    ];


    var t = [];
    t.length = 4;
    var firstPoint = true;
    //event listener
    //é preciso, toda vida que tiver um clique, guardar um ponto, 
    //e depois o outro para criar o quadrilátero
    canvas.addEventListener("click", function(event) {
        var posX = -1 + 2*event.offsetX/canvas.width;
        var posY =  1 - 2*event.offsetY/canvas.height;
        
        if(firstPoint)
        {
            t[0] = vec2(posX, posY);
        }
        else
        {
            //criando os pontos para formar o quadrilátero
            //usando triangle_fan (pensando no poligono)
            //   0 ._________. 1
            //     |         |
            //     |         |
            //   3 ._________. 2
            t[2] = vec2(posX, posY);
            t[1] = vec2(posX, t[0][1]);
            t[3] = vec2(t[0][0], posY);

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, dimension*floatSize*index, flatten(t));

            //setando as cores de cada vértice
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            var c = vec4(colors[cIndex]);
            for (let i = 0; i < 4; ++i) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 4*floatSize*(index+i), flatten(c));
            }

            index+=4;
        }

        firstPoint = !firstPoint;
    });


    var menu = document.getElementById("mymenu");
    menu.addEventListener("click", function(event) {
        cIndex = event.target.index;
    });

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(let i = 0; i < index; i+=4)
    {
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    }

    requestAnimationFrame(render);
}


