import { useEffect, useState } from "react";

export default function useLoad() {
  const [transactionsCategories, setTransactionsCategories] = useState<string[]>([]);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  useEffect(() => {
    const loadLocalStorageData = () => {
      const categoriesData = localStorage.getItem('categories');
      if (categoriesData) {
        setTransactionsCategories(JSON.parse(categoriesData));
      }

      setIsLocalStorageLoaded(true);
    };

    if (typeof window !== 'undefined') {
      loadLocalStorageData();
    }
  }, []);

  return { transactionsCategories, setTransactionsCategories, isLocalStorageLoaded };
}