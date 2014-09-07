function getElems()
{
    ajaxAction
    (
        new Hash(["*tar => "+mapSteeps[mapSteeps.length-1]]),
        "php/getElems.php",
        putElems
    );
}

function putElems(response)
{
    clearMarks();
    
    $('ltitle').innerHTML = mapTitles[mapTitles.length-1]
    var code = '';
    var con = response.responseText.split('|:|');
    if(con[0] == 'S')
    {
        if(con[1].substring(0, 1) != '@')
        {
            $('lnTab').className = 'lnCats';
            var pars = con[1].split(';');
            for(var i = 0; i < pars.length; i++)
            {
                var uni = pars[i].split('=>');
                code += '<tr><th>'+uni[0]+'</th><td>'+uni[1]+'</td></tr>';
            }
        }
    }
    else
    {
        if(con[1].substring(0, 1) != '@')
        {
            $('lnTab').className = 'lnPoints';
            var pars = con[1].split(';');
            for(var i = 0; i < pars.length; i++)
            {
                var uni = pars[i].split('=>');
                code += '<tr><th>'+uni[0]+'</th><th>'+uni[1]+'</th><td>'+uni[2]+'</td><th>'+uni[3]+'</th><th>'+uni[4]+'</th><th>'+uni[5]+'</th></tr>';
                
                var pos = uni[1].split(',');
                
                var myLatlng = new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1]));
                var marker = new google.maps.Marker
                ({
                    position: myLatlng,
                    title:uni[2]
                });
                
                mapMarks.push(marker);
            }
            
            showMarks();
        }
    }
    
    $('lnTab').innerHTML = code;
}

function getCats()
{
    ajaxAction
    (
        new Hash(["*tok => 0"]),
        "php/getCats.php",
        putCats
    );
}

function putCats(response)
{
    var code = '';
    var pars = response.responseText.split(';');
    
    for(var i = 0; i < pars.length; i++)
    {
        var uni = pars[i].split('=>');
        if(uni[0] == '1')
            code = '<option value="'+uni[0]+'">'+uni[1]+'</option>'+code;
        else
            code = code+'<option value="'+uni[0]+'">'+uni[1]+'</option>';
    }
    
    $('clist').innerHTML = '<option value="@">Seleccione...</option>'+code;
    
    $show('cform');
} 

function getGrups()
{
    ajaxAction
    (
        new Hash(["*tok => 0"]),
        "php/getGrups.php",
        putGrups
    );
}

function putGrups(response)
{
    var code = '';
    var pars = response.responseText.split(';');
    
    for(var i = 0; i < pars.length; i++)
    {
        var uni = pars[i].split('=>');
        code = code+'<option value="'+uni[0]+'">'+uni[1]+'</option>';
    }
    
    $('plist').innerHTML = '<option value="@">Seleccione...</option>'+code;
    
    $show('pform');
} 

function newCat()
{
    ajaxAction
    (
        new Hash(["ctype", "clist", "cname", "cdesc"]),
        "php/newCat.php",
        okCat
    );
}

function okCat(response)
{
    cleanCat();
    getCats();
    alert(response.responseText);
}

function newPoint()
{
    ajaxAction
    (
        new Hash(["plist", "pname", "pdir", "pcor", "pdesc", "*addFiles => "+filesSave.join(';'), "*delFiles => "+filesDelete.join(';')]),
        "php/newPoint.php",
        okPoint
    );
}

function okPoint(response)
{
    $('flist').innerHTML = '';
    filesSave = [];
    filesDelete = [];
    cleanPoint();
    getGrups();
    alert(response.responseText);
}
