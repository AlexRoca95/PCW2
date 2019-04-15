

function ejemplo01()
{
	let cv = document.getElementById('cv01');  // Contiene el canvas
		ctx = cv.getContext('2d'); 				// Contiene el contexto del canvas para dibujar

	ctx.moveTo(100,100); 						// 	Para indicar donde se empieza a pintar (como si fuese un lapiz en una hoja de papel blanca)
												// Hay que tener en cuenta el tamaño del canvas que hemos definido en css

	ctx.lineTo(200, 150);



	ctx.stroke(); 								// Para realizar el dibujo
}


function ejemplo02()
{
	let cv = document.getElementById('cv01');  
		ctx = cv.getContext('2d'); 		

	ctx.beginPath();							// Siempre empezar con el begin path para evitar arrastrar colores de otras funciones

	ctx.moveTo(99.5, 0); 						// 	X e y

	ctx.lineTo(99.5, cv.height); 				// Dibujamos una linea desde x=100 hasta y=alto del canvas

	ctx.lineWidth = 3; 							// Ancho de la linea. Si lo definimos ya no se ve borroso al hacer zoom

	ctx.strokeStyle = '#A00'; 					// Para cambiar el color a rojo
	ctx.stroke(); 								// Para realizar el dibujo

	ctx.beginPath(); 							// Indicamos que queremos hacer una traza nueva (se evita que por ejemplo style se aplique el mismo a las dos lineas dibujadas)

	ctx.strokeStyle = '#8AE234FF'; 				// Siempre se va a guardr el ultimo valor que le hayamos dado al style (es decir ambas lineas se pintaran de este color)

	ctx.moveTo(200.5, 0);

	ctx.lineTo(200.5, cv.height);

	ctx.stroke();
}


function dibujarCuadrado01()
{
	let cv = document.getElementById('cv01');  // Contiene el canvas
		ctx = cv.getContext('2d'); 				// Contiene el contexto del canvas para dibujar

	ctx.beginPath(); 							// De esta manera no utilizamos el ultimo color utilizado en otra funcion para pintar lo que tengamos que pintar
	ctx.strokeStyle = '#204A87FF';
	ctx.strokeRect(200, 200, 100, 75);			// Dibujo de rectangulo (2 ult valores: ancho y alto)

	//ctx.stroke();
}


function dibujarCuadrado02()
{
	let cv = document.getElementById('cv01'); 
		ctx = cv.getContext('2d'); 				

	ctx.beginPath(); 							
	ctx.fillStyle = '#FCE94FFF'; 				// Para rellenar de un color
	ctx.fillRect(200, 200, 100, 75);			// Rellenamos un rectangulo del color anterior

	//ctx.stroke();
}

function dibujarCirculo01()
{
	let cv = document.getElementById('cv01'); 
		ctx = cv.getContext('2d'); 				

	ctx.beginPath(); 		
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#8F5902FF';					
	
	ctx.arc(300, 250, 100, 0, Math.PI/2, true); 		


	ctx.stroke();
}


function rejilla()
{
	let cv = document.getElementById('cv01'); 
		ctx = cv.getContext('2d'); 		
		divisiones = 3; 			// Para la practica que hay que dibujar uno de 10, solo ponemos aqui 10
		incX = Math.round(cv.width/divisiones);
		incY = Math.round(cv.height/divisiones);

	cv.width = cv.width;  		// Borra cada vez que pulsamos
	ctx.beginPath(); 		

	ctx.lineWidth = 2;

	ctx.strokeStyle = '#8F5902FF';
			
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






function prepararCanvas()
{
	let cv = document.getElementById('cv01'); 



	cv.   = function(evt){

		console.log(evt.offsetX + ',' + evt.offsetY); // Muestra la posicon en pixeles

		let fila, columna;
			divisiones = 3; 		
			incX = Math.round(cv.width/divisiones);
			incY = Math.round(cv.height/divisiones);


		fila = Math.cell(evt.offsetY / incY);
		columna = Math.cell(evt.offsetX / incX);


		console.log(fila + ',' + columna);







	}






}










