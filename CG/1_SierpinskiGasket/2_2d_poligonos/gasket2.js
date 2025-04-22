"use strict";


var gl;
var positions = [];


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
    var totalSubdivision = 2;
    divideTriangle(vertices[0], vertices[1], vertices[2], totalSubdivision);


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
    gl.drawArrays(gl.TRIANGLES, 0, positions.length);
}

function divideTriangle(a, b, c, k)
{
    if(k==0)
    {
        addTriangle(a,b,c);
    }
    else
    {
        var ab = mix(a, b, 0.5);
        var bc = mix(b, c, 0.5);
        var ca = mix(c, a, 0.5);

        divideTriangle(a, ab, ca, k-1);
        divideTriangle(ab, b, bc, k-1);
        divideTriangle(ca, bc, c, k-1);
    }
}

function addTriangle(a,b,c)
{
    positions.push(a);
    positions.push(b);
    positions.push(c);
}

