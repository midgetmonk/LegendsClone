/**
 * Filter a collection of Items by type and return them sorted
 * @param {Array} collection The list of Items
 * @param {String} type The Type of item we're looking for
 * @returns The filtered, sorted list
 */
export function filter_items(collection, type) {
  return collection.filter((element) => {
    return element.type == type;
  })
};

/**
 * Filter a collection of Techniques by approach
 * @param {Array} collection The list of Techniques
 * @param {String} approach The Approach we want
 * @returns The items in the collection matching the specified approach
 */
export function filter_techniques(collection, approach) {
  return collection.filter((element) => {
    return element.data.approach == approach
  });
}
