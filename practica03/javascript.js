

// Ajustamos tamaños de la zona de juego y las piezas en funcion del tamaño de la ventana
function ajustarTam() {

	// Pantallas pequeñas
	if(window.innerWidth<480)
	{

		document.getElementById('zonaJuego').width = 480;
		document.getElementById('zonaJuego').height = 360;

		document.getElementById('pieza1').width = 480;
		document.getElementById('pieza1').height = 350;

		document.getElementById('pieza2').width = 480;
		document.getElementById('pieza2').height = 350;

		document.getElementById('pieza3').width = 480;
		document.getElementById('pieza3').height = 350;


	}
	else
	{	
		// Pantallas grandes
		if(window.innerWidth>981)
		{

			document.getElementById('zonaJuego').width = 880;
			document.getElementById('zonaJuego').height = 760;
		}
		else
		{

		}
	}



}



/* Funcion para dividir la zona de juego en casillas de 10x10 */
function crearZona(zona, numDiv)
{
	console.log(zona);
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