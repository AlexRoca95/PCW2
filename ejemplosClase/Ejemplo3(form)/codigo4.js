


function subirFoto(formulario)
{

	let xhr = new XMLHttpRequest();
		url = 'api/fotos';
		fd = new FormData(formulario);
		auth;


	// Paara recoger las etiquetas de la foto
	//let etiqs;
	//etiqs = 'mar, naturaleza, dia';
	//fd.append('etiquetas', etiqs);

	//auth = '';  // Tenemos que meter el usuario que hay almacenado en la sessionStorage

	// Esto es lo que hay que recoger del usuario en el sessionStorage que aqui lo hemos puesto a mano
	auth = 'usuario1:9849c79ef985086eaa1f09ad0e7b54edd8b6f3bfc0addab5ca72b309879c23a76a2c3dcb2557127065838177c658c9fba4c4515d388d4df2fb2880d1a29ecc4f';

	xhr.open('POST', url, true);   //Configuramos la peticion

	xhr.onload = function()
	{

		console.log(xhr.responseText);

		// Si sale un warning de que no se puede mover es por lo de los permisos de las carpetas


	};


	xhr.setRequestHeader('Authorization', auth); // Autorizacion para hacer el post de las fotos

	xhr.send(fd); // Enviamos la peticion

	return false;
}


function teclaPulsada(evt)
{

	console.log(evt); // Informacion sobre el evento (en este caso la tecla con su keycode)

	if(evt.keycode == 13) // TEcla intro
	{


		console.log('ENTER pulsado');

		return false;
	}

}

// Para cargar un formulario al pulsar el boton sin que este este en el codigo html de la pagina
function cargarFormComentario2()
{

	let xhr = new new XMLHttpRequest();
		url = 'formulario.html'; // Path a donde esta el formulario

	xhr.open('GET', url, true);


	xhr.onload = function()
	{
		document.querySelector('#frmComent').innerHTML = xhr.responseText;  // Cargamos donde el id la respuesta obtenida al hacer la peticion
	};


	xhr.send();

}

// Lo mismo que el anterior pero en vez de con ajax, le peticion será con fetch
function cargarFormComentario()
{

	let url = 'formulario.html';

	fetch(url).then(function(response)
	{

		if(response.ok)
		{
			return;

			// Parseamos la respuesta a formato texto
			response.text().then(function(html)
			{
				//console.log(html);

				document.querySelector('#frmComent').innerHTML = html; 

			});
		}
	});

}



