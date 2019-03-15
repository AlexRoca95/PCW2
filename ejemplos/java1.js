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



// Ejemplo de POST:
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

		sessionStorage.setItem("login", frm.login.value);  // Asiganmos el valor del campo de login del formulario al campo de login del sessionStorage
		sessionStorage.setItem("pwd", frm.pwd.value);

		if((sessionStorage.getItem("login")) && (sessionStorage.getItem("pwd")))  // Solo si hay un valor en el campo de login y pwd del sessionStorage
		{
			console.log("Login correcto");
		}
		else
		{
			console.log("Rellena los campos");
		}

		//sessionStorage('usuario')=xhr;  
		//console.log(xhr.responseText);

	};


	xhr.send(fd);  // Como aqui la peticion es un post, tenemos que pasar los datos 

	//console.log(frm.login.value); // Valor por consola de lo que hay en login 

	return false;  // Evita que recarge la pagina cada vez que pulsamos el boton de enviar el formulario
}