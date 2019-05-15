
// Ajustamos tamaños de la zona de juego y las piezas en funcion del tamaño de la ventana
function prepararZona() 
{
	let tablero;
	let	pieza1;
	let	pieza2;
	let	pieza3;

	// Pantallas pequeñas
	if(window.innerWidth<480)
	{

		tablero = document.getElementById('panelJuego');
		tablero.width = 480;
		tablero.height = 360;

		pieza1 = document.getElementById('zonaPieza1');
		pieza1.width = 400;
		pieza1.height = 350;

		pieza2 = document.getElementById('zonaPieza2');
		pieza2.width = 400;
		pieza2.height = 350;

		pieza3 = document.getElementById('zonaPieza3');
		pieza3.width = 400;
		pieza3.height = 350;


	}
	else
	{	
		// Pantallas grandes
		if(window.innerWidth>981)
		{
			tablero = document.getElementById('panelJuego');
			tablero.width = 480;
			tablero.height = 480;

			pieza1 = document.getElementById('zonaPieza1');
			pieza1.width = 180;
			pieza1.height = 180;

			pieza2 = document.getElementById('zonaPieza2');
			pieza2.width = 180;
			pieza2.height = 180;

			pieza3 = document.getElementById('zonaPieza3');
			pieza3.width = 180;
			pieza3.height = 180;

		}
		else  // Pantallas medianas
		{
			tablero = document.getElementById('panelJuego');
			tablero.width = 480;
			tablero.height = 480;

			pieza1 = document.getElementById('zonaPieza1');
			pieza1.width = 180;
			pieza1.height = 180;

			pieza2 = document.getElementById('zonaPieza2');
			pieza2.width = 180;
			pieza2.height = 180;

			pieza3 = document.getElementById('zonaPieza3');
			pieza3.width = 180;
			pieza3.height = 180;
		}
	}


	crearZona(1); 				// Divisiones para el canvas de la zona de juego
	crearZona(2); 				// Divisiones para el canvas de la pieza 1
	crearZona(3);
	crearZona(4);

}



/* Funcion para realizar las divisiones del canvas */
function crearZona(zona)
{
	let cv;

	switch (zona) {  // Seleccion de la zona a crear

		case 1: // Tablero principal (10x10)
			cv = document.getElementById('panelJuego'); 
			divisiones = 10;   								// Numero de divisiones que queremos hacer
			break;
		case 2: // Pieza 1 (5x5)
			cv = document.getElementById('zonaPieza1'); 
			divisiones = 5;  
			break;
		case 3: // Pieza 2 (5x5)
			cv = document.getElementById('zonaPieza2'); 
			divisiones = 5;  
			break;
		case 4: // Pieza 3 (5x5)
			cv = document.getElementById('zonaPieza3'); 
			divisiones = 5;  
			break;
	}

	let	ctx = cv.getContext('2d'); 		
		incX = Math.round(cv.width/divisiones);
		incY = Math.round(cv.height/divisiones);

	cv.width = cv.width; 
	ctx.beginPath(); 		

	ctx.lineWidth = 2;

	ctx.strokeStyle = '#BABDB6FF';
			
	for(let i=1; i<divisiones; i++)  // Hacemos las divisiones
	{
		// Verticales
		ctx.moveTo(i*incX, 0);
		ctx.lineTo(i*incX, cv.height);

		// Horizontales
		ctx.moveTo(0, i*incY);
		ctx.lineTo(cv.width, i*incY);

	}

	ctx.stroke();

}



/* Funcion para pedir al servidor la tabla con las 10 mejores puntuaciones*/
function pedirPuntuaciones()
{
	let xhr = new XMLHttpRequest();  		
		url = 'api/puntuaciones';

	xhr.open('GET', url, true);
								 			
	xhr.onload= function() 
	{  
		let r = JSON.parse(xhr.responseText);  /* Parseando la respuesta a un objeto javascript */

		//console.log(r);

		var modal = document.getElementById('myModal');  // Obtenemos el elemento

		modal.style.display = "block";  				// Mostramos la ventana 

		let html = '';

		for (let i=0; i<r.FILAS.length;i++)
		{

			html += '<p>';

				html +='<strong>' + r.FILAS[i].nombre + '</strong>' + ' - ' + r.FILAS[i].puntos + ' puntos';


			html += '</p>';

		}


		document.querySelector('.tabla').innerHTML=html;

	};


	xhr.send(); 
}



function jugar()
{

	var modal = document.getElementById('myModal');  // Obtenemos el elemento
	modal.style.display = "none";  					// Dejamos de mostrar la ventana


	inicioJuego();
}

// Función para seleccionar aleatoriamente 3 de las 9 piezas disponibles
function seleccionarPiezas()
{	
	// 1º Creamos las piezas disponibles
	let piezaObj1 = new Pieza('cuadradoG', 'azulClaro');
		piezaObj2 = new Pieza('cuadradoP', 'verde');
		piezaObj3 = new Pieza('L', 'azulOscuro');
		piezaObj4 = new Pieza('filaG', 'violeta');
		piezaObj5 = new Pieza('filaP', 'naranja');
		piezaObj6 = new Pieza('columnaG', 'violeta');
		piezaObj7 = new Pieza('esquina', 'rosa');
		piezaObj8 = new Pieza('columnaP', 'rojo');
		piezaObj9 = new Pieza('punto', 'azul');

	let pieza1 = new Pieza('nada', 'nada');
		pieza2 = new Pieza('nada', 'nada');
		pieza3 = new Pieza('nada', 'nada');

	// Array con todas las piezas disponibles
	let piezas = [piezaObj1, piezaObj2, piezaObj3, piezaObj4, piezaObj5, piezaObj6, piezaObj7, piezaObj8, piezaObj9];


	// Obtenemos las 3 piezas aleatorias a partir del array
	Object.assign(pieza1, piezas.elementoAleatorio());
	Object.assign(pieza2, piezas.elementoAleatorio());
	Object.assign(pieza3, piezas.elementoAleatorio());


	// Asignamos aleatoriamente un angulo de rotacion
	pieza1['rotacion'] = obtenerAngulo(pieza1);
	pieza2['rotacion']  = obtenerAngulo(pieza2);
	pieza3['rotacion']  = obtenerAngulo(pieza3);


	//pieza1.canvas = 'zonaPieza1';

	console.log(pieza1);
	console.log(pieza2);
	console.log(pieza3);

	//dibujarPieza(pieza1);
	//dibujarPieza(pieza2Final);
	//dibujarPieza(pieza3Final);

}

// A partir del array que se pasa a la funcion se obtiene un valor aleatorio del mismo
Array.prototype.elementoAleatorio = function() {

	return this [Math.floor(Math.random() * this.length)]
}


// Funcion para obtener aleatoriamente el angulo de rotacion posible de la pieza pasada por parametro
function obtenerAngulo(pieza)
{	
	
	let angulos = [0, 90, 180, 270]; 			
		angulos2 = [0, 90];

	if(pieza.nombre=='L' || pieza.nombre=='esquina')
	{
		// Piezas que pueden rotar en cualquier angulo sin problemas
		angulo = angulos.elementoAleatorio();
	}
	else
	{
		if(pieza.nombre=='filaG' || pieza.nombre=='filaP' || pieza.nombre=='columnaG' || pieza.nombre=='columnaP')
		{
			// Piezas que solo pueden rotar en 2 angulos
			angulo = angulos2.elementoAleatorio();
		}
		else
		{
			// Piezas que da igual la rotacion, siempre se van a dibujar igual
			angulo = 0;
		}
	}

	pieza.rotacion = angulo;

	return pieza.rotacion
}

// Dibujamos la pieza que pasamos por paramatro en su canvas correspondiente
function dibujarPieza(pieza)
{

	let cv = document.getElementById(pieza.canvas); 		// Canvas donde se va a dibujar
		ctx = cv.getContext('2d');
		imagen = new Image();
		tam= cv.width / 5; 									// Tamaño de cada cuadrado del canvas
		fila=0;  											// Fila donde se va a dibujar la pieza
		columna=0; 											// Column donde se va a dibujar la pieza
	let	recorrido; 											// Contendra los valores de columna y filasa dibujar en cuestion


	ctx.beginPath(); 

		// Comprobamos la pieza que se ha seleccionado
		switch (pieza.nombre) {
			case 'cuadradoP':
				imagen.src = 'fotos/green.png';
				
				recorrido = [1, 1, 2, 1, 1, 2, 2, 2];   // Columna, Fila, Columna, Fila....
				break;

			case 'cuadradoG':
				imagen.src = 'fotos/blueClarito.png';
				
				recorrido = [1, 1, 2, 1, 3, 1, 1, 2, 2, 2, 3, 2, 1, 3, 2, 3, 3, 3];   // Columna, Fila, Columna, Fila....
				break;

			case 'cuadradoG':
				imagen.src = 'fotos/blueClarito.png';
				
				recorrido = [1, 1, 2, 1, 3, 1, 1, 2, 2, 2, 3, 2, 1, 3, 2, 3, 3, 3];   // Columna, Fila, Columna, Fila....

				break;
		}


		imagen.onload = function(){

			for(let i=0; i<recorrido.length-1; i++)
			{
				columna = recorrido[i];
				fila = recorrido[i+1];

				// Imagen a dibujar, pos x, pos y, tam y altura
				ctx.drawImage(imagen, columna*tam, fila*tam, tam, tam);
			}

		};

		// Imagen a dibujar, pos x, pos y, tam y altura
		//ctx.drawImage(imagen, 4*tam, 4*tam, tam, tam);  		// Imagen dibujada dentro del cuadrado indicado del canvas





}


// Empieza el juego: Se seleccionan las piezas aleatorias a mostrar
function inicioJuego()
{

	seleccionarPiezas();
	/*
	let cv = document.getElementById('zonaPieza1');

	cv.onmousemove = function(evt) {  // Con el movimiento del raton llamamos a la funcion

			if(evt.offsetX <0 || evt.offsetX > cv.width || evt.offsetY<0 || evt.offsetY > cv.height)
			{
				return false;
			}
			else
			{
				let tam= cv.width / 5;
					fila = Math.trunc(evt.offsetY / tam);  // Fila en la que esta el raton. con trun truncamos el valor
					columna = Math.trunc(evt.offsetX / tam);

				console.log(fila + ' : ' + columna);
			}
	};
	*/

}

// Objeto Pieza con el tipo, color  y angulo de rotacion del mismo
function Pieza(nombre, color)
{ 
	this.nombre = nombre; 		// Tipo de pieza
	this.color = color; 		// Color en el que se dibujara
	this.rotacion = 0; 			// Rotacion de la pieza
	this.canvas = 'ninguno';
}