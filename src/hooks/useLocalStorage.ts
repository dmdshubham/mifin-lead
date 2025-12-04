import { useEffect, useState } from "react";

const useLocalStorage = <T = null, K = unknown>(key: string, value: T) => {
  const [currentValue, setCurrentValue] = useState<T | K>(() => {
    const v = localStorage.getItem(key);
    if (v === null) return value;
    return JSON.parse(v) as K;
  });

  const update = (data: K) => {
    setCurrentValue(data);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(currentValue));
  }, [currentValue]);

  const remove = () => {
    localStorage.removeItem(key);
  };

  return [currentValue, update, remove] as const;
};

export default useLocalStorage;
