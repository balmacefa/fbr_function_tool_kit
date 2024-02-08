export function convert_form_ToNestedObject_lodash_style(data: Record<string, any>, split = '.') {
    const result = {};
    Object.keys(data).forEach(key => {
        const parts = key.split(split);
        let current: any = result;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = data[key];
            } else {
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });
    return convertIndexedObjectsToArrays(result);
}

function convertIndexedObjectsToArrays(obj: any) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Check if all keys match the 'i<number>' pattern and sort them
            const childKeys = Object.keys(obj[key]);
            const indexPattern = /^i\d+$/;
            const isIndexedObject = childKeys.every(key => indexPattern.test(key));

            if (isIndexedObject && childKeys.length > 0) {
                // Convert object to array
                obj[key] = childKeys.sort().map(indexKey => convertIndexedObjectsToArrays(obj[key][indexKey]));
            } else {
                // Recursive call for nested objects
                convertIndexedObjectsToArrays(obj[key]);
            }
        }
    });
    return obj;
}