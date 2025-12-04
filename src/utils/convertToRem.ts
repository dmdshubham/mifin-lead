export const rem = (pxValue: number) => {
    const result = (pxValue / 16).toString() + "rem"  
    return result;
}

export const em = (emValue: number) => {
    const result = (emValue / 16).toString() + "em"  
    return result;
}