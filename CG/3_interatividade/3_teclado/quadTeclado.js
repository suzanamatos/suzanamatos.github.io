"use strict";

var theta = 0.0;
var thetaLoc;
var gl;
var direction = true;
var delay = 100;

init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize quadrilateral
    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

    // initialization
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW)

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //definition of the uniform variable
    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event handlers
    window.addEventListener("keydown", function(event) {
        console.log("event.key", event.key, "   event.code", event.code);
        switch (event.key) {
        case '1':
            direction = !direction;
            break;
        case '2':
            delay /= 2.0;
            break;
        case '3':
            delay *= 2.0;
            break;
        }
    });
    
    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    theta += (direction ? 0.01 : -0.01);
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    

    setTimeout(render, delay);
}
