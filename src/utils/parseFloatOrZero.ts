const parseFloatOrZero = (value: string): number => {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  };
  
  export { parseFloatOrZero };
  