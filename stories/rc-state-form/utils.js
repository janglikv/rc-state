export function get(object, path, defaultValue) {
    const keys = Array.isArray(path) ? path : path.split(".");
    let result = object;

    for (const key of keys) {
        result = result !== null && result !== undefined ? result[key] : undefined;
        if (result === undefined) {
            return defaultValue;
        }
    }

    return result;
}

export function update(object, path, value) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let newObj = { ...object };
  
    let temp = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      temp[key] = { ...temp[key] };
      temp = temp[key];
    }
  
    temp[keys[keys.length - 1]] = value;
    return newObj;
  }
  
