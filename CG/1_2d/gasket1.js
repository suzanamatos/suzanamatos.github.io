"use strict";


var gl;
var positions = [];

const numPositions = 5000;

init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.
    // var vertices = [
    //     vec2(-1.0, -1.0),
    //     vec2(0.0, 1.0),
    //     vec2(1.0, -1.0)
    // ];
    var vertices = [
        vec3(-1.0, -1.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(1.0, -1.0, 0.0)
    ];


    var u = mult(0.5, add(vertices[0], vertices[1]));
    var v = mult(0.5, add(vertices[0], vertices[2]));
    var p = mult(0.5, add(u, v));
    // var u = mix(vertices[0], vertices[1], 0.5);
    // var v = mix(vertices[0], vertices[2], 0.5);
    // var p = mix(u, v, 0.5);


    positions.push(p);

    for (var i = 0; i < numPositions - 1; ++i) {
        var j = Math.floor(Math.random() * 3);

        // p = mix(positions[i], vertices[j], 0.5);
        p = mult(0.5, add(positions[i], vertices[j]));

        positions.push(p);
    }


    // initialization
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW)
    
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, vertices[0].length, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, numPositions);
}


