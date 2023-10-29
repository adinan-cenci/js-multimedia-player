import Loader from './Loader';

/**
 * Helper class.
 */
class Helpers 
{
    /**
     * A helpful method to load external scripts.
     *
     * @param {string} src
     *   The uri to the script.
     * @param {string} propertyToCheck
     *   The script will check the presence of this property to ensure that
     *   the script has successfully been loaded.
     * @param {HTMLElement} appendTo
     *   The element to append the script to, it defaults to the document's body.
     *
     * @returns {Promise}
     *   To be resolved when the script has been loaded.
     */
    static async loadExternalJs(src, propertyToCheck, appendTo = null)
    {
        var loader = new Loader(src, propertyToCheck, appendTo);
        return loader.load();
    }
}

export default Helpers;
