

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
		html += '<li><a href="nueva.html"><span class="icon-camera"></span><span class="menu display-mini display-great">Nueva Foto</span></a></li>';
		html += '<li><a href="favoritas.html?1"><span class="icon-heart"></span><span class="menu display-mini display-great">Favoritas</span></a></li>';
		html += '<li><a href="index.html?1" onclick="hacerLogout();"><span class="icon-logout"></span>Logout (' + usu.login + ')</a></li>';

	}
	else
	{
		// No logeado
		html += '<li><a href="login.html"><span class="icon-user"></span><span class="menu display-mini display-great">Login</span></a></li>';
		html += '<li><a href="registro.html"><span class="icon-user-add"></span><span class="menu display-mini display-great">Registro</span></a></li>';

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


		totalPag = calcularTotalPagFotos(r, xhr); 		// Calculamos el total de paginas que hay

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

		}
		else  // Si el total de fotos de pagina a mostrar es mayor que el del servidor quiere decir que en esta pagina se muestran menos fotos que el maximo (que son 6)
		{
				
			inicio = 6 * (pagActiva-1);   					
			total = totalFotosServidor;
		}


		for (let i=inicio; i<total; i++)  // Bucle para recorrer todas las fotos que haya en la pagina que nos encontremos
		{

				html += '<article>';

					html += '<div class="contenedor">';

						html += '<div class="autorBox">';

							html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html?1?l='+ r.FILAS[i].login + '">' + r.FILAS[i].login + '</a> <b>|</b> ';
							for(let i3=0; i3<r.FILAS[i].etiquetas.length; i3++)
							{

								html += '<a class="enlaces" title="Buscar por etiquetas" href="buscar.html?1?e='+ r.FILAS[i].etiquetas[i3].nombre + '">#'+ r.FILAS[i].etiquetas[i3].nombre +' </a>';
								
							}

						html += '</div>';

						html += '<a title="Ver foto" href="foto.html?' + r.FILAS[i].id + '">';

							html += '<img src="fotos/' + r.FILAS[i].fichero + '" alt="'+ r.FILAS[i].descripcion +'" class="imagIndex" >'; 

						html += '</a>';

						html += '<div class="textoImg">';

							html += '<h4>' + r.FILAS[i].titulo + '</h4>';

							if(sessionStorage.getItem("login")) // Usuario logeado
							{
								let usuFav = r.FILAS[i].usu_favorita;
									usuLike = r.FILAS[i].usu_megusta;
								
								// Comprobamos si le ha dado a me gusta a la foto
								if(usuLike!=0)
								{
									html += '<p><span class="icon-thumbs-up-alt"></span>';
								}
								else
								{
									html += '<p><span class="icon-thumbs-up"></span>';
								}


								html += r.FILAS[i].nmegusta;

								// Comprobamos si le ha dado a fav a la foto
								if(usuFav!=0)
								{
									html+= ' <span class="icon-heart"></span>';
								}
								else
								{
									html+= ' <span class="icon-heart-empty"></span>';
								}

								html += r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';

							}
							else
							{
								html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i].nmegusta + ' <span class="icon-heart-empty"></span>' + r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';
							}

						html += '</div>';
					html += '</div>';
					
				html += '</article>';
			}

		document.querySelector('.preview').innerHTML=html;


	};


	if(sessionStorage.getItem("login"))
	{
		// Si el usuario esta logeado pedimos info extra sobre si le ha dado me gusta o fav
		let usu = JSON.parse(sessionStorage['usuario']);

		xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);
	}


	xhr.send();  // Envia la petición que hemos hecho al servidor

}

// Funcion para calculara el numero total de paginas de fotos que hay en index
function calcularTotalPagFotos(result, xhr)
{

	let numPag = result.FILAS.length/6;  		// Numero de paginas
		decimal = numPag - Math.floor(numPag) 	// Parte decimal (paginas que no estan completas de fotos)
		i = 0;
		pagActiva = location.search.substr(1);  // 
		pagActiva = pagActiva.split('?')[0]; 	// Obtenemos de la url la pagina actual en la que estamos

	
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
		url = window.location.href; 			// Url actual completa
		url2 = url.split('/')[5]; 				// cojemos el final de la url despues del ultimo '/'
		url3 = url2.split('?')[0]; 	 			// Cojemos la primera parte del final de la url antes del '?'			

	if(valor==1)  // Si valor == 1 quiere decir que queremos ir a la anterior
	{
		if(pagActiva!=1)
		{
			pagActiva = pagActiva - 1;
		}
	}
	else // Si no es 1, quiere decir que queremos ir a la siguiente pagina
	{
		if(pagActiva<paginas)
		{
			pagActiva = +pagActiva + +1;
		}
	}


	window.location.replace(url3 + '?' + pagActiva + ''); 		// Cambiamos a la pagina correspondiente

}


// Muestra las fotos favoritas del usuario
function fotosFavoritas()
{
	// Peticion GET
	let xhr = new XMLHttpRequest();
		url = 'api/usuarios/'; 
		pagActiva = location.search.substr(1);

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
			totalPag = calcularTotalPagFotos(r, xhr); 		// Calculamos el total de paginas que hay

			//console.log(totalPag);

			totalFotosServidor = r.FILAS.length; 			// Numero total de fotos favoritas en el servidor

			//console.log(totalFotosServidor);

			let total = 0; 									// 
				inicio = 0; 								// Variables para los bucles for (inicio del bucle y final)

			html = '';
			totalFotosPag = pagActiva * 6; 					// Para saber cuantas fotos se deberian mostrar en funcion de la pag en la que estemos

			//console.log(totalFotosPag);

			// Si el total de fotos a mostrar es igual al numero de fotos que hay en el servidor o es menor, entonces quiere decir que se muestran todas las
			// fotos en la pagina que estamos
			if(totalFotosPag==totalFotosServidor || totalFotosPag<totalFotosServidor)
			{	
					total = totalFotosPag;
					inicio = totalFotosPag - 6;

			}
			else  // Si el total de fotos de pagina a mostrar es mayor que el del servidor quiere decir que en esta pagina se muestran menos fotos que el maximo (que son 6)
			{
				
				inicio = 6 * (pagActiva-1);   					
				total = totalFotosServidor;
			}

			//console.log(inicio);
			//console.log(total);

			for (let i=inicio; i<total; i++)  // Bucle para recorrer todas las fotos que haya en la pagina que nos encontremos
			{
				html += '<article>';

						html += '<div class="contenedor">';

							html += '<div class="autorBox">';

								html += '<p><a class="enlaces" title="Buscar por autor" href="buscar.html?1?l='+ r.FILAS[i].login + '">' + r.FILAS[i].login + '</a> <b>|</b> ';
								for(let i3=0; i3<r.FILAS[i].etiquetas.length; i3++)
								{

									html += '<a class="enlaces" title="Buscar por etiquetas" href="buscar.html?1?e='+ r.FILAS[i].etiquetas[i3].nombre + '">#'+ r.FILAS[i].etiquetas[i3].nombre +' </a>';
									
								}
							html += '</div>';

							html += '<a title="Ver foto" href="foto.html?' + r.FILAS[i].id + '">';

								html += '<img src="fotos/' + r.FILAS[i].fichero + '" alt="'+ r.FILAS[i].descripcion +'" class="imagIndex" >'; 

							html += '</a>';

							html += '<div class="textoImg">';

								html += '<h4>' + r.FILAS[i].titulo + '</h4>';
								html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i].nmegusta + ' <a title="Eliminar de favoritas" class="favorita" href="favoritas.html?1"><span class="icon-heart"></span></a>' + r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';

							html += '</div>';
						html += '</div>';
						
					html += '</article>';
			}

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

// Para mostrar la foto correspondiente en foto.html en funcion del ID de foto que se pasa por la url.
// Tambien se comprueba si el usuario ha dado me gusta o fav a la foto
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

				html+= '<figure>';
					html += '<div>';
						html += '<img src="fotos/' + r.FILAS[0].fichero + '" alt="'+ r.FILAS[0].descripcion +'" class="imagen2">';
					html += '</div>';
					html += '<figcaption>';
						html += '<h2>' + r.FILAS[0].titulo + '</h2>';
						html += '<hr class="LineaFoto">';

						if(sessionStorage.getItem("login")) // Usuario logeado
						{
							// Valores de fav y like del usuario
							let usuFav = r.FILAS[0].usu_favorita;
								usuLike = r.FILAS[0].usu_megusta;

							html += '<p class="info">';
							
							// Comprobamos si le ha dado a me gusta a la foto
							if(usuLike!=0)
							{
								html += '<a class="enlaces" title="Me gusta la foto" href="" onclick="meGustaFoto(1);"><span class="icon-thumbs-up-alt"';
							}
							else
							{
								html += '<a class="enlacesFoto" title="Me gusta la foto" href="" onclick="meGustaFoto(0);"><span class="icon-thumbs-up"';
							}


							html += '></span></a>' + r.FILAS[0].nmegusta +' ';

							// Comprobamos si le ha dado a fav a la foto
							if(usuFav!=0)
							{
								html+= '<a class="enlaces" title="Añadir a favoritas" href="" onclick="favoritaFoto(1);"><span class="icon-heart">';
							}
							else
							{
								html+= '<a class="enlacesFoto" title="Añadir a favoritas" href="" onclick="favoritaFoto(0);"><span class="icon-heart-empty">';
							}

							html += '</span></a>' + r.FILAS[0].nfavorita + ' <a class="enlacesFoto" title="Seccion comentarios de la Foto" href="#comentarios"><span class="icon-comment-empty"></span></a>' + r.FILAS[0].ncomentarios + '</p>';
						
						}
						else
						{
							// Usuario no logeado
							html += '<p class="info"><a class="enlacesFoto" title="Me gusta la foto" href="login.html";"><span class="icon-thumbs-up"></span></a>' + r.FILAS[0].nmegusta + ' <a class="enlacesFoto" title="Añadir a favoritas" href="login.html"><span class="icon-heart-empty"></span></a>' + r.FILAS[0].nfavorita + ' <a class="enlacesFoto" title="Seccion comentarios de la Foto" href="#comentarios"><span class="icon-comment-empty"></span></a>' + r.FILAS[0].ncomentarios + '</p>';
						}

						html += '<p class="info">Dimensiones: ' + r.FILAS[0].alto + 'x' + r.FILAS[0].ancho + ' pixeles</p>';
						html += '<p class="info">Peso: ' + r.FILAS[0].peso + ' bytes</p>';
						html += '<div>';

							for(let i3=0; i3<r.FILAS[0].etiquetas.length; i3++) // Bucle para recorrer todas las etiquetas de la foto
							{

								html += '<a class="enlaces" title="Buscar por etiquetas" href="buscar.html?1?e='+ r.FILAS[0].etiquetas[i3].nombre + '">#'+ r.FILAS[0].etiquetas[i3].nombre +' </a>';
							}

							html += '<p>Por <a href="buscar.html?1?l=' + r.FILAS[0].login + '" title="Buscar fotos por usuario" class="enlaces" >' + r.FILAS[0].login + '</a></p>';
						html += '</div>'
					html += '</figcaption>';
				html+= '</figure>';


			document.querySelector('#fotoID').innerHTML = html;

		}

	};


	if(sessionStorage.getItem("login"))
	{
		// Si el usuario esta logeado pedimos info extra sobre si le ha dado me gusta o fav
		let usu = JSON.parse(sessionStorage['usuario']);

		xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);
	}


	xhr.send();

}

// FUncion para mostrar los comentarios de una foto en foto.html.
function mostrarComentarios()
{	
	console.log('hellou there1');
	let xhr = new XMLHttpRequest();  // Creamos el objeto para poder hacer una petición al servidor.
		url = 'api/fotos/';
		id = location.search.substr(1); // Obtenemos el id de la foto desde la url

	url += id + '/comentarios';  

	xhr.open('GET', url, true); 

	xhr.onload = function() 
	{

		let r = JSON.parse(xhr.responseText);
			html = '';

		for (let i=0; i<r.FILAS.length; i++)
		{
			html += '<li>';
				html += '<div class="coment-box">';
					html += '<div class="coment-head">';
						html += '<h5>'+ r.FILAS[i].titulo +'</h5>';
						html += '<span>'+ r.FILAS[i].fechahora +'</span>';
					html += '</div>';
					html += '<div class="coment-content">';
						html += '<p>'+ r.FILAS[i].texto +'</p>';
						html += '<p><a href="buscar.html?' + r.FILAS[0].login + '" title="Buscar fotos por usuario" class="enlaces" >' + r.FILAS[0].login + '</a></p>';
					html += '</div>';
				html += '</div>';

			html += '</li>';

		}

		document.querySelector('#lista-coment').innerHTML = html;
	};


	xhr.send();

}

// Funcion para hacer el registro de un usuario
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

// Funcion para realizar una busqueda de fotos en buscar.html
function realizarBusqueda(formulario)
{
	let xhr = new XMLHttpRequest();
		fd = new FormData(formulario)
		url = 'api/fotos?';
		pagActiva = location.search.substr(1);

	if(formulario.titulo.value!="")
	{
		url+= 't=' + formulario.titulo.value;
	}

	if(formulario.descripcion.value!="")
	{
		url+= '&d=' + formulario.descripcion.value;
	}

	if(formulario.etiquetas.value!="")
	{
		url+= '&e=' + formulario.etiquetas.value;
	}

	if(formulario.autor.value!="")
	{
		url+= '&l=' + formulario.autor.value;
	}

	if(formulario.numeroDe.value!="")
	{
		url+= '&op=' + formulario.numeroDe.value;

		if(formulario.orden.value!="")
		{
			url+= '-' + formulario.orden.value;
		}
		else
		{
			url+= '-asc';
		}
	}

	console.log(url);

	xhr.open('GET', url, true);

	//console.log(formulario.numeroDe.value);

	xhr.onload = function()
	{
		let r = JSON.parse(xhr.responseText);
		console.log(r);

		totalPag = calcularTotalPagFotos(r, xhr); 		// Calculamos el total de paginas que hay

		console.log(totalPag);

		totalFotosServidor = r.FILAS.length; 			// Numero total de fotos que tenemos en nuestro servidor

		console.log(totalFotosServidor);

		let total = 0; 									// 
			inicio = 0; 								// Variables para los bucles for (inicio del bucle y final)

		html = '';
		totalFotosPag = pagActiva * 6; 					// Para saber cuantas fotos se deberian mostrar en funcion de la pag en la que estemos

		console.log(totalFotosPag);

		// Si el total de fotos a mostrar es igual al numero de fotos que hay en el servidor o es menor, entonces quiere decir que se muestran todas las
		// fotos en la pagina que estamos
		if(totalFotosPag==totalFotosServidor || totalFotosPag<totalFotosServidor)
		{	
					total = totalFotosPag;
					inicio = totalFotosPag - 6;

		}
		else  // Si el total de fotos de pagina a mostrar es mayor que el del servidor quiere decir que en esta pagina se muestran menos fotos que el maximo (que son 6)
		{
				
			inicio = 6 * (pagActiva-1);   					
			total = totalFotosServidor;
		}

		console.log(inicio);
		console.log(total);

		for (let i=inicio; i<total; i++)  // Bucle para recorrer todas las fotos que haya en la pagina que nos encontremos
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

							if(sessionStorage.getItem("login")) // Usuario logeado
							{
								let usuFav = r.FILAS[i].usu_favorita;
									usuLike = r.FILAS[i].usu_megusta;
								
								// Comprobamos si le ha dado a me gusta a la foto
								if(usuLike!=0)
								{
									html += '<p><span class="icon-thumbs-up-alt"></span>';
								}
								else
								{
									html += '<p><span class="icon-thumbs-up"></span>';
								}


								html += r.FILAS[i].nmegusta;

								// Comprobamos si le ha dado a fav a la foto
								if(usuFav!=0)
								{
									html+= ' <span class="icon-heart"></span>';
								}
								else
								{
									html+= ' <span class="icon-heart-empty"></span>';
								}

								html += r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';

							}
							else
							{
								html += '<p><span class="icon-thumbs-up"></span>' + r.FILAS[i].nmegusta + ' <span class="icon-heart-empty"></span>' + r.FILAS[i].nfavorita + ' <span class="icon-comment-empty"></span>' + r.FILAS[i].ncomentarios + '</p>';
							}

						html += '</div>';
					html += '</div>';
					
				html += '</article>';
			}

		document.querySelector('.preview').innerHTML=html;

	};


	xhr.send();

	return false;

}

// Funcion para dar/ quitar me gusta la foto en funcion del valor pasado por parametro
function meGustaFoto(like)
{
	let xhr = new XMLHttpRequest();
		url = 'api/fotos/';
		id = location.search.substr(1);
		usu = JSON.parse(sessionStorage['usuario']); 

	url += id + '/megusta';

	//console.log(url);

	if(like==0)  // Si se quiere dar me gusta
	{
		xhr.open('POST', url, true);
	}
	else  // Si se quiere eliminar el me gusta
	{
		xhr.open('DELETE', url, true);
	}
	//console.log(formulario.value);

	xhr.onload = function()
	{
		//let r = JSON.parse(xhr.responseText);

		//console.log(r);
	};

	xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);

	xhr.send();

	//return false;
}


// Funcion dar/quitar fav a la foto en funcion del valor pasado por parametro.
function favoritaFoto(fav)
{
	let xhr = new XMLHttpRequest();
		url = 'api/fotos/';
		id = location.search.substr(1);
		usu = JSON.parse(sessionStorage['usuario']); 


	url += id + '/favorita';


	if(fav==0)  // Si se quiere dar favorito
	{
		xhr.open('POST', url, true);
	}
	else  // Si se quiere eliminar el favorito
	{
		xhr.open('DELETE', url, true);
	}

	//console.log(formulario.value);

	xhr.onload = function()
	{


	};

	xhr.setRequestHeader('Authorization', usu.login + ':' + usu.token);

	xhr.send();

}

// Funcion para enviar los valores del buscador de la barra de navegacion a la url de buscar.html
function barraBusqueda()
{

	let url = 'buscar.html?';
		valorBusqueda = document.getElementById('brbar');


	window.location.replace('buscar.html?1?d=' + valorBusqueda.value); 	// Rederigimos a buscar pasando los valores del buscador por la url


	return false;
}

// Funcion para comprobar lo que se pasa por url en buscar.html y realizar la busqueda correspondiente
function checkBusqueda(formulario)
{

	let valor = location.search.substr(1);

	if(valor!="")  // Solo si hay un valor podemos acceder al buscador
	{

		let parametro = valor.split('?')[1]; 

		if(parametro!=undefined)  // Solo si hay un parametro por la url podemos hacer la busqueda automatica
		{

				valor2 = parametro.split('=')[1];
				ident = parametro.split('=')[0];

			switch (ident) {
				case 'l':
					formulario.autor.value = valor2;
					break;
				case 'd':
					formulario.descripcion.value = valor2;
					break;
				case 'e':
					formulario.etiquetas.value = valor2;
					break;
			}


			realizarBusqueda(formulario); 		// Realizamos la busqueda con los valores del fomulario
		}

	}
	else
	{
		window.location.replace('index.html?1'); 
	}

}