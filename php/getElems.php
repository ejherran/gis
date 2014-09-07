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
            $consulta = "SELECT type FROM categories WHERE id='".$_POST['tar']."' LIMIT 1";
            $resultado = mysql_query($consulta);
            if (!$resultado) 
            {
                $mensaje  = 'Consulta no válida: ' . mysql_error() . "\n";
                $mensaje .= 'Consulta completa: ' . $consulta;
                die($mensaje);
            }
            else
            {
                $fila = mysql_fetch_assoc($resultado);
                $type = $fila['type'];
                
                if($type == 'S')
                {
                    $consulta = "SELECT id, name FROM categories WHERE super='".$_POST['tar']."' ORDER BY name ASC";
                    $resultado = mysql_query($consulta);
                    
                    if(!$resultado)
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
                        $ret = count($ret) > 0 ? $ret : array('@');
                        echo 'S|:|'.utf8_encode(implode(';', $ret));
                    }
                }
                else
                {
                    $consulta = "SELECT * FROM points WHERE categories_id='".$_POST['tar']."' ORDER BY name ASC";
                    $resultado = mysql_query($consulta);
                    
                    if(!$resultado)
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
                            $consulta2 = "SELECT name FROM files WHERE points_id='".$fila['id']."' ORDER BY name ASC";
                            $resultado2 = mysql_query($consulta2);
                            $fnames = array();
                            
                            while ($caso = mysql_fetch_assoc($resultado2))
                                $fnames[] = $caso['name'];
                            
                            $fnames = count($fnames) > 0 ? implode('||', $fnames) : '@';
                            
                            $ret[] = $fila['id'].'=>'.$fila['cor'].'=>'.$fila['name'].'=>'.$fila['dir'].'=>'.($fila['data'] != '' ? $fila['data'] : '@').'=>'.$fnames;
                        }
                        $ret = count($ret) > 0 ? $ret : array('@');
                        echo 'G|:|'.utf8_encode(implode(';', $ret));
                    }
                }
            }
        }
    }
    
    mysql_close($con);
    
?> 
