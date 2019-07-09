
const TAM = 350


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
	canvas = document.querySelectorAll('canvas'); 	
	
	canvas.forEach(function(cv){  // Asignamos el mismo tamaño a todos

		cv.width = TAM;
		cv.height = cv.width;

	});



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

	}

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
		divisiones = 5; 					// Numero de divisiones que queremos
		tamDiv = cv.width/divisiones  		// Tam de cada una de esas divisiones

		ctx.beginPath();					// Nuevo dibujo (para que no siga con uno anterior en caso de que hubiese)

		ctx.lineWidth = 1; 					// Ancho de cada linea
		ctx.strokeStyle = '#000'; 			// Colo de cada linea


		// Realizacion de las divisiones
		for(let i=1; i<divisiones; i++)
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

		let tam = cv.width/5;
			fila = Math.trunc(evt.offsetY / tam);  		// Fila en la que esta el raton. con trun truncamos el valor
			columna = Math.trunc(evt.offsetX / tam);


		console.log(fila + ' : ' + columna);



		// Dibujo imagen en pos raton
		let imagen = new Image();

		imagen.onload = function()
		{
			// Borrado de canvas
			cv.width = cv.width; 						// Se borra todo el canvas cada vez que se mueve el raton

			// La 2º forma de borrado sería con la matriz de ocupacion
			
			ctx.drawImage(imagen, columna*tam, fila*tam, tam, tam);


			dividirImagen(); 							// Se vuelve a pintar las diviones porque se borraron


		}


		imagen.src = 'fotos/fig2.svg';
	}

}