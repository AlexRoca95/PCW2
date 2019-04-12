

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
				window.location.replace('index.html?1');   		 	// REPLACE --> Borra la url actual de tal manera que no se puede volver atras al pulsar el boton de ir 
																	// a la pagina anterior.

				//window.location.href='index.html'; 				// HREF --> Si que se puede ir a la pagina anterior.

			}
			else
			{
				// Si se ha producido un error de autentificacion
				if(r.RESULTADO == 'ERROR')
				{
					var modal = document.getElementById('myModal');  // Obtenemos el elemento
					modal.style.display = "block";  				// Mostramos la ventana con info del error.
				}
			}


		};


		xhr.send(fd); 			// Enviamos los datos del formulario

		return false;    		// Evita que recarge la pagina cada vez que pulsamos el boton de enviar el formulario

	}

}

// Hay que borrar toda la info del usuario.
function hacerLogout()
{
	// Borramos toda la info sobre el usuario.
	sessionStorage.clear();
	localStorage.clear();

}

// En funcion de si el usuario esta logeado o no, se mostrara un menu o otro (version grande/mini de pantalla)
function mostrarMenu()
{


	let menu = document.querySelector('#menu');
		html = '';


	// Comprobamos si el usuario esta logeado o no
	if(sessionStorage['usuario'])
	{

		usu = JSON.parse(sessionStorage['usuario']);  // Parseamos la info que hay en usuario


		//Logeado
		html += '<li><a href="nueva.html"><span class="icon-camera"></span>Nueva Foto</a></li>';
		html += '<li><a href="favoritas.html"><span class="icon-heart"></span>Favoritas</a></li>';
		html += '<li><a href="index.html?1" onclick="hacerLogout();"><span class="icon-logout"></span>Logout (' + usu.login + ')</a></li>';

	}
	else
	{
		// No logeado
		html += '<li><a href="login.html"><span class="icon-user"></span>Login</a></li>';
		html += '<li><a href="registro.html"><span class="icon-user-add"></span>Registro</a></li>';

	}


	menu.innerHTML += html;

}

// Funcion para cerrar la ventana emergente cuando se pulsa "X" en ella y hacer focus al campo login
function cerrarVentana()
{
	var modal = document.getElementById('myModal');  // Obtenemos el elemento
	modal.style.display = "none";  	// Dejamos de mostrar la ventana

	var login = document.getElementById('campoLogin');

	login.focus(); 		// Focus en el campo de login al cerrar ventana						
}

// Muestra las fotos mejor valoradas en index
function fotosMejorValoradas()
{
	// Peticion GET
	let xhr = new XMLHttpRequest();

		url = 'api/fotos/megusta';
		pagActiva = location.search.substr(1);

	xhr.open('GET', url, true);

	xhr.onload= function(){

		let r = JSON.parse(xhr.responseText);

		//console.log(r);
		//console.log(r.FILAS[0].etiquetas[0].nombre);


		totalPag = calcularTotalPagFotos(r, xhr);

		totalFotosServidor = r.FILAS.length; 			// Numero total de fotos que tenemos en nuestro servidor

		let total = 0; 									// 
			inicio = 0; 								// Variables para los bucles for (inicio del bucle y final)

		html = '';
		totalFotosPag = pagActiva * 6; 					// Para saber cuantas fotos se deberian mostrar en funcion de la pag en la que estemos


		// Si el total de fotos a mostrar es igual al numero de fotos que hay en el servidor o es menor, entonces quiere decir que se muestran todas las
		// fotos en la pagina que estamos
		if(totalFotosPag==totalFotosServidor || totalFotosPag<totalFotosServidor)
		{	
				total = totalFotosPag;
				inicio = totalFotosPag - 6;

			for (let i=inicio; i<total; i++)
			{

				html += '<article>';

					html += '<div class="contenedor">';

						html += '<div class="autorBox">';

							html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html?'+ r.FILAS[i].login + '">' + r.FILAS[i].login + '</a> <b>|</b> ';
							for(let i3=0; i3<r.FILAS[i].etiquetas.length; i3++)
							{

								html += '<a class="enlaces" title="Buscar por etiquetas" href="buscar.html?'+ r.FILAS[i].etiquetas[i3].nombre + '">#'+ r.FILAS[i].etiquetas[i3].nombre +' </a>';
								
							}

						html += '</div>';

						html += '<a title="Ver foto" href="foto.html?' + r.FILAS[i].id + '">';

							html += '<img src="fotos/' + r.FILAS[i].fichero + '" alt="'+ r.FILAS[i].descripcion +'" class="imagIndex" >'; 

						html += '</a>';

						html += '<div class="textoImg">';

							html += '<h4>' + r.FILAS[i].titulo + '</h4>';
							html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i].nmegusta + ' <span class="icon-heart-empty"></span>' + r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';

						html += '</div>';
					html += '</div>';
					
				html += '</article>';
			}

		}
		else // Si el total de fotos de pagina a mostrar es mayor que el del servidor quiere decir que en esta pagina se muestran menos fotos que el maximo (que son 6)
		{

			inicio = 6 * (pagActiva-1);   					
			total = (totalFotosPag - totalFotosServidor) + inicio;

			for (let i2=inicio; i2<total; i2++)
			{

				html += '<article>';

					html += '<div class="contenedor">';

						html += '<div class="autorBox">';

							
							html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html?'+ r.FILAS[i2].login+ '">' + r.FILAS[i2].login + '</a> <b>|</b> ';
							for(let i3=0; i3<r.FILAS[i2].etiquetas.length; i3++)
							{

								html += '<a class="enlaces" title="Buscar por etiquetas" href="buscar.html?'+ r.FILAS[i2].etiquetas[i3].nombre + '">#'+ r.FILAS[i2].etiquetas[i3].nombre +' </a>';

							}
						html += '</div>';

						html += '<a title="Ver foto" href="foto.html?' + r.FILAS[i2].id + '">';

							html += '<img src="fotos/' + r.FILAS[i2].fichero + '" alt="'+ r.FILAS[i2].descripcion +'" class="imagIndex" >'; 

						html += '</a>';

						html += '<div class="textoImg">';

							html += '<h4>' + r.FILAS[i2].titulo + '</h4>';
							html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i2].nmegusta + ' <span class="icon-heart-empty"></span>' + r.FILAS[i2].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i2].ncomentarios + '</p>';

						html += '</div>';
					html += '</div>';
					
				html += '</article>';
			}
		}

		document.querySelector('.preview').innerHTML=html;


	};

	xhr.send();  // Envia la petición que hemos hecho al servidor

}

// Funcion para calculara el numero total de paginas de fotos que hay en index
function calcularTotalPagFotos(result, xhr)
{

	let numPag = result.FILAS.length/6;  		// Numero de paginas
		decimal = numPag - Math.floor(numPag) 	// Parte decimal (paginas que no estan completas de fotos)
		i = 0;
		pagActiva = location.search.substr(1);  // Obtenemos de la url la pagina actual en la que estamos


	
	html2 = '';

	html2 += '<li><a href="#" onclick="pasarPagina(1,'+ numPag +');">«</a></li>';

	for (i=1; i<numPag; i++)
	{
		if(pagActiva==i) 	// SI la pagActiva coincide con la i, entonces estamos en esta pagina
		{
			html2+= '<li><a class="active" href="?'+ i +'">'+ i +'</a></li>';
		}
		else
		{
			html2+= '<li><a href="?'+ i +'">'+ i +'</a></li>';
		}

	}

	// Por si hay paginas que no se han completado de fotos (es decir no han llegado a 6 fotos)
	if(decimal!=0)
	{
		if(pagActiva==i)
		{
			html2 += '<li><a class="active" href="?'+ i +'">'+ i +'</a></li>';
		}
		else
		{
			html2 += '<li><a href="?'+ i +'">'+ i +'</a></li>';
		}
	}


	html2 += '<li><a href="#" onclick="pasarPagina(2,'+ numPag +');" >»</a></li>';



	document.querySelector('.paginacion').innerHTML=html2;

	return numPag;

}


function pasarPagina(valor, paginas)
{
	let pagActiva = location.search.substr(1);

	if(valor==1)  // Si valor == 1 quiere decir que queremos ir a la anterior
	{
		if(pagActiva!=1)
		{
			pagActiva = pagActiva - 1;
		}
	}
	else // Si no es 1, quiere decir que queremos ir a la siguiente pagina
	{
		//if(pagActiva<numPag)
		//{
			pagActiva = +pagActiva + +1;
		//}
	}


	window.location.replace('index.html?1'+ pagActiva +'');

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

// Para mostrar la foto correspondiente en foto.html en funcion del ID de foto que se pasa por la url
function mostrarFoto()
{

	//console.log(location.search.substr(1));  // Obtenemos el valor que hay justo despues de '?' en la url

	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.
		url = 'api/fotos/';
		id = location.search.substr(1); // Obtenemos el id de la foto desde la url

	url += id;  // URL con el id de la foto.

	xhr.open('GET', url, true); 

	xhr.onload = function() 
	{	

		let r = JSON.parse(xhr.responseText);

		//console.log(r.FILAS[0].login);

		if(id=='' || r.FILAS.length==0)  // Si no se le pasa ninguna ID o no es una ID valida
		{
			window.location.replace('index.html?1');
		}
		else  // Hay una id
		{
				html = '';
				//console.log(r.FILAS[0].login);


				html+= '<figure>';
					html += '<div>';
						html += '<img src="fotos/' + r.FILAS[0].fichero + '" alt="'+ r.FILAS[0].descripcion +'" class="imagen2">';
					html += '</div>';
					html += '<figcaption>';
						html += '<h2>' + r.FILAS[0].titulo + '</h2>';
						html += '<hr class="LineaFoto">';
						html += '<p class="info"><a class="enlacesFoto" title="Me gusta la foto" href=""><span class="icon-thumbs-up"></span></a>' + r.FILAS[0].nmegusta + ' <a class="enlacesFoto" title="Añadir a favoritas" href=""><span class="icon-heart-empty"></span></a>' + r.FILAS[0].nfavorita + ' <a class="enlacesFoto" title="Seccion comentarios de la Foto" href="#comentarios"><span class="icon-comment-empty"></span></a>' + r.FILAS[0].ncomentarios + '</p>';
						html += '<p class="info">Dimensiones: ' + r.FILAS[0].alto + 'x' + r.FILAS[0].ancho + ' pixeles</p>';
						html += '<p class="info">Peso: ' + r.FILAS[0].peso + ' bytes</p>';
						html += '<div>';
							html += '<p class="autor"> <a class="enlaces" title="Buscar fotos por etiqueta" href="buscar.html">#gatos</a> <a class="enlaces" title="Buscar fotos por etiqueta" href="buscar.html">#animales</a></p>';
							html += '<p>Por <a href="buscar.html" title="Buscar fotos por usuario" class="enlaces" >' + r.FILAS[0].login + '</a></p>';
						html += '</div>'
					html += '</figcaption>';
				html+= '</figure>';


			document.querySelector('#fotoID').innerHTML = html;


			//html = '';

			//html+= '<article>';
				//html+= '<ul id="lista-coment">';
				//html += '<li>';
					//html += '<div class="coment-box">';
						//html += '<div class="coment-head">';


		}

	};


	xhr.send();

}


function registroUsuario(formulario)
{

	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.
		fd = new FormData(formulario);
		url = 'api/usuarios';

	xhr.open('POST', url, true);

	xhr.onload = function()
	{

	};


	xhr.send(fd);

	return false;
}

// Funcion para comprobar si el login ya existe
function checkLogin(log)
{
	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.
		url = 'api/usuarios/';

	url += log.value;

	xhr.open('GET', url, true);

	xhr.onload = function()
	{
		let r = JSON.parse(xhr.responseText);

		if(r.DISPONIBLE == false) // Si el login no esta disponible
		{


		}
	};


	xhr.send();

}