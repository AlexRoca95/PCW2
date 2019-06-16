function prepararCanvas()
{
	let cv = document.getElementById('cv01');

	cv.width = 480;
	cv.height = cv.width;
}

// FUncion para preparar el drag and drop
function prepararDrD()
{

	let imgs = document.querySelectorAll('#imgs>img');
	cv = document.getElementById('cv01');

	// Origen del DrD
	imgs.forEach(function (e, idx) {

		e.ondragstart = function(evt) {

			evt.dataTransfer.setData('text/plain', idx);



		};


	});


	// Destino del DrD
	cv.ondragover = function(evt){

		evt.preventDefault();

	};

	// Cuando se suelte el elemento (en este caso la imagen)
	cv.ondrop = function(evt) {

		// Codigo para cargar imagenes procedentes dentro del HTML
		//console.log(evt.dataTransfer.getData('text/plain')); // Datos de cada imagen (creo)
		// Para coger las fichas habria que coger la posicion X e Y donde se suelta la ficha y dividirlo entre las filas y columnas
		//let idx = evt.dataTransfer.getData('text/plain');
			//img = document.querySelectorAll('imgs>img')[idx];
			//alto = cv.width * (img.naturalHeight / img.naturalWidth);

		//cv.width = cv.width;
		//cv.getContext('2d').drawImage(img, 0, 0, cv.width, alto);


		// Codigo para mostrar ficheros arrastrado desde el escritorio
		let fichero = evt.dataTransfer.files[0];

			// Evitamos la funcion por defecto que hace el nav que es cargar el fichero en el navegador
			evt.preventDefault();
			evt.stopPropagation();
			fr = new FileReader(); // Sirve para identificar el objeto (si es una imagen etc)

			fr.onload = function(){

				let img = new Image();

				img.onload = function(){
					let ctx = cv.getContext('2d');
						alto = (img.height / img.width) * cv.width;

					cv.width = cv.width;
					ctx.drawImage(img, 0, 0, cv.width, alto);

				};

				// En .result tenemos el fichero leido
				img.src = fr.result;

			};

			fr.readAsDataURL(fichero);


	};

}
/*
function mostrarColor()
{
	let cv = document.getElementById('cv01');
		ctx = cv.getContext('2d');

		imgData = ctx.getImageData(0,0, cv.width, cv.height);

	// Recorremos la imagen como vector
	for(let i=0; i<imgData.width*img.height; i++)
	{
		//imgData.data[1*4+0] = 0; 	// Red
		imgData.data[1*4 +1] = 0;  // Green

		imgData.data[1*4+2] = 0; 	// Bluew

	}

	ctx.putImageData(imgData, 0, 0);


}
*/

function mostarColor(color)
{
	let cv = document.getElementById('cv01');
		ctx = getContext('2d');
		imgData = cv.getImageData(0,0,cv.width, cv.height);
			width = cv.height;
		worker = new Worker('worker.js');
		datos;

	worker.onmessage = function(evt)
	{
		let imgData = evt.data;
		ctx.putImageData(imgData, 0, 0);

	};

	datos = {'color': color, 'imgData': imgData};
	worker.postMessage(datos);







}