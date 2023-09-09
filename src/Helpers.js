
class Helpers 
{
    static async loadExternalJs(src, appendTo = null)
    {
        return new Promise(async function(success, fail)
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
            appendTo = appendTo || document.body;
            appendTo.appendChild(script);
        });
    }
}

export default Helpers;
