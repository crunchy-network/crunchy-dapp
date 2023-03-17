export default {
  mergeObjects(obj1, obj2) {
    const mergedObj = {};
    for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj1, key)) {
        mergedObj[key] = obj1[key];
      }
    }
    for (const key in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, key)) {
        if (obj2[key] !== null && obj2[key] !== undefined) {
          mergedObj[key] = obj2[key];
        } else if (mergedObj[key] === null || mergedObj[key] === undefined) {
          mergedObj[key] = obj2[key];
        }
      }
    }
    return mergedObj;
  },
};
