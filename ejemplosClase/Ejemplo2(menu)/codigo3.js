function mostrarMenu()
{

	let menu = document.querySelector('#menu');
		html = '';



	if(sessionStorage['usuario'])
	{
		// Usuario logeado

		html += '<li><a href="Nueva Foto.html"> Nueva foto </a></li>';
		html += '<li><a href="Fav.html"> Favoritas </a></li>';

		html += '<li><a href="javascript:void(0);" onclick="hacerLogout();"> Logout </a></li>';  // El enlace no hace nada



	}
	else
	{
		// Usuario no logeado
		html += '<li><a href=""> Login </a></li>';
		html += '<li><a href=""> Registro </a></li>';

	}

	menu.innerHTML += html;



}