"use strict";


var gl;
var positions = [];
var colors = [];
var alphaColorLoc;
var alphaChoice = 0;
var betaChoice = 0;


var totalPointsPart = 500;

init();

function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //  Initialize our data for the Sierpinski Gasket
    //

    //inicializando o triângulo
    //qualquer valor de ponto dentro do espaço entre -1 e 1 pode ser usado
    var P = vec2(-0.5, -0.5);
    var Q = vec2(0.5, -0.5);
    var R = vec2(0.0, 0.5);

    //adicionando os pontos do triangulo para desenha-lo na função de render
    positions.push(P);
    positions.push(Q);
    positions.push(R);
    colors.push(vec3(0.2, 0.2, 0.2));
    colors.push(vec3(0.2, 0.2, 0.2));
    colors.push(vec3(0.2, 0.2, 0.2));

    //------------------------------------------------------------------
    //criando pontos em que alpha < 0 e beta < 0
    //mandando o quanto deve subtrair/adicionar ao rand (que é de 0 a 1)
    createPoints(-50, -1, vec3(1, 0, 0), P, Q, R); //CURIOSIDADE: tentar enviar "-1" ao invés de "-50"
    //criando pontos em que 0<alpha<1  e beta < 0
    createPoints(0, -1, vec3(0, 1, 0), P, Q, R);
    //criando pontos em que alpha>1  e beta < 0
    createPoints(50, -1, vec3(0, 0, 1), P, Q, R); //CURIOSIDADE: tentar enviar "1" ao invés de "50"
    //------------------------------------------------------------------
    //fazendo o mesmo com beta entre 0 e 1
    createPoints(-50, 0, vec3(1, 0, 0), P, Q, R); //CURIOSIDADE: tentar enviar "-1" ao invés de "-50"
    createPoints(0, 0, vec3(0, 1, 0), P, Q, R);
    createPoints(50, 0, vec3(0, 0, 1), P, Q, R); //CURIOSIDADE: tentar enviar "1" ao invés de "50"
    //------------------------------------------------------------------
    //fazendo o mesmo com beta >1
    //aqui não é necessário variar até um valor muito alto, 
    //uma vez que só vai fazer mais tentativas para criar pontos dentro do canvas
    createPoints(-1, 1, vec3(1, 0, 0), P, Q, R)
    createPoints(0, 1, vec3(0, 1, 0), P, Q, R);
    createPoints(1, 1, vec3(0, 0, 1), P, Q, R);

    // initialization
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.98, 0.98, 0.98, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    //enviando as posições criadas para a GPU
    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW)
    //descrevendo os dados das posições
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, positions[0].length, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //enviando as cores criadas para a GPU
    var cbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)
    //descrevendo os dados das cores
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


    //definindo uma variável uniforme pra o valor alpha das cores
    //para deixar transparente quando não está ativo
    alphaColorLoc = gl.getUniformLocation(program, "uAlphaColor");

    //modificando o alpha da cor dos pontos que não são os interessados
    var mAlpha = document.getElementById("alphaMenu");
    mAlpha.addEventListener("click", function(event) {
        alphaChoice = event.target.index;
        render();
    });
    //o mesmo para beta
    var mBeta = document.getElementById("betaMenu");
    mBeta.addEventListener("click", function(event) {
        betaChoice = event.target.index;
        render();
    });

    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    //desenhando o triangulo
    gl.uniform1f(alphaColorLoc, 0.25);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    //desenhando os pontos criados
    //PARTES:
    //0 a 2 - beta < 1
    //3 a 5 - 0< beta < 1
    //6 a 8 - beta > 1
    for(let i = 0; i < 9; i ++)
    {
        //definindo o valor alfa dependendo se o ponto está ativo ou não 
        if(i == betaChoice*3+alphaChoice)
        { 
            gl.uniform1f(alphaColorLoc, 1);//ponto ativo
        }
        else{ 
            gl.uniform1f(alphaColorLoc, 0.01);//ponto inativo
        }
        //desenhando os pontos das partes
        gl.drawArrays(gl.POINTS, i*totalPointsPart+3, totalPointsPart);
    }
}

function createPoints(alphaSum, betaSum, color, P, Q, R)
{
    for (var i = 0; i < totalPointsPart; ++i) 
    {
        //criando pontos somente se ele estiver dentro do canvas
        //se não estiver dentro, repete o procedimento
        do
        {
            //os valores de alpha e beta escolhidos de forma aleatória
            //porém, como a função do aleatório só vai de 0 a 1, é preciso modifica-la para que fique entre
            //suponto alphaSum = 50, o valor de alpha seria entre 1 a 51
            //supondo alphaSum = 1, o valor de alpha seria entre 1 e 2
            //suponto alphaSum = 0, o valor de alpha seria entre 0 a 1
            //supondo alphaSum = -50, o valor de alpha seria entre -50 e 0
            //supondo alphaSum = -1, o valor de alpha seria entre -1 e 0        
            var alpha = 
                         Math.random()*Math.max(Math.abs(alphaSum), 1) //para não multiplicar por zero
                      + Math.min(alphaSum, 1); //não somando acima de 1
            var beta = 
                        Math.random()*Math.max(Math.abs(betaSum), 1) 
                     + Math.min(betaSum, 1);
                     
            // uma vez gerado aleatóriamente os valores de alpha e beta, gerar um ponto com a formula
            var T = 
                      add(
                        add(mult(alpha*beta, P),
                            mult(beta*(1-alpha), Q)),
                        mult(1-beta, R)
                      );
        }while(T[0]<-1 || T[1]<-1 || T[0]>1 || T[1]>1) //aceita somente se o ponto estiver dentro do canvas
        positions.push(T);
        colors.push(color); 

    }
}
