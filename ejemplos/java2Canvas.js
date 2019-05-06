const TAM = 360; // Tamaño del canvas

// Funcion para definir el tam del canvas
function prepararCanvas()
{

	//let cv = document.getElementById('cv01');

	//cv.width = TAM;
	//cv.height = cv.width;

	let cvs = document.querySelectorAll('canvas');  // Seleccionamos todos los canvas que haya

	cvs.forEach(function(cv){  // Asignamos el mismo tamaño a todos

		cv.width = TAM;
		cv.height = cv.width;

	});
}


function pintarImagen()
{
	let cv = document.getElementById('cv01');
		ctx = cv.getContext('2d');
		imagen = new Image();


	imagen.onload = function() // Cuando se cargue la imagen es cuando se dibuje 
	{
		ctx.drawImage(imagen, 0, 0, cv.width, cv.height);  // Imagen a dibujar, pos x, pos y de la imagen a dibujar, tam y altura de la imagen

	};
	imagen.src = 'fotos/30.jpg';  // Direcc donde esta la imagen a cargar
	
}

// Funcion para cargar una imagen
function cargarFichero(img)
{
	if(img.files.length < 1) // Solo si se ha cargado un fichero se intenta obtener la URL del mismo
	{
		return false;
	}
	else{

			let fr = new FileReader();

			fr.onload = function() {

					let cv = document.getElementById('cv01');
						ctx = cv.getContext('2d');
						imagen = new Image();

					imagen.onload = function(){

						cv.width = cv.width;  // Hacemos que cambie el tam del canvas (del mismo tam) para que se borre lo que habia antes dibujado en el canvas
						let alto = imagen.height * cv.height / imagen.width;  // Para que la imagen no aparezca deformada y sea proporcional al tamaño del canvas
						ctx.drawImage(imagen, 0, 0, cv.width, alto);

					};

					imagen.src = fr.result; // En fr.result se encuentra el resultado, que en este caso es la ruta del fichero cargado


			};


			fr.readAsDataURL(img.files[0]);   // Obtenemos la url del primer fichero que se pasa
	}


}


function pintarImagen2()
{
	let cv = document.getElementById('cv01');
		ctx = cv.getContext('2d');
		imagen = new Image();


	imagen.onload = function() // Cuando se cargue la imagen es cuando se dibuje 
	{
		ctx.drawImage(imagen, 100, 100, 300, 200, 50, 50, 100, 50);  // Los 4 ultimos valores definen el tam y pos de la imagen que se va a dibujar (x, y, ancho y alto)

	};
	imagen.src = 'fotos/30.jpg';  // Direcc donde esta la imagen a cargar
	
}


// FUncion para copiar lo que hay dibujado en el canvas 1 al canvas 2
function copiarImagen()
{
	let cv01 = document.getElementById('cv01');
		cv02 = document.getElementById('cv02');

		ctx02 = cv02.getContext('2d');

	ctx02.drawImage(cv01, 0, 0);


}

// Otra forma para copiar el contenido de un canvas a otro
function copiarImagen2()
{
	let cv01 = document.getElementById('cv01');
		ctx01 = cv01.getContext('2d');
		cv02 = document.getElementById('cv02');

		ctx02 = cv02.getContext('2d');

		imgData = ctx01.getImageData(0, 0, cv01.width, cv01.height);

	ctx02.putImageData(imgData, 0, 0);  // Coloca una imagen(vector) en la pos 0,0


}


var DIVISIONES = 3;


function pintarDivisiones()
{
	let cv = document.getElementById('cv02');
		ctx = cv.getContext('2d');
		tamDiv = cv.width / DIVISIONES;

	ctx.beginPath(); 

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000';

	for(let i=1; i<DIVISIONES;i++)
	{

		ctx.moveTo(i * tamDiv, 0);
		ctx.lineTo(i* tamDiv, cv.height);

		// Horizontales
		ctx.moveTo(0, i*tamDiv);
		ctx.lineTo(cv.width, i*tamDiv);



	}

	ctx.stroke();


}


function prepararCV02(){

	let cv = document.getElementById('cv02');

	cv.onmousemove = function(evt) {  // Con el movimiento del raton llamamos a la funcion

			//console.log(evt.offsetX + ' : ' + evt.offsetY);
			//if(evt.offsetX <0 || evt.offsetX > 359 || evt.offsetY<0) || evt.offsetY > 359)
			//{
			//	return false;
			//}
			//else
			//{
				let tam= cv.width / DIVISIONES;
					fila = Math.trunc(evt.offsetY / tam);  // Fila en la que esta el raton. con trun truncamos el valor
					columna = Math.trunc(evt.offsetX / tam);

				console.log(fila + ' : ' + columna);
			//}


		// Pintar imagen

		let ctx = cv.getContext('2d');
			img = new Image();

		// Esto es lo mismo que la practica pero habra que pintar mas celdas en funcion del tam de la ficha
		img.onload = function(){

			cv.width = cv.width;  	// Borramos la imagen dibujada anterioremente

			ctx.drawImage(img, columna*tam, fila*tam, tam, tam);  // Dibujamos la imagen dentro de la zona dond estemos apuntando con el raton

			pintarDivisiones(); // Volvemos a dibujar las divisiones

		};

		img.src = 'fotos/30.jpg';

	};
}







