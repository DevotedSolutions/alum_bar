export function VLOOKUP(lookupValue, tableArray, columnIndex, exactMatch) {
   
    const item = tableArray.find((item) => (item.code === lookupValue));
    return item ? item.price : (exactMatch ? "#N/A" : undefined);
}

export function VLOOKUPBBD(lookupValue, bbdData,largeur,exactMatch){
    
    const item =  bbdData.find((item) => (item.code === lookupValue));
    if (item) {
       
        if (item.hasOwnProperty(largeur)) {
            return item[largeur];
        } else {
            return exactMatch ? "#N/A" : undefined;
        }
    } else {
        // Handle case where lookupValue is not found
        return exactMatch ? "#N/A" : undefined;
    }

       
     
    //return item ? item.hautuer : (exactMatch ? "#N/A" : undefined);
}

export function HLOOKUP(lookupValue, jsonData, rowIndex, exactMatch) {
    const item = jsonData.find((item) => (item.code === lookupValue));
    return item ? item[rowIndex - 1] : (exactMatch ? "#N/A" : undefined);
}

export function ROUND(value, places) {
    const multiplier = Math.pow(10, places);
    return Math.round(value * multiplier) / multiplier;
}

// ROUNDUP function implementation
export function ROUNDUP(value, places) {
    const multiplier = Math.pow(10, places);
    return Math.ceil(value * multiplier) / multiplier;
}

// ROUNDDOWN function implementation
export function ROUNDDOWN(value, places) {
    const multiplier = Math.pow(10, places);
    return Math.floor(value * multiplier) / multiplier;
}

export function NUMBERVALUE(value) {
    return Number(value);
}

// Implementing RIGHT function
export function RIGHT(largeurDivide) {
   return largeurDivide % 100 >= 20
    ? Math.ceil(largeurDivide / 100) * 100
    : Math.floor(largeurDivide / 100) * 100;
}


