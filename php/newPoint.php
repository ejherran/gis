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
            $consulta = "INSERT INTO points VALUES ('0', '".$_POST['plist']."', '".$_POST['pname']."', '".$_POST['pdir']."', '".$_POST['pcor']."', '".$_POST['pdesc']."')";
            $consulta = utf8_decode($consulta);
            $resultado = mysql_query($consulta);
            if (!$resultado) 
            {
                $mensaje  = 'Consulta no válida: ' . mysql_error() . "\n";
                $mensaje .= 'Consulta completa: ' . $consulta;
                die($mensaje);
            }
            else
            {
                $pid = mysql_insert_id($con);
                
                $afs = $_POST['addFiles'] != '' ? explode(';', $_POST['addFiles']) : array();
                $dfs = $_POST['delFiles'] != '' ? explode(';', $_POST['delFiles']) : array();
                
                foreach($afs as $c)
                {
                    $consulta = "INSERT INTO files VALUES ('0', '".$pid."', '".$c."')";
                    $consulta = utf8_decode($consulta);
                    $resultado = mysql_query($consulta);
                }
                
                foreach($dfs as $c)
                    unlink('../storage/files/'.$c);
                
                echo "Punto creado!.";
            }
        }
    }
    
    mysql_close($con);
?> 
