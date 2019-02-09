async function loadExternalJs(src) 
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

module.exports.loadExternalJs = loadExternalJs;