function botonPulsado()
{

	console.log('Boton pulsado()')  /* La consola esta en la pagina html al darle a inspeccionar */
}

// Ejemplo de peticion GET: Peticion de titulos de fotos al pulsar el boton.
function pedirFotos()
{

	// XMLHttpRequest para el intercambio y manipulacion de la informacion
	// Con esto podemos hacer peticiones al servidor y recibir una respuesta
	let xhr = new XMLHttpRequest();  /* Let para declarar variables (tambien esta var) */

	let url	= 'api/fotos'; 			/* Direcc relativa donde se encuentran las fotos */

	xhr.open('GET', url, true);  // Especificamos las caract de la conexión. GET para indicar que queremos obtener algo, la url donde esta el recurso del servidor
								 // true para que la peticion sea asincrona.

	xhr.onload= function() // onload es cuando la peticion ha finalizado con exito
	{  

		//console.log(xhr.responseText); /* Mostramos por la consola del nav la respuesta del servidor en forma de cadena */

		let r = JSON.parse(xhr.responseText);  /* Parseando la respuesta a un objeto javascript */
			html ='';

		//console.log(r);  /* Aparece la información de las fotos mejor estructurada */
		//console.table(r); /* Informacion en forma de tabla */

		html+='<ul>';
		for (let i = 0; i < r.FILAS.length; i++)  /* Recorremos todas las filas de la info obtenida */
		{
			html+='<li>' + r.FILAS[i].titulo + '</li>'; // Los titulos de las fotos 
			
		}

		html+='</ul>';
		
		document.querySelector('body>section>div').innerHTML=html;

		// querySelector --> Permite devolver el elemento obtenido mediante los selectores de html
		// innerHTML --> Devuelve el fragmento HTML que representa el contenido

	};

	xhr.send();  // Envia la petición que hemos hecho al servidor
}



// Ejemplo de POST: Siempre para hacer una peticion post necesitamos url, objeto XMLHTTP y un elemento formulario
function hacerLogin(frm)
{

	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.
	var fd = new FormData(frm); 	// Mediante formData podemos encapsular todos los campos de un formulario de HTML
		url = 'api/sesiones'; 

	xhr.open('POST', url, true);   // Indicamos que queremos enviar datos al servidor

	xhr.onload=function()
	{
		// SessionStorage es un sistema de almacenamiento que guarda los datos de forma temporal durante la sesion 
		// de nav en una ventana del navegador.

		//sessionStorage.setItem("login", frm.login.value);  // Asiganmos el valor del campo de login del formulario al campo de login del sessionStorage
		//sessionStorage.setItem("pwd", frm.pwd.value);

		console.log(xhr.responseText);

		let r = JSON.parse(xhr.responseText);

		if(r.RESULTADO == 'OK')  // Solo si la peticion ha tenido exito
		{
			// Con localstore se almacena la sesion hasta que nosotros no la borremos explicitamente.
			sessionStorage['usuario'] = xhr.responseText; // Almacenamos en la variable usuario toda la respuesta

			// Si ponemos location.search devuelve todo lo que hay despues del interrogante en la url
			//location.search.substr(1)
			//location.seacrh.substr(1).split('&'); Corta la cadena empezando desde la posiocion 1 desde el interrogante(el interrogante es 0) donde los ampersans.
			//location.href = 'http://localhost/pcw/practica02/index.html'; // Redirigimos a otra pagina.

		}
		
	};


	xhr.send(fd);  // Como aqui la peticion es un post, tenemos que pasar los datos (aqui es cuando se hace la peticion)

	//console.log(frm.login.value); // Valor por consola de lo que hay en login 

	return false;  // Evita que recarge la pagina cada vez que pulsamos el boton de enviar el formulario y que se haga la peticion correctamente
}





function pedirFavoritas()
{

	let url = 'api/usuarios/';  // Base para la url
		xhr = new XMLHttpRequest();
		//usu;

	if(!sessionStorage['usuario'])  // Si no estamos logeados no se hace nada
	{
		return false;
	}

	usu = JSON.parse(sessionStorage['usuario']);


	// Completamos la url con la info que falta
	url += usu.login + '/favoritas';  // Favoritas del usuario



	xhr.open('GET', url, true);

	xhr.onload = function(){

		let r = JSON.parse(xhr.responseText);

		if(r.RESULTADO == 'OK')
		{
			console.log(r);

			let html = '';

			r.FILAS.forEach(function(e, idx, v) {// Para cada fila
				html += '<article>';

				html += '<h3>' + e.titulo + '</h3>';
				html += '<img src="fotos/' + e.fichero + '"alt="' + e.descripcion + '">';
				
				html += '</article>';
			});

			document.querySelector('#ff>div').innerHTML = html;
		}



	};


	xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);  // CABECERA Y VALOR DE LA CABECERA

	xhr.send();




}



// Peticion GET de etiquetas
function pedirEtiquetas()
{
	let url = 'api/etiquetas';
		xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);
	xhr.onload = function()
	{
		let html = '';
		r = JSON.parse(xhr.responseText);

		r.FILAS.forEach(function(e){

			html += '<option>';

				html += 'hola';

			html += '</option>';
		});

		document.querySelector('#etiquetas').innerHTML=html;
	};

	xhr.send();
}

function mostrarValor(inp)
{

	console.log(inp.value);



}