"use strict";


var gl;
const maxPos = 500;
var floatSize = 4;
var dimension = 2;
var numPolygons = 0;
var numVertices = [0];
var startPoligonIndex = [0];
var ended = false;
var alphaColorLoc;


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
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


    //definition of the uniform variable for the alpha color
    alphaColorLoc = gl.getUniformLocation(program, "uAlphaColor");


    var index = 0;
    var cIndex = 0;
    var colors = [
        vec3(0.0, 0.0, 0.0), // black
        vec3(1.0, 0.0, 0.0), // red
        vec3(1.0, 1.0, 0.0), // yellow
        vec3(0.0, 1.0, 0.0), // green
        vec3(0.0, 0.0, 1.0), // blue
        vec3(1.0, 0.0, 1.0), // magenta
        vec3(0.0, 1.0, 1.0)  // cyan
    ];


    //event listener
    //é preciso, toda vida que tiver um clique, guardar um ponto, 
    //somente quando um botão for clicado, pode-se mandar os vertices para a GPU
    canvas.addEventListener("click", function(event) {
        var posX = -1 + 2*event.offsetX/canvas.width;
        var posY =  1 - 2*event.offsetY/canvas.height;
        
        var t = vec2(posX, posY);
        numVertices[numPolygons]++;


        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 
                         dimension*floatSize*index, 
                         flatten(t));

        //setando as cores de cada vértice
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        var c = vec3(colors[cIndex]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 3*floatSize*index, flatten(c));

        index++;

    });

    var button = document.getElementById("mybutton");
    button.addEventListener("click", function(event) {
        //setando para iniciar o próximo objeto
        numPolygons++;
        numVertices[numPolygons] = 0;
        startPoligonIndex[numPolygons] = index;

        render();
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
    for(let i = 0; i < numPolygons; ++i)
    {
        gl.uniform1f(alphaColorLoc, 1);
        gl.drawArrays(gl.TRIANGLE_FAN, startPoligonIndex[i], numVertices[i]);
    }

    gl.uniform1f(alphaColorLoc, 0.3);
    if(numVertices[numPolygons] == 1)
    {
        gl.drawArrays(gl.POINTS, startPoligonIndex[numPolygons], numVertices[numPolygons]);
    }else if(numVertices[numPolygons] == 2)
    {
        gl.lineWidth(3);
        gl.drawArrays(gl.LINE_STRIP, startPoligonIndex[numPolygons], numVertices[numPolygons]);
    }else{
        gl.drawArrays(gl.TRIANGLE_FAN, startPoligonIndex[numPolygons], numVertices[numPolygons]);
    }

    requestAnimationFrame(render);
}


