/**
 * Helper class.
 */
class Helpers 
{
    /**
     * A helpful method to load external scripts.
     *
     * @static
     *
     * @param {string} src
     *   The uri to the script.
     * @param {HTMLElement} appendTo
     *   The element to append the script, it defaults to the document's body.
     *
     * @returns {Promise}
     *   To be resolved when the script has been loaded.
     */
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
