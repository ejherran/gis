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
            $consulta = "SELECT id, name FROM categories WHERE type='G' ORDER BY name ASC";
            $resultado = mysql_query($consulta);
            if (!$resultado) 
            {
                $mensaje  = 'Consulta no válida: ' . mysql_error() . "\n";
                $mensaje .= 'Consulta completa: ' . $consulta;
                die($mensaje);
            }
            else
            {
                $ret = array();
                while ($fila = mysql_fetch_assoc($resultado)) 
                {
                    $ret[] = $fila['id'].'=>'.$fila['name'];
                }
                echo utf8_encode(implode(';', $ret));
            }
        }
    }
    
    mysql_close($con);
    
?> 
