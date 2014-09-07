<?php
    
    include 'config.php';
    
    $con =  mysql_connect($DbHost, $DbUser, $DbPassword);
    
    if (!$con) 
    {
        die('No pudo conectarse: ' . mysql_error());
    }
    else
    {
        $db = mysql_select_db($DbName, $con);
        if (!$db) 
        {
            die ('No  : ' . mysql_error());
        }
        else
        {
            $consulta = "INSERT INTO categories VALUES ('0', '".$_POST['ctype']."', '".$_POST['clist']."', '".$_POST['cname']."', '".$_POST['cdesc']."')";
            $consulta = utf8_decode($consulta);
            $resultado = mysql_query($consulta);
            if (!$resultado) 
            {
                $mensaje  = 'Consulta no válida: ' . mysql_error() . "\n";
                $mensaje .= 'Consulta completa: ' . $consulta;
                die($mensaje);
            }
            else
                echo "Categoría creada!.";
        }
    }
    
    mysql_close($con);
?> 
