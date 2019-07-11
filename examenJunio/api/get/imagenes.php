<?php
// FICHERO: api/get/imagenes.php
// PETICIONES GET ADMITIDAS:
// * api/imagenes -> devuelve la lista aleatoria de imágenes
// =================================================================================
// =================================================================================
const TOTAL_IMGS   = 14;
const TOTAL_CARTAS = 12;
// =================================================================================
// =================================================================================
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R             = [];  // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK

$imgs = [];

for($i=0;$i<TOTAL_CARTAS / 2;$i++)
{
  do{
    $nImg = rand(1, TOTAL_IMGS);
  }while(in_array($nImg, $imgs));

  $imgs[] = $nImg;
  $imgs[] = $nImg;
}

// HAY QUE DESORDENAR EL ARRAY
shuffle( $imgs );

$R['RESULTADO'] = 'OK';
$R['CODIGO']    = $RESPONSE_CODE;
$R['IMAGENES']  = $imgs;

// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
print json_encode($R);
?>