export const saveInLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getInLocalStorage = <T>(key: string): T | null => {
  const result = localStorage.getItem(key);
  return result ? JSON.parse(result) : null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};