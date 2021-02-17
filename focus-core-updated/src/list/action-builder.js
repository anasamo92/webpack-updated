import dispatcher from '../dispatcher';
import loadAction from './load-action';
const NB_LIST_ELEMENT = 50;

/**
 * Builded search action.
 * @param  {object} options - The options used to build the service, it should have the following structure:
 * ```javascript
 * {
 *   identifier: string: should be 'ADVANCED_SEARCH' or 'QUICK_SEARCH'
 * 	service:{
 * 		scoped: "function which launch the scope search"
 * 		unScoped: "function whoch launch the unscoped search"
 * 	}
 * 	getSearchOptions a function which get the associated search store value
 * 	nbElement: number of elements to request on each search.
 * }
 * ```
 * @return {function} - The builded search action.
 */
export default function (config) {
    config = config || {};
    if (!config.identifier) {
        console.warn('Your action should have an identifier');
    }
    if (!config.service) {
        console.warn('Your action should have a service');
    }
    if (!config.getListOptions) {
        console.warn('Your action should have a search options getter.');
    }
    if (!config.nbElement) {
        config.nbElement = NB_LIST_ELEMENT;
    }
    return {
        /**
         * Build the search for the identifier scope.
         * @return {function} The search function for the given identifier.
         */
        load: loadAction(config),
        /**
         * Update the query for the identifier scope.
         * @param  {string} value - The query value
         * @return {function} The update query function for the given identifier.
         */
        updateProperties(value) {
            return dispatcher.handleViewAction({
                data: value,
                type: 'update',
                identifier: config.identifier
            });
        }
    };
};
