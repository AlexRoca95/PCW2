
// Devuelve la lista de etiquetas disponibles en la base de datos
function obtenerEtiquetas()
{

	let xhr = new XMLHttpRequest();
		url = 'api/etiquetas';

	xhr.open('GET', url, true);



	xhr.onload = function()
	{

		let res = JSON.parse(xhr.responseText);


		console.log(res);

		let html = ' ';

		for(let i=0; i<res.FILAS.length;i++)
		{


			html += '<option value="' + res.FILAS[i].nombre + '">';

		}

		document.querySelector('#etiquetas').innerHTML = html;



	};


	xhr.send();
}

// Funcion para comprobar si el login ya esta cogido o no
function checkLogin(log)
{
 	// Solo si hay algun valor introducido
	if(log.value!="")
	{
		let xhr = new XMLHttpRequest();
			url = 'api/usuarios/';
			url += log.value; 			// A la peticion hay que pasar el valor de login

		xhr.open('GET', url, true);

		xhr.onload = function()
		{

			let res = JSON.parse(xhr.responseText);
				html = ' ';

			if(res.DISPONIBLE == true)
			{
				html += '<p id="loginCorrecto">Login disponible</p>';
			}
			else
			{
				html += '<p id="loginIncorrecto">El login no esta disponible</p>';
			}


			document.querySelector('.loginCheck').innerHTML = html;

		}

		xhr.send();
	}
	else
	{
		// No se muestra nada
		html = '';

		document.querySelector('.loginCheck').innerHTML =html;
	}


}


function loginUsuario(formulario)
{
	let xhr = new XMLHttpRequest();
		url = 'api/sesiones';

	xhr.open('POST', url, true);

	let fd = new FormData(formulario);

	xhr.onload = function()
	{

		let r = JSON.parse(xhr.responseText);


		if(r.RESULTADO == 'OK')
		{

				sessionStorage.setItem("login", formulario.login.value); // Asiganmos el valor del campo de login del formulario al campo de usuario del sessionStorage
				sessionStorage.setItem("pwd", formulario.pwd.value);


				// Esto lo uso en el javascript (hacer ambos (este y el de login/pwd))
				sessionStorage['usuario'] = xhr.responseText; 		// Guardamos en la variable usuario toda la info del mismo (para usarla en otras funciones que necesite info del mismo)


				window.location.replace('index.html');

		}
		else
		{
			if(r.RESULTADO == 'ERROR')
			{
				var modal = document.getElementById('myModal');  // Obtenemos el elemento
					modal.style.display = "block";  				// Mostramos la ventana con info del error.
			}
		}

	};


	xhr.send(fd);

	return false; 		// Para evitar que se recargue la pagina al enviar el formulario


}


// Muestra un menu distinto en el caso de que se este logueado o no
function mostrarMenu()
{


	if(sessionStorage['usuario'])
	{


		html = ' ';

		// Si usuario logeado, mostramos un campo mas

		let usu = JSON.parse(sessionStorage['usuario']);  // Parseamos la info que hay en usuario


			html += '<li><a href="login.html">'+ usu.login +'</a></li>';


		document.querySelector('#menu').innerHTML += html; 		// += para añadir a lo que habia y asi no sustituye
	}

}