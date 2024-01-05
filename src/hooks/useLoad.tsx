import { useEffect, useState } from "react";
import { useMemory } from ".";
import { LocalStorageKeys } from "@/models";

export default function useLoad() {
  const [transactionsCategories, setTransactionsCategories] = useMemory<string[]>(LocalStorageKeys.CATEGORIES, []);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  useEffect(() => {
    const loadLocalStorageData = () => {
      const categoriesData = localStorage.getItem(LocalStorageKeys.CATEGORIES);
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