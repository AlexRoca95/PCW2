

// Ajustamos tamaños de la zona de juego y las piezas en funcion del tamaño de la ventana
function ajustarTam() {

	// Pantallas pequeñas
	if(window.innerWidth<480)
	{

		document.getElementById('zonaJuego').width = 480;
		document.getElementById('zonaJuego').height = 360;

		document.getElementById('pieza1').width = 400;
		document.getElementById('pieza1').height = 350;

		document.getElementById('pieza2').width = 400;
		document.getElementById('pieza2').height = 350;

		document.getElementById('pieza3').width = 400;
		document.getElementById('pieza3').height = 350;


	}
	else
	{	
		// Pantallas grandes
		if(window.innerWidth>981)
		{

			document.getElementById('zonaJuego').width = 628;
			document.getElementById('zonaJuego').height = 550;

			document.getElementById('pieza1').width = 300;
			document.getElementById('pieza1').height = 150;

			document.getElementById('pieza2').width = 300;
			document.getElementById('pieza2').height = 150;

			document.getElementById('pieza3').width = 300;
			document.getElementById('pieza3').height = 150;
		}
		else  // Pantallas medianas
		{
			document.getElementById('zonaJuego').width = 628;
			document.getElementById('zonaJuego').height = 400;

			document.getElementById('pieza1').width = 250;
			document.getElementById('pieza1').height = 150;

			document.getElementById('pieza2').width = 250;
			document.getElementById('pieza2').height = 150;

			document.getElementById('pieza3').width = 250;
			document.getElementById('pieza3').height = 150;
		}
	}



}



/* Funcion para dividir la zona de juego en casillas de 10x10 */
function crearZona(zona, numDiv)
{
	//console.log(zona);
	let cv = document.getElementById(zona); 
		ctx = cv.getContext('2d'); 		
		divisiones = numDiv;    							// Numero de divisiones que queremos hacer
		incX = Math.round(cv.width/divisiones);
		incY = Math.round(cv.height/divisiones);

	cv.width = cv.width; 
	ctx.beginPath(); 		

	ctx.lineWidth = 2;

	ctx.strokeStyle = '#BABDB6FF';
			
	for(let i=1; i<divisiones; i++)
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


	seleccionarPiezas(); 		// Seleccion de piezas aleatorias
}

// Función para seleccionar aleatoriamente 3 de las 9 piezas disponibles
function seleccionarPiezas()
{

	let piezas = ['cuadradoG', 'cuadradoP', 'L', 'punto', 'filaG', 'filaP', 'columnaG', 'esquina', 'columnaP'];

	// Obtenemos las 3 piezas aleatorias
	let pieza1 = piezas.elementoAleatorio();
		pieza2 = piezas.elementoAleatorio();
		pieza3 = piezas.elementoAleatorio();
		pieza1Final = '';
		pieza2Final = '';
		pieza3Final = '';

	// Asignamos angulo de rotacion a cada una de las piezas
	pieza1Final = obtenerAngulo(pieza1);
	pieza2Final = obtenerAngulo(pieza2);
	pieza3Final = obtenerAngulo(pieza3);


	console.log(pieza1Final[0], pieza1Final[1]);
	console.log(pieza2Final[0], pieza2Final[1]);
	console.log(pieza3Final[0], pieza3Final[1]);

	

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
		piezaFinal = ''; 					// Pieza con su angulo de rotacion
		angulo='';

	if(pieza=='L' || pieza=='esquina')
	{
		// Piezas que pueden rotar en cualquier angulo sin problemas
		angulo = angulos.elementoAleatorio();
		piezaFinal = [pieza, angulo];
	}
	else
	{
		if(pieza=='filaG' || pieza=='filaP' || pieza=='columnaG' || pieza=='columnaP')
		{
			// Piezas que solo pueden rotar en 2 angulos
			angulo = angulos2.elementoAleatorio();
			piezaFinal = [pieza, angulo];
		}
		else
		{
			// Piezas que da igua la rotacion, siempre se van a dibujar igual
			angulo = 0;
			piezaFinal = [pieza, angulo];
		}
	}


	return piezaFinal
}