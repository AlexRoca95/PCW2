

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