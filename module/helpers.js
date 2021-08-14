export function filter_and_sort(collection, type) {
  return collection.filter(function(element){
    return element.type == type;
  }).sort(function(a,b){
    if (a.name < b.name){
      return -1;
    }
    return 1;
  })
};