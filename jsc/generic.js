/*--- Generic Functions ---*/

function $(id)
{
    return document.getElementById(id);
}

function $hide(id)
{
    $(id).style.display = 'none';
}

function $show(id)
{
    $(id).style.display = 'block';
}

/*--- Efects ---*/

function $appear(obj, count)
{
    if(typeof count == 'undefined')
    {
        count = 0;
        obj.style.display = 'block';
    }
    else
        count += 1;
        
    if(count <= 25)
    {
        obj.style.opacity = ((1.0/25)*count)+'';
        setTimeout(function(){$appear(obj, count)},60);
    }
    else
        clearTimeout();
}

function $disappear(obj, count)
{
    if(typeof count == 'undefined')
        count = 0;
    else
        count += 1;
        
    if(count <= 25)
    {
        obj.style.opacity = (1-((1.0/25)*count))+'';
        setTimeout(function(){$disappear(obj, count)},60);
    }
    else
    {
        clearTimeout();
        obj.style.display = 'none';
    }
}

 
