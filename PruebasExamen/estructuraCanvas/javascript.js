
const TAM = 350
const DIVISIONES = 5; 					// Numero de DIVISIONES que queremos

//Matriz de ocuación para comprobar las posiciones
var mtOcupacion=[];

var fila = 0;
var colum = 0;

var foto = 'fotos/fig1.svg'; 			// Foto a dibujar en la celda

// Funcion para preparar los canvas (definir tamaños etc)
function prepararCanvas()
{

	let canvas1;
	let	canvas2;
	let	canvas3;
	let canvas4;

	// Metodo selección canvas 1 a 1
//	canvas1 = document.getElementById('canvas01');
//	canvas1.width = 250;
	//canvas1.height = 250;

	//canvas2 = document.getElementById('canvas02');
	//canvas2.width = 250;
	//canvas2.height = 250;

	//canvas3 = document.getElementById('canvas03');
	//canvas3.width = 250;
	//canvas3.height = 250;

	//canvas4 = document.getElementById('canvas04');
	//canvas4.width = 250;
	//canvas4.height = 250;


	// Metodo selección todos los canvas de una
	let canvas = document.querySelectorAll('canvas'); 	
	
	canvas.forEach(function(cv){  // Asignamos el mismo tamaño a todos

		cv.width = TAM;
		cv.height = cv.width;

	});


	crearMatrizOcupacion();


}

// FUncion para dibujar una imagen cargade desde el ordenador en el canvas01
function dibujarImagen()
{

	let cv = document.getElementById('canvas01'); // Obtenemos el canvas en el que queremos dibujar la imagen
		ctx = cv.getContext('2d');
		imagen = new Image();

	imagen.onload = function()
	{
		// Cuando la imagen se ha cargado, es cuando la dibujamos en el canvas

		ctx.drawImage(imagen, 0, 0, cv.width, cv.height); // Imagen a dibujar, pos x, pos y de la imagen a dibujar, tam y altura de la imagen

	};

	imagen.src = 'fotos/31.jpg';


}

// Funcion para copiar la imagen del canvas01 al canvas02
function copiarImagen()
{

	let cv1 = document.getElementById('canvas01');
		cv2 = document.getElementById('canvas02');
		ctx = cv2.getContext('2d');

	ctx.drawImage(cv1, 0, 0);

}


function dividirImagen()
{
	let cv = document.getElementById('canvas03');
		ctx = cv.getContext('2d');
		tamDiv = cv.width/DIVISIONES  		// Tam de cada una de esas DIVISIONES

		ctx.beginPath();					// Nuevo dibujo (para que no siga con uno anterior en caso de que hubiese)

		ctx.lineWidth = 1; 					// Ancho de cada linea
		ctx.strokeStyle = '#000'; 			// Colo de cada linea


		// Realizacion de las DIVISIONES
		for(let i=1; i<DIVISIONES; i++)
		{
			// Lineas verticales
			ctx.moveTo(i*tamDiv, 0); 			// Mueve el pincel a la pos X,Y
			ctx.lineTo(i*tamDiv, cv.height); 	// Dibuja una linea desde la pos en la que este el pincel hasta la pos X,Y que se indique

			// Lineas horizontales
			ctx.moveTo(0, i*tamDiv);
			ctx.lineTo(cv.width, i*tamDiv);

		}


		ctx.stroke(); 							// Se realiza el dibujo

}


// Dibuja la imagen seleccionada en funcion de la posicion del raton
function moverImagen()
{

	let cv = document.getElementById('canvas03')


	cv.onmousemove = function(evt)
	{
		// Con el movimiento del raton llamamos a esta funcion

			let tam = cv.width/DIVISIONES;
				fila = Math.trunc(evt.offsetY / tam);  		// Fila en la que esta el raton. con trun truncamos el valor
				colum = Math.trunc(evt.offsetX / tam);


		//console.log(fila + ' : ' + colum);



		// Dibujo imagen en pos raton
		let imagen = new Image();

		imagen.onload = function()
		{
			// Borrado de canvas
			//cv.width = cv.width; 						// Se borra todo el canvas cada vez que se mueve el raton

			// La 2º forma de borrado sería con la matriz de ocupacion
			redibujadoCanvas();

			ctx.drawImage(imagen, colum*tam, fila*tam, tam, tam);


			dividirImagen(); 							// Se vuelve a pintar las diviones porque se borraron

		};


		imagen.src = foto;
	}

}

// Matriz para controlar las celdas que estan ocupadas o no en el canvas
function crearMatrizOcupacion()
{
	
	for(let i=0; i<DIVISIONES; i++)
	{
		mtOcupacion[i] = [];
	}


	for(let j=0; j<DIVISIONES; j++)
	{
		for(let k=0; k<DIVISIONES; k++)
		{

			mtOcupacion[j][k]=0; 		// Inicialmente todas las celdas estan vacias
		}
	}


	//console.table(mtOcupacion); 		// Mostramos por consola en forma de tabla
}


// Funcion para dibujar la imagen en la pos del raton
function dibujarImagenCelda()
{
	//console.log(fila + ' : ' + colum);

	// Comprobamos si esta ocupada la celda ya o no
	if(mtOcupacion[fila][colum]!=0)
	{
		// Deberia salir una alerta

	}
	else
	{
		// Celda libre
		let cv = document.getElementById('canvas03');
			ctx = cv.getContext('2d');
			img = new Image();
			tam = cv.width/DIVISIONES;

		img.onload = function()
		{

			ctx.drawImage(img, colum*tam, fila*tam, tam, tam);

			mtOcupacion[fila][colum] = 1; 	// Celda ocupada

			//console.table(mtOcupacion);

		};



		img.src = foto;
	}

}


// Funcion para redibujar el canvas en función del valor de la matriz de ocupacion
function redibujadoCanvas()
{

	let cv = document.getElementById('canvas03');
		ctx = cv.getContext('2d');
		img = new Image();
		tam = cv.width/DIVISIONES;


	img.onload = function()
	{
		ctx.beginPath();

		ctx.fillStyle = '#FFFFFFFF';

		for(let i=0; i<DIVISIONES; i++)
		{
			for(let j=0; j<DIVISIONES; j++)
			{
					if(mtOcupacion[i][j]==0)
					{
						// Celda vacia
						ctx.fillRect(j*tam, i*tam, tam, tam); // X, Y, ancho y alto ( Se rellena la celda del color indicado anteriormente en fillStyle)

					}
					else
					{
						// Imagen en la celda
						ctx.drawImage(img, j*tam, i*tam, tam, tam);

					}

			}
		}

	};


	img.src = foto;


}