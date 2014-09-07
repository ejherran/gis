/*--- Global Vars ---*/

var mapSteeps = ['1'];
var mapTitles = ['G.I.S. Flandes'];
var mapMarks = [];
var mapOptions = null;
var map = null;

var idImg = 0;
var tiImg = [];

/*--- Link Start ---*/

window.onload = $start

/*--- Global Start ---*/

function $start() 
{
    $('pov').onclick = viewPanel;
    $('phide').onclick = hidePanel;
    $('ihide').onclick = hideInfo;
    $('ileft').onclick = mvImg;
    $('iright').onclick = mvImg;
    $('lnav').onclick = nextList;
    $('lreturn').onclick = prevList;
    $('center').onclick = centerMap;
    $('list').onclick = swPanel;
    $('add').onclick = swPanel;
    $('telem').onchange = swForm;
    $('cbAdd').onclick = addCat;
    $('cbClean').onclick = cleanCat;
    $('pbAdd').onclick = addPoint;
    $('pbClean').onclick = cleanPoint;
    
    $('xxFileIn').onclick = falseFile;
    $('xFileIn').onkeypress = falseFile;
    $('fileIn').onchange = inFile;
    $('flist').onclick = delFile;
    
    viewMap();
}

/*--- View Map ---*/

function viewMap()
{
    mapOptions = {
        center: new google.maps.LatLng(4.284175, -74.813784),
        zoom: 16,
        draggableCursor: 'crosshair', 
        draggingCursor: 'crosshair', 
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map($('map'), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {getLatLon(event.latLng);});
}

function getLatLon(pos)
{
    if($('pform').style.display == 'block')
    {
        var ps = ''+pos;
        ps = ps.substring(1);
        ps = ps.substring(0, ps.length-1);
        $('pcor').value = ps;
    }
}

function showMarks()
{
    for(var i = 0; i < mapMarks.length; i++)
        mapMarks[i].setMap(map);
}

function clearMarks()
{
    for(var i = 0; i < mapMarks.length; i++)
        mapMarks[i].setMap(null);
    
    mapMarks = [];
}

function centerMap()
{
    var myLatlng = new google.maps.LatLng(4.284175, -74.813784);
    map.setCenter(myLatlng);
    map.setZoom(16);
}

/*--- Panel Actions ---*/

function viewPanel()
{
    $appear($('panel'));
    getElems();
}

function hidePanel()
{
    $disappear($('panel'));
}

function hideInfo()
{
    $disappear($('info'));
}

function swPanel()
{
    $hide('lister');
    $hide('adder');
    
    $show(this.id+'er');
}

function nextList(event)
{
    var row = event.target.parentNode;
    
    if($('lnTab').className == 'lnCats')
    {
        mapSteeps.push(row.cells[0].innerHTML);
        mapTitles.push(row.cells[1].innerHTML);
        $show('lreturn');
        getElems();
    }
    else
    {
        if($('info').style.display != 'block')
            $appear($('info'));
        
        var pos = row.cells[1].innerHTML.split(',');
        var myLatlng = new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1]));
        map.setCenter(myLatlng);
        map.setZoom(20);
        
        if(row.cells[4].innerHTML.substring(0, 1) != '@')
            $('itext').value = row.cells[2].innerHTML+"\n"+row.cells[3].innerHTML+"\nLat: "+pos[0]+"\nLon: "+pos[1]+"\n\n"+row.cells[4].innerHTML;
        else
            $('itext').value = row.cells[2].innerHTML+"\n"+row.cells[3].innerHTML+"\nLat: "+pos[0]+"\nLon: "+pos[1];
        
        if(row.cells[5].innerHTML.substring(0, 1) != '@')
        {
            tiImg = row.cells[5].innerHTML.split('||');
            idImg = 0;
        }
        else
        {
            tiImg = [];
            idImg = 0;
        }
        
        if(tiImg.length > 0)
            $('iimg').style.backgroundImage = 'url(../storage/files/'+tiImg[idImg]+')';
        else
            $('iimg').style.backgroundImage = 'url(../img/blank.png)';
    }
}

function prevList(event)
{    
    mapSteeps.pop();
    mapTitles.pop();
    
    if(mapSteeps.length == 1)
        $hide('lreturn');
    
    getElems();
}

function swForm()
{
    $hide('cform');
    $hide('pform');
    
    if(this.value == 'C')
        getCats();
    else if(this.value == 'P')
        getGrups();
}

function addCat()
{
    if($('ctype').value != '@' && $('clist').value != '@' && $('cname').value != '')
        newCat();
    else
        alert('Debe completar los campos del formulario que no son opcionales!.');
}

function cleanCat()
{
    $('ctype').value = '@';
    $('clist').value = '@';
    $('cname').value = '';
    $('cdesc').value = '';
}

function addPoint()
{
    if($('plist').value != '@' && $('pname').value != '' && $('pdir').value != '' && $('pcor').value != '')
        newPoint();
    else
        alert('Debe completar los campos del formulario que no son opcionales!.');
}

function cleanPoint()
{
    $('plist').value = '@';
    $('pname').value = '';
    $('pdir').value = '';
    $('pcor').value = '';
    $('pdesc').value = '';
}

function mvImg()
{
    
    if(tiImg.length > 0)
    {
        if(this.id == 'ileft')
        {
            idImg = idImg-1;
            idImg = idImg >= 0 ? idImg : tiImg.length-1;
        }
        else
        {
            idImg = idImg+1;
            idImg = idImg < tiImg.length ? idImg : 0;
        }
        
        $('iimg').style.backgroundImage = 'url(../storage/files/'+tiImg[idImg]+')';
    }
}

/*--- Upload File ---*/

var upLimit = 0;
var filesSave = [];
var filesDelete = [];

function falseFile(event)
{
    var flag = event.type == "keypress" && event.keyCode == 13 ? true : false;
    flag = flag || event.type == "click" ? true: false;
    
    if(flag)
        falseClick('fileIn');
}

function inFile(event)
{    
    magnaFile = event.target.files[0];
    gId('xFileIn').value = magnaFile.name;
    
    gId('xFileIn').focus();
    loadFile();
}

function loadFile()
{
    var reader = new FileReader();
    reader.onload = createCode;
    reader.readAsDataURL(magnaFile);
}

function createCode(event)
{   
    upUrl = 'storage/repository.php';
    upTime = new Date().getTime();
    upName = gId('xFileIn').value;
    upOut = '@';
    upData = this.result;
    upLimit = upData.length;
    upAction = readyUp;
    
    partialUpload('');
}

function readyUp()
{
    var porcen = parseInt((1-(upData.length / upLimit))*100);
    gId('upBar').style.width = porcen+'%';
    
    if(upHash != '')
    {
        gId('xFileIn').value = '';
        gId('upBar').style.width = '0%';
        gId('flist').innerHTML += '<tr title="Click Para Eliminar"><th>'+upOut+'</th><td>'+upName+'</td>';
        parMemo();
        partialClear();
    }
}

function delFile(event)
{
    var row = event.target.parentNode;
    filesDelete.push(row.cells[0].innerHTML);
    row.parentNode.removeChild(row);
    parMemo();
}

function parMemo()
{
    filesSave = [];
    var rows = gId('flist').rows;
    for(var i = 0; i < rows.length; i++)
        filesSave.push(rows[i].cells[0].innerHTML);
}
