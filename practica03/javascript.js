
/* VARIABLES GLOBALES */
// Piezas a mostar 
var pieza1 = new Pieza('nada', 'nada', 'nada');
	pieza2 = new Pieza('nada', 'nada', 'nada');
	pieza3 = new Pieza('nada', 'nada', 'nada');

// Pieza elegida para pintar
var piezaElegida = new Pieza('nada', 'nada', 'nada');
var colocada = false;


var filaAnt = -1;
var columAnt = -1;



// Array que contiene el recorrido para dibujar la pieza seleccionada en el tablero
var recorridoFinal= [];

var mouse_fila, mouse_colum;

//Matriz de ocuación para comprobar las posiciones
var mtOcupacion=[];

// Ajustamos tamaños de la zona de juego y las piezas en funcion del tamaño de la ventana
function prepararZona() 
{
	let tablero;
	let	pieza1;
	let	pieza2;
	let	pieza3;
	creaMatrizColision();

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


// Funcion que se accede cuando se pulsa el boton de jugar: Se quita la tabla de 
// puntuaciones y se inicia el juego
function jugar()
{

	var modal = document.getElementById('myModal');  // Obtenemos el elemento
	modal.style.display = "none";  					// Dejamos de mostrar la ventana

	jugando = true;

	inicioJuego();
}

// Función para seleccionar aleatoriamente 3 de las 9 piezas disponibles
function cargarPiezas()
{	
	// PIEZAS DISPONIBLES A CARGAR
	let piezaObj1 = new Pieza('cuadradoG', '#13F1D4FF', 'fotos/blueClarito.png');
		piezaObj2 = new Pieza('cuadradoP', '#4E9A06FF', 'fotos/green.png');
		piezaObj3 = new Pieza('L', '#584db1', 'fotos/azulOscuro.png');
		piezaObj4 = new Pieza('filaG', '#8AE234FF', 'fotos/greenLight.PNG');
		piezaObj5 = new Pieza('filaP', '#F57900FF', 'fotos/orange.png');
		piezaObj6 = new Pieza('columnaG', '#75507BFF', 'fotos/Purple-Box.jpg');
		piezaObj7 = new Pieza('esquina', '#f67794', 'fotos/pink.png');
		piezaObj8 = new Pieza('columnaP', '#EF2929FF', 'fotos/red.png');
		piezaObj9 = new Pieza('punto', '#05EAFFFF', 'fotos/blue.jpeg');

	// Array con todas las piezas disponibles
	let piezas = [piezaObj1, piezaObj2, piezaObj3, piezaObj4, piezaObj5, piezaObj6, piezaObj7, piezaObj8, piezaObj9];


	// Obtenemos las 3 piezas aleatorias a partir del array
	Object.assign(pieza1, piezas.elementoAleatorio());
	Object.assign(pieza2, piezas.elementoAleatorio());
	Object.assign(pieza3, piezas.elementoAleatorio());


	// Asignamos aleatoriamente un angulo de rotacion
	pieza1.rotacion = obtenerAngulo(pieza1);
	pieza2.rotacion  = obtenerAngulo(pieza2);
	pieza3.rotacion  = obtenerAngulo(pieza3);


	pieza1['canvas'] = 'zonaPieza1';
	pieza2['canvas'] = 'zonaPieza2';
	pieza3['canvas'] = 'zonaPieza3';

	// Dibujamos las piezas seleccionadas en sus canvas correspondiente
	dibujarPieza(pieza1);
	dibujarPieza(pieza2);
	dibujarPieza(pieza3);



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
	let	recorrido = []; 									// Contendra los valores de columna y filasa dibujar en cuestion


	ctx.beginPath(); 

	ctx.fillStyle = pieza.color; 							// Color del que se va a dibujar la pieza

		// Establecemos el recorrido del dibujado en funcion del tipo de pieza y su rotacion
		switch (pieza.nombre) {
			case 'cuadradoP':
				// Sin rotacion
				recorrido = [1, 1, 2, 1, 1, 2, 2, 2];   // Columna, Fila, Columna, Fila....
				break;

			case 'cuadradoG':
				// Sin rotacion
				recorrido = [1, 1, 2, 1, 3, 1, 1, 2, 2, 2, 3, 2, 1, 3, 2, 3, 3, 3];   // Columna, Fila, Columna, Fila....
				break;

			case 'L':
				if(pieza.rotacion==0 || pieza.rotacion==270)
				{
					recorrido = [1, 1, 1, 2, 1, 3, 2, 3, 3, 3];    
				}
				else
				{
					if(pieza.rotacion==90)
					{
						recorrido = [1, 1, 2, 1, 3, 1, 1, 2, 1, 3];  
					}
					else
					{
						if(pieza.rotacion==180)
						{
							recorrido = [3, 1, 3, 2, 3, 3, 2, 3, 1, 3];   
						}
					}
				}
				break;

			case 'filaG':
				if(pieza.rotacion==0)
				{
					recorrido = [0, 2, 1, 2, 2, 2, 3, 2, 4, 2];  
				}
				else  // 90 grados
				{
					recorrido = [2, 0, 2, 1, 2, 2, 2, 3, 2, 4];  
				}
				break;

			case 'filaP':
				if(pieza.rotacion==0)
				{
					recorrido = [1, 2, 2, 2, 3, 2];   
				}
				else // 90 grados
				{
					recorrido = [2, 1, 2, 2, 2, 3];  
				}
				break;

			case 'columnaG':
				if(pieza.rotacion==0)
				{
					recorrido = [2, 1, 2, 2, 2, 3, 2, 4];    
				}
				else // 90 grados
				{
					recorrido = [1, 2, 2, 2, 3, 2, 4, 2];  
				} 
				break;

			case 'columnaP':
				if(pieza.rotacion==0)
				{
					recorrido = [2, 1, 2, 2];     
				}
				else // 90 grados
				{
					recorrido = [2, 2, 3, 2];  
				} 
				break;

			case 'esquina':
				if(pieza.rotacion==0)
				{
					recorrido = [1, 2, 1, 3, 2, 3];   
				}
				else
				{
					if(pieza.rotacion==90)
					{
						recorrido = [1, 1, 2, 1, 1, 2];  
					}
					else
					{
						if(pieza.rotacion==180)
						{
							recorrido = [3, 1, 2, 1, 3, 2];  
						}
						else // 270
						{
							recorrido = [3, 3, 3, 2, 2, 3]; 
						}
					}
				}
				break;

			case 'punto':
				// Sin rotacion
				recorrido = [2, 2];   
				break;
		}

		// Bucle para dibujar la pieza en funcion del recorrido asignado
		for(let i=0; i<recorrido.length-1; i++)
		{
			columna = recorrido[i];
			fila = recorrido[i+1];
			i++;

			ctx.fillRect(columna*tam, fila*tam, tam, tam);			// Rellenamos un rectangulo con el color que tengamos (x, y, ancho, alto)
		}



}

// Movemos la pieza seleccionada
function moverPieza()
{
	if(piezaElegida.colocada==false)
	{
		let cv = document.getElementById('panelJuego');

		// Con el movimiento del raton se llama a la funcion
		cv.onmousemove = function(evt) 
		{

			if(colocada==false)
			{
				if(evt.offsetX <0 || evt.offsetX > cv.width || evt.offsetY<0 || evt.offsetY > cv.height)
				{
					return false;
				}
				else
				{
					let tam= cv.width / 10;
					fila = Math.trunc(evt.offsetY / tam);  // Fila en la que esta el raton. con trun truncamos el valor
					columna = Math.trunc(evt.offsetX / tam);

					// Guardamos la fila y columna donde esta el raton para comprobar despues si esta fuera del tablero o no
					//mouse_fila = fila;
					//mouse_colum = columna;

					//console.log(fila + ' : ' + columna);
					//testMatrizColision();
					//comprobarPosicion(fila,columna);
					//testMatrizColision();

					let ctx = cv.getContext('2d');
					img = new Image();

					// Esto es lo mismo que la practica pero habra que pintar mas celdas en funcion del tam de la ficha
					img.onload = function(){

						//cv.width = cv.width;  					// Borramos la imagen dibujada anterioremente

						//ctx.clearRect(evt.offsetX-100, evt.offsetY-100, 50, 250);

						borrarZonaPieza(fila, columna, ctx, tam);
						colocarPieza(fila, columna, tam); 		// Se coloca la pieza en la posicion del raton (no se queda dibujado en el panel aun)
						
						pintarDivisiones(10, 'panelJuego');

					};

					// La url de la imagen estara en la variable imagen de la pieza elegida
					img.src = piezaElegida.imagen;


				}
			}
		}
	}

}

// Funcion para borrar la posicion anterior de la pieza al moverla
function borrarZonaPieza(f, c, contexto, size)
{
	// Establecemos el recorrido del dibujado en funcion del tipo de pieza y su rotacion
	switch (piezaElegida.nombre) {
		case 'cuadradoP':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				if(f>filaAnt && c==columAnt)
				{	
					// Abajo
					contexto.clearRect(c*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((c+1)*48, (filaAnt)*48, 48, 48);
				}
				else
				{
					// Arriba
					contexto.clearRect(columAnt*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt+1)*48, 48, 48);

				}


				if(c>columAnt)
				{
					// Derecha
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);

				}
				else
				{
					contexto.clearRect((columAnt-1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt-1)*48, (filaAnt+1)*48, 48, 48);
				}
			}


			break;

		case 'cuadradoG':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				if(f>filaAnt && c==columAnt)
				{	
					// Abajo
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt)*48, 48, 48);

				}
				else
				{
					// Arriba
					contexto.clearRect(columAnt*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect(columAnt*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt+2)*48, 48, 48);

				}


				if(f==filaAnt && c>columAnt)
				{
					// Derecha
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+2)*48, 48, 48);
				}
				else
				{
					contexto.clearRect((columAnt-1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt-1)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt-1)*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt-2)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt-2)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt-2)*48, (filaAnt+2)*48, 48, 48);
				}
			}
			break;

		case 'L':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt+2)*48, 48, 48);
				}
				else
				{
					contexto.clearRect(columAnt*48, (filaAnt-1)*48, 48, 48);
				}

				// Derecho e izquierda
				if((f==filaAnt && c>columAnt))
				{
					contexto.clearRect((columAnt)*48, filaAnt*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+2)*48, 48, 48);
				}
				else
				{
					contexto.clearRect((columAnt)*48, filaAnt*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt+2)*48, 48, 48);
				}

			}	 
			break;

		case 'filaG':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+3)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+4)*48, (filaAnt)*48, 48, 48);
				}

				// Derecho e izquierda
				if((f==filaAnt && c>columAnt))
				{
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);

				}
				else
				{
					contexto.clearRect((columAnt+4)*48, (filaAnt)*48, 48, 48);
				}

			}	
			break;

		case 'filaP':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt+2)*48, (filaAnt)*48, 48, 48);
				}

				// Derecho e izquierda
				if((f==filaAnt && c>columAnt))
				{
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);

				}
				else
				{
					contexto.clearRect((columAnt+2)*48, (filaAnt)*48, 48, 48);
				}

			}	 
			break;

		case 'columnaG':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt+3)*48, 48, 48);
				}
				else
				{
					contexto.clearRect(columAnt*48, (filaAnt-1)*48, 48, 48);
				}

				// Derecho e izquierda
				if((f==filaAnt && c!=columAnt))
				{
					contexto.clearRect((columAnt)*48, filaAnt*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+2)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+3)*48, 48, 48);
				}

			}	 
			break;

		case 'columnaP':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt+1)*48, 48, 48);
				}
				else
				{
					contexto.clearRect(columAnt*48, (filaAnt-1)*48, 48, 48);
				}

				// Derecho e izquierda
				if((f==filaAnt && c!=columAnt))
				{
					contexto.clearRect((columAnt)*48, filaAnt*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
				}

			}
			break;

		case 'esquina':
			if(filaAnt!=-1 && columAnt!=-1)
			{
				// Arriba Abajo
				if(f!=filaAnt && c==columAnt)
				{
					contexto.clearRect(columAnt*48, (filaAnt+1)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt)*48, 48, 48);
				}
				else
				{
					contexto.clearRect(columAnt*48, (filaAnt-1)*48, 48, 48);
					contexto.clearRect((columAnt+1)*48, (filaAnt-1)*48, 48, 48);
				}

				// Derecho e izquierda
				if(f==filaAnt && c>columAnt)
				{
					// Derecha
					contexto.clearRect(columAnt*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
				}
				else
				{
					contexto.clearRect((columAnt+1)*48, (filaAnt)*48, 48, 48);
					contexto.clearRect((columAnt)*48, (filaAnt+1)*48, 48, 48);
				}

			}
			break;

		case 'punto':
  			
			if(filaAnt!=-1 && columAnt!=-1)
			{
				contexto.clearRect(columAnt*48, filaAnt*48, 48, 48);
			}
			break;
		}


		filaAnt = f;
		columAnt = c;
	
}

// Dibuja la pieza en el tablero en funcion de la fila y columna donde este el raton del jugador (no la deja dibujada aun)
function colocarPieza(f, c, tam)
{

	// Establecemos el recorrido del dibujado en funcion del tipo de pieza y su rotacion
	switch (piezaElegida.nombre) {
		case 'cuadradoP':
			// Sin rotacion
			recorrido = [c, f, c+1, f, c, f+1, c+1, f+1];   // Columna, Fila, Columna, Fila....
			//recorrido = [1, 1, 2, 1, 1, 2, 2, 2]; 
			break;

		case 'cuadradoG':
			// Sin rotacion
			recorrido = [c, f, c+1, f, c+2, f, c, f+1, c+1, f+1, c+2, f+1, c, f+2, c+1, f+2, c+2, f+2];   // Columna, Fila, Columna, Fila....
			//recorrido = [1, 1, 2, 1, 3, 1, 1, 2, 2, 2, 3, 2, 1, 3, 2, 3, 3, 3]; 
			break;

		case 'L':
			if(piezaElegida.rotacion==0 || piezaElegida.rotacion==270)
			{
				recorrido = [c, f, c, f+1, c, f+2, c+1, f+2, c+2, f+2];    
			}
			else
			{
				if(piezaElegida.rotacion==90)
				{
					recorrido = [c, f, c+1, f, c+2, f, c, f+1, c, f+2];  
				}
				else
				{
					if(piezaElegida.rotacion==180)
					{
						recorrido = [c, f, c, f+1, c, f+2, c-1, f+2, c-2, f+2];  
					}
				}
			}
			break;

			case 'filaG':
				if(piezaElegida.rotacion==0)
				{
					recorrido = [c, f, c+1, f, c+2, f, c+3, f, c+4, f];  
				}
				else  // 90 grados
				{
					recorrido = [c, f, c, f+1, c, f+2, c, f+3, c, f+4];  
				}
				break;

			case 'filaP':
				if(piezaElegida.rotacion==0)
				{
					recorrido = [c, f, c+1, f, c+2, f];   
				}
				else // 90 grados
				{
					recorrido = [c, f, c, f+1, c, f+2];  
				}
				break;

			case 'columnaG':
				if(piezaElegida.rotacion==0)
				{
					recorrido = [c, f, c, f+1, c, f+2, c, f+3];    
				}
				else // 90 grados
				{
					recorrido = [c, f, c+1, f, c+2, f, c+3, f];  
				} 
				break;

			case 'columnaP':
				if(piezaElegida.rotacion==0)
				{
					recorrido = [c, f, c, f+1];     
				}
				else // 90 grados
				{
					recorrido = [c, f, c+1, f];  
				} 
				break;

			case 'esquina':
				if(piezaElegida.rotacion==0)
				{
					recorrido = [c, f, c, f+1, c+1, f+1];   
				}
				else
				{
					if(piezaElegida.rotacion==90)
					{
						recorrido = [c, f, c+1, f, c, f+1];  
					}
					else
					{
						if(piezaElegida.rotacion==180)
						{
							recorrido = [c, f, c+1, f, c+1, f+1];  
						}
						else // 270
						{
							recorrido = [c, f, c, f+1, c-1, f+1]; 
						}
					}
				}
				break;

			case 'punto':
				// Sin rotacion
				recorrido = [c, f];   
				break;
		}



		// Bucle para dibujar la piezaFinal en funcion del recorrido asignado
		for(let i=0; i<recorrido.length-1; i++)
		{
			columna = recorrido[i];
			fila = recorrido[i+1];
			i++;

			ctx.drawImage(img, columna*tam, fila*tam, tam, tam);  // Dibujamos la imagen dentro de la zona dond estemos apuntando con el raton
		}



		recorridoFinal = recorrido;





}

// Funcion para dibuajar la pieza seleccionada en el tablero una vez que el jugador hace click.
// Se comprueba que la pieza este dentro de los limites del tablero y que no haya ya una pieza dibujada en ese sitio
function dibujarPiezaTablero()
{
	if(piezaElegida.colocada!=true)
	{
		// Se comprueba primero si la imagen se puede dibujar en ese sitio
		let dibujar = true;
			columna = 0;
			fila = 0;
		for(let i=0; i<recorridoFinal.length-1 && dibujar==true; i++)
		{
			columna = recorridoFinal[i];
			fila = recorridoFinal[i+1];

			if(columna>9 || fila>9)
			{	// Pieza sale del tablero
				console.log('No se puede dibujar ahi');
				dibujar = false;
			}
		}

		if(dibujar==true)
		{	
			// Pieza a dibujar dentro del tablero
			//console.log(mouse_fila);
			//console.log(mouse_colum);
			let cv = document.getElementById('panelJuego');
				ctx = cv.getContext('2d');
				img = new Image();
				tam= cv.width / 10;


			img.onload = function()
			{	
				// Bucle para dibujar la pieza en el tablero
				for(let i=0; i<recorridoFinal.length-1; i++)
				{	
						// Pieza dentro del tablero
						columna = recorridoFinal[i];
						fila = recorridoFinal[i+1];
						i++;
						ctx.drawImage(img, columna*tam, fila*tam, tam, tam);  // Dibujamos la imagen dentro de la zona dond estemos apuntando con el raton
				}

				colocada = true;

				// Borrado de la pieza del canvas del cual la obtuvimos
				let cv2 = document.getElementById(piezaElegida.canvas);
				cv2.width = cv2.width;

				pintarDivisiones(5, piezaElegida.canvas);

				filaAnt = -1;
				columAnt = -1;
				piezaElegida.colocada = true;


			};

			// La url de la imagen estara en la variable imagen de la pieza elegida
			img.src = piezaElegida.imagen;

		}
	}


}

// Seleccion de la pieza a dibujar
function seleccionPieza(pieza)
{	
		if(pieza==1)
		{
			document.getElementById('zonaPieza2').style.borderColor = "#BABDB6FF";
			document.getElementById('zonaPieza3').style.borderColor = "#BABDB6FF";
			piezaElegida = pieza1;
			document.getElementById('zonaPieza1').style.borderColor = "aquamarine";

			colocada = false;
		}
		else
		{
			if(pieza==2)
			{
				document.getElementById('zonaPieza1').style.borderColor = "#BABDB6FF";
				document.getElementById('zonaPieza3').style.borderColor = "#BABDB6FF";
				piezaElegida = pieza2;
				document.getElementById('zonaPieza2').style.borderColor = "aquamarine";

				colocada = false;
			}
			else
			{
				document.getElementById('zonaPieza1').style.borderColor = "#BABDB6FF";
				document.getElementById('zonaPieza2').style.borderColor = "#BABDB6FF";
				piezaElegida = pieza3;
				document.getElementById('zonaPieza3').style.borderColor = "aquamarine";

				colocada = false;
			}
		}

	if(piezaElegida.colocada==false)
	{

		//console.log(piezaElegida);

		moverPieza();

	}


}

// Repinta las divisiones del canvas indicado con el numero de divisiones tambien indicado
function pintarDivisiones(numDiv, panel)
{
	let cv = document.getElementById(panel);
		ctx = cv.getContext('2d');
		tamDiv = cv.width / numDiv;

	ctx.beginPath(); 

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#BABDB6FF';

	for(let i=1; i<tamDiv;i++)
	{

		ctx.moveTo(i * tamDiv, 0);
		ctx.lineTo(i* tamDiv, cv.height);

		// Horizontales
		ctx.moveTo(0, i*tamDiv);
		ctx.lineTo(cv.width, i*tamDiv);

	}

	ctx.stroke();


}
//Crea una matriz de 10x10 toda rellena de ceros
function creaMatrizColision()
{
  for(var i=0;i<9;i++)
  {
    mtOcupacion[i]=[];
  }

  for(var k=0;k<9;k++)
  {
    for(var j=0;j<9;j++)
    {
      mtOcupacion[k][j]=0;
    }
  }
}

//x e y vienen dados por el raton
function comprobarPosicion(x, y){

	if(mtOcupacion[x][y]==0)
	{
	 mtOcupacion[x][y]=1;
	}
	else{
		soltarPieza();
	}

}

function soltarPieza(){

}

// Empieza el juego: Se seleccionan las piezas aleatorias a mostrar
function inicioJuego()
{
	cargarPiezas(); 			// Dibujamos las 3 piezas seleccionadas aleatoriamente

}

// Objeto Pieza con el tipo, color  y angulo de rotacion del mismo
function Pieza(nombre, color, img)
{ 
	this.nombre = nombre; 		// Tipo de pieza
	this.color = color; 		// Color en el que se dibujara
	this.rotacion = 0; 			// Rotacion de la pieza
	this.canvas = 'ninguno';
	this.imagen = img;
	this.colocada = false;
}