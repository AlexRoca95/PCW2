
// Recogemos el mensaje en el evt
self.onmessage = function(evt)
{

	let datos = evt.data;

	for(let i=0; i<datos.imgData.width*datos.imgData.height;i++)
	{
		switch(datos.color)
		{
			case 'red':
				datos.imgData.data[1*4+1]=0; // green
				datos.imgData.data[1*4+2]=0; // blue
			break;

			case 'green':
				datos.imgData.data[1*4]=0;  //red
				datos.imgData.data[1*4+2]=0; //blue
			break;

			case 'blue':
				datos.imgData.data[1*4+1]=0; //green
				datos.imgData.data[1*4]=0; //red
			break;
		}
	}

	self.postMessage(datos.imgData);
	
};