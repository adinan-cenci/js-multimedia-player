/**
 * Loads an external js file.
 */
class Loader 
{
    /**
     * @param {string} src
     *   The uri to the script.
     * @param {string} propertyToCheck
     *   The script will check the presence of this property to ensure that
     *   the script has successfully been loaded.
     * @param {HTMLElement} appendTo
     *   The element to append the script to, it defaults to the document's body.
     */
    constructor(src, propertyToCheck, appendTo = nul) 
    {
        this.src             = src;
        this.propertyToCheck = propertyToCheck;
        this.appendTo        = appendTo || document.body;
        this.loading         = false;
        this.loaded          = false;
    }

    /**
     * @returns {Promise}
     *   To be resolved when the script has been loaded.
     */
    async load()
    {
        return new Promise(async (success, fail) =>
        {
            var script;
            script          = document.createElement('script');
            script.async    = true;
            script.type     = 'text/javascript';

            script.onload   = (e) =>
            {
                this.checkOnProperty(success);
            };

            script.onerror  = (e) =>
            {
                fail(this.src + ' failed to load');
            };

            script.src      = this.src;
            this.appendTo.appendChild(script);
        });
    }

    /**
     * @private
     * 
     * @return {function}
     */
    checkOnProperty(success) 
    {
        this.waiter = setInterval(() =>
        {
            if (!Loader.isPropertyDefined(this.propertyToCheck)) {
                return;
            }

            this.loaded = true;
            this.loading = false;
            clearInterval(this.waiter);
            return success(this.src + ' ready');
        }, 100);
    }

    /**
     * Checks if the path is defined onObject.
     *
     * @static
     * @private
     * 
     * @param {string} path
     * @param {object} object
     *
     * @return {bool}
     */
    static isPropertyDefined(path, onObject = window) 
    {
        var properties = path.split('.');

        var subject = onObject;

        for (var prp of properties) {
            subject = subject[prp];

            if (typeof subject === 'undefined') {
                return false;
            }
        }

        return true;
    }
}

export default Loader;
