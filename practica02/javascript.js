

// Función para hacer el login del usuario comprobando que el usuario y contraseña son correctos
function loginUsuario(formulario)
{
	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.

	if(xhr) // Si se ha creado el objeto, se completa la petición
	{
		let fd = new FormData(formulario); // Mediante formData podemos encapsular todos los campos de un formulario de HTML
			url = 'api/sesiones'; 			// Direccion donde estan las sesiones

		xhr.open('POST', url, true);   // Indicamos que queremos enviar datos al servidor

		xhr.onload=function()  // La funcion se lanzara cuando finaliza la peticion y se ha recibido una respuesta.
		{

			let r = JSON.parse(xhr.responseText);

			if(r.RESULTADO == 'OK')  // Solo si la peticion ha tenido exito
			{

				sessionStorage.setItem("login", formulario.login.value);  // Asiganmos el valor del campo de login del formulario al campo de usuario del sessionStorage
				sessionStorage.setItem("pwd", formulario.pwd.value);

				sessionStorage['usuario'] = xhr.responseText; // Almacenamos en la variable usuario toda la respuesta


				// Redireccion cuando se ha hecho el login bien
				window.location.replace('index.html');   		 	// REPLACE --> Borra la url actual de tal manera que no se puede volver atras al pulsar el boton de ir 
																	// a la pagina anterior.

				//window.location.href='index.html'; 				// HREF --> Si que se puede ir a la pagina anterior.

			}


		};


		xhr.send(fd); 			// Enviamos los datos del formulario

		return false;    		// Evita que recarge la pagina cada vez que pulsamos el boton de enviar el formulario

	}

}

// Muestra las fotos mejor valoradas en index
function fotosMejorValoradas()
{
	// Peticion GET
	let xhr = new XMLHttpRequest();

	url = 'api/fotos/megusta';
	xhr.open('GET', url, true);

	xhr.onload= function(){

		let r = JSON.parse(xhr.responseText);

		//console.log(r);

		html = '';

		/* Recorremos hasta 6 fotos para mostar en la primera pagina de index*/
		for (let i = 0; i < 6; i++)  
		{

			html += '<article>';

				html += '<div class="contenedor">';

					html += '<div class="autorBox">';

						html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html">' + r.FILAS[i].login + '</a> <b>|</b> <a class="enlaces" title="Buscar por etiquetas" href="buscar.html">#hackaton</a> <a class="enlaces" title="Buscar por etiquetas" href="buscar.html">#2018</a></p>';

					html += '</div>';

					html += '<a title="Ver foto" href="foto.html">';

						html += '<img src="fotos/' + r.FILAS[i].fichero + '" alt="'+ r.FILAS[i].descripcion +'" class="imagIndex" >'; 

					html += '</a>';

					html += '<div class="textoImg">';

						html += '<h4>' + r.FILAS[i].titulo + '</h4>';
						html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i].nmegusta + ' <span class="icon-heart-empty"></span>' + r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';

					html += '</div>';
				html += '</div>';
				
			html += '</article>';
			
		}

		document.querySelector('.preview').innerHTML=html;


	};

	xhr.send();  // Envia la petición que hemos hecho al servidor



}



// Muestra las fotos favoritas del usuario
function fotosFavoritas()
{
	// Peticion GET
	let xhr = new XMLHttpRequest();
		url = 'api/usuarios/'; 

	let usu = JSON.parse(sessionStorage['usuario']);  // Parseamos toda la info que hay en la

	// Completamos la url con la info que falta
	url += usu.login + '/favoritas';  // Favoritas del usuario

	xhr.open('GET', url, true);

	xhr.onload = function()
	{
		let r = JSON.parse(xhr.responseText);

		// Si todo ha ido bien
		if(r.RESULTADO == 'OK')
		{
			let html = '';

			r.FILAS.forEach(function(e, idx, v) {// Para cada fila

				html += '<article>';

					html += '<div class="contenedor">';

						html += '<div class="autorBox">';

							html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html">' + e.login + '</a> <b>|</b> <a class="enlaces" title="Buscar por etiquetas" href="buscar.html">#hackaton</a> <a class="enlaces" title="Buscar por etiquetas" href="buscar.html">#2018</a></p>';

						html += '</div>';

						html += '<a title="Ver foto" href="foto.html">';

							html += '<img src="fotos/' + e.fichero + '" alt="'+ e.descripcion +'" class="imagIndex" >'; 

						html += '</a>';

						html += '<div class="textoImg">';

							html += '<h4>' + e.titulo + '</h4>';
							html += '<p><span class="icon-thumbs-up"></span>' + e.nmegusta + ' <a title="Eliminar de favoritas" class="favorita" href="favoritas.html"><span class="icon-heart"></span></a>' + e.nfavorita + ' <span class="icon-comment-empty"></span>' + e.ncomentarios + '</p>';

						html += '</div>';
					html += '</div>';
					
				html += '</article>';

				
			});

			document.querySelector('.preview').innerHTML=html;

		}

	};

	xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);  // Autorizacion necesaria para acceder a las fotos favoritas

	xhr.send();  // Envia la petición que hemos hecho al servidor

}


// Funcion para mostrar todas las etiquetas disponibles en la base de datos cuando estamos haciendo focus 
// en el campo de etiquetas de nueva foto.
function pedirEtiquetas()
{

	let xhr = new XMLHttpRequest();
		url = 'api/etiquetas';

	xhr.open('GET', url, true); 

	xhr.onload = function() 
	{

		let html = '';
		r = JSON.parse(xhr.responseText);

		if(r.RESULTADO == 'OK')
		{
			r.FILAS.forEach( function(e) {
				
				html += '<option>';

					html += e.nombre;   // Nombre de la etiqueta

				html += '</option>';


			});

			document.querySelector('#etiquetas').innerHTML = html;

		}

	};

	xhr.send();

}