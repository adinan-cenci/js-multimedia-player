export default async function loadExternalJs(src) 
{
    return new Promise(function(success, fail) 
    {
        var script;
        script          = document.createElement('script');
        script.async    = true;
        script.type     = 'text/javascript';

        script.onload   = function(e) 
        {
            success('SCRIPT: loaded');
        };

        script.onerror  = function(e) 
        {
            fail('SCRIPT: failed to load');
        };
        
        script.src      = src;
        document.body.appendChild(script);
    });
}

export async function fetchJson(url) 
{
    return fetch(url).then((response) => 
    {
        return response.json();
    });
}

export function compare(val1, val2) 
{
    if (Array.isArray(val1) && Array.isArray(val2)) {
        return val1.intersect(val2).length > 0
    }

    if (Array.isArray(val1)) {
        return val1.indexOf(val2) >= 0
    }

    if (Array.isArray(val2)) {
        return val2.indexOf(val1) >= 0
    }

    return val1 == val2;
}

//FILTERS
export function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

export function thatCointain(palavra) 
{
    return function (comparar) 
    {
        return comparar.toLowerCase().indexOf(palavra) > -1
    };
}