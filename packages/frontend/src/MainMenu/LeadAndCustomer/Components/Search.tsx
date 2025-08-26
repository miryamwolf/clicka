import { useEffect, useState } from "react";
import { create } from 'zustand';

// טיפוס ללקוח
type Customer = {
  name: string;
  email: string;
  phone: string;
};

// Zustand Store עם טיפוס
type Store = {
  query: string;
  results: Customer[];
  setQuery: (q: string) => void;
  setResults: (r: Customer[]) => void;
};

const useStore = create<Store>((set) => ({
  query: '',
  results: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
}));

const pageSize = 25;
let numPage = 1;

export const SearchCustomer = () => {
  const { query, results, setQuery, setResults } = useStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Customer[]>([]);

  // שליפת נתונים והפעלת polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.example.com/data?page=${numPage}&limit=${pageSize}`);
        const json: Customer[] = await response.json();
        setData(prev => [...prev, ...json]);
      } catch (e) {
        console.error("שגיאה ב-fetch", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      if (loading) {
        fetchData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // חיפוש לפי אימייל, טלפון או שם
  const handleSearch = () => {
    const queryTrimmed = query.trim();
    const queryLower = queryTrimmed.toLowerCase();
    let filteredResults: Customer[] = [];

    if (queryTrimmed.includes('@')) {
      filteredResults = data.filter(c => c.email.toLowerCase().includes(queryLower));
    } else if (/^\d{7,}$/.test(queryTrimmed)) {
      filteredResults = data.filter(c => c.phone.includes(queryTrimmed));
    } else {
      filteredResults = data.filter(c => c.name.toLowerCase().includes(queryLower));
    }

    setResults(filteredResults);
  };

  // הרצת חיפוש על כל שינוי בשאילתה
  useEffect(() => {
    if (!loading && query) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [query, loading]);

  return (
    <div>
    
    </div>
  );
};
