"use strict";


var gl;
var positions = [];
var colors = [];

var baseColors = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 0.0, 1.0)
    ];

init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    var vertices = [
        vec3(0.0000,  0.0000, -1.0000),
        vec3(0.0000,  0.9428,  0.3333),
        vec3(-0.8165, -0.4714,  0.3333),
        vec3(0.8165, -0.4714,  0.3333)
    ];
    // var vertices = [
    //     vec3(-1, -1, -1), //esq baixo
    //     vec3( 1, -1, -1), //direito baixo
    //     vec3( 0.0,  1,  0.0), //cima
    //     vec3( 0.0, -1,  1) //frente baixo
    // ];
    var totalSubdivision = 4;
    divideTetrahedron(vertices[0], vertices[1], vertices[2], vertices[3], totalSubdivision);


    // initialization
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    //position
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW)
    
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, vertices[0].length, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);


    //color
    var cbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)
    
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length);
}

function divideTetrahedron(a, b, c, d, k)
{
    if(k==0)
    {
        addTetrahedron(a,b,c,d);
    }
    else
    {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var ad = mix(a, d, 0.5);
        var bc = mix(b, c, 0.5);
        var bd = mix(b, d, 0.5);
        var cd = mix(c, d, 0.5);

        divideTetrahedron(a, ab, ac, ad, k-1);
        divideTetrahedron(ab, b, bc, bd, k-1);
        divideTetrahedron(ad, bd, cd, d, k-1);
        divideTetrahedron(ac, bc, c, cd, k-1);
    }
}

function addTetrahedron(a,b,c,d)
{
    //adicionar os triangulos de forma antihorária
    addTriangle(a, c, b, 0);
    addTriangle(a, c, d, 1);
    addTriangle(a, b, d, 2);
    addTriangle(b, c, d, 3);
}


function addTriangle(a,b,c, color)
{
    positions.push(a);
    colors.push(baseColors[color]);
    positions.push(b);
    colors.push(baseColors[color]);
    positions.push(c);
    colors.push(baseColors[color]);
}

