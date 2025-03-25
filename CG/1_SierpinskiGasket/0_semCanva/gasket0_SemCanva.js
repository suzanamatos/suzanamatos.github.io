"use strict";

var positions = [];

const numPositions = 5;

init();

function init()
{
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three positions.
    var vertices = [
        vec2(-1.0, -1.0),
        vec2(0.0, 1.0),
        vec2(1.0, -1.0)
    ];
    // var vertices = [
    //     vec3(-1.0, -1.0, 0.0),
    //     vec3(0.0, 1.0, 0.0),
    //     vec3(1.0, -1.0, 0.0)
    // ];


    var u = mult(0.5, add(vertices[0], vertices[1]));
    var v = mult(0.5, add(vertices[0], vertices[2]));
    var p = mult(0.5, add(u, v));


    positions.push(p);

    for (var i = 0; i < numPositions - 1; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = mult(0.5, add(positions[i], vertices[j]));

        console.log(positions[i]);

        positions.push(p);
    }

}
