
var contCartas; 	// Para contar el numero de cartas mostradas y comprobar parejas
var	carta1;
var	carta2;
var jugadas;
var parejas; 		// Para saber cuantas parejas hay completas

var cartas = [];  	// Array con el orden en el que se muestran las cartas

// Se inicia el juego
function iniciarJuego()
{

	crearEstructuraCajas();

	contCartas = 0;
	jugadas = 0;
	parejas = 0;

	checkJugadas();
}


/* Funcion para pedir el orden en el que se van a colocar las parejas y dibujar las cajas */
function crearEstructuraCajas()
{

	let xhr = new XMLHttpRequest();
		url = 'api/imagenes';

	xhr.open('GET', url, true);

	xhr.onload = function()
	{

		let r = JSON.parse(xhr.responseText);


		cartas = r.IMAGENES;

		let html = '';

		// EN total hay 12 cajas (6 parejas)
		for(let i=1; i<13; i++)
		{

			html += '<article>';

				html += '<a title="Dar la vuelta" onclick="mostrarFigura('+ i +');" >';

					html += '<div id="contenedor" class="img'+ i +'">';

							html += '<p><strong>'+ i +'</strong></p>';

							html += '<img src="imgs/fig'+ r.IMAGENES[i-1] +'.svg" alt="foto de una de las parejas">';

					html += '</div>';

				html += '</a>';

			html += '</article>';

		}


		document.querySelector('#principal').innerHTML = html;


	};


	xhr.send();
}


// Funcion para dar la vuelta a una carta para mostrar la figura
function mostrarFigura(numero)
{

	let elemP = document.querySelector('.img'+numero+'>p'); 	// Elemento P seleccionado
		img = document.querySelector('.img'+numero+'>img'); 	// Imagen seleccionada

		elemP.style.display = 'none';
		img.style.display = 'inline-block';  // Inline-block para que se pueda ajustar al centro la imagen con text-align

	if(contCartas==0)
	{
		pareja1 = numero-1; // Restar 1 para luego poder acceder correctamente al array de cartas que empieza en el valor 0
	}
	else
	{
		pareja2 = numero-1;
	}

	contCartas ++;


	if(contCartas==2)
	{
		// 2 cartas dadas la vuelta, se comprueba si son pareja
		comprobarParejas(pareja1+1, pareja2+1);

		contCartas = 0; // Reset del contador

	}

}


function comprobarParejas(img1, img2)
{

	// Comprobamos si las dos cartas son pareja o no
	if(cartas[pareja1] == cartas[pareja2])
	{	
		// Seleccion de ambas imagenes
		let cont1 = document.querySelector('.img'+img1);
			cont2 = document.querySelector('.img'+img2);

		// Muestra fondo verde para ambas cartas iguales
		cont1.style.backgroundColor = '#8AE234FF';
		cont2.style.backgroundColor = '#8AE234FF';

		// Son parejas
		parejas ++;
	}
	else
	{
		// No son pareja
		setTimeout(ocultarCartas, 1500); 		// Se llama a la funcion despues de x seg (no se puede poner funcion con parametros)

	}

	jugadas ++;  // Realizada una jugada

	checkJugadas();


	checkFinJuego();
}



function ocultarCartas()
{
	let valor1 = pareja1 +1;
		valor2 = pareja2 +1;

	// Oculta carta 1
	let elemP1 = document.querySelector('.img'+valor1+'>p'); 	// Elemento P seleccionado
		imagen1 = document.querySelector('.img'+valor1+'>img'); 	// Imagen seleccionada

	elemP1.style.display = 'inline-block';
	imagen1.style.display = 'none';  // Inline-block para que se pueda ajustar al centro la imagen con text-align

	// Oculta carta 2
	let elemP2 = document.querySelector('.img'+valor2+'>p'); 	// Elemento P seleccionado
		imagen2 = document.querySelector('.img'+valor2+'>img'); 	// Imagen seleccionada

	elemP2.style.display = 'inline-block';
	imagen2.style.display = 'none';  // Inline-block para que se pueda ajustar al centro la imagen con text-align

}


function checkJugadas()
{

	let html = 'Jugadas: '+jugadas;

	document.querySelector('#jugadas').innerHTML = html;

}


function checkFinJuego()
{

	if(parejas==6)
	{
		// Se han completado todas las parejas

		// Fin del juego
		var modal = document.getElementById('myModal');  

		modal.style.display = 'block';  	

		let html = '<p>Enhorabuena! Has conseguido todas las parejas en <strong>'+ jugadas +'</strong> jugadas. </p>';
			html +=  '<span class="jugar" onclick="volverJugar();">Volver a jugar</span>';

		document.querySelector('.modal-content').innerHTML = html;

	}
}


function volverJugar()
{

	var modal = document.getElementById('myModal');  

		modal.style.display = 'none';  	

	iniciarJuego(); 		// Volvemos a empezar (se sustituye todo otra vez asi que no hay que hacer nada mas)
}