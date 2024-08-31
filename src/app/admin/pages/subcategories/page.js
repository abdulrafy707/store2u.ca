'use client';
import { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';

const SubcategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const result = await response.json();
      setSubcategories(result);
      console.log('Subcategories:', result); // Logging the fetched subcategories
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      setCategories(result);
      console.log('Categories:', result); // Logging the fetched categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <FilterableTable
          subcategories={subcategories}
          fetchSubcategories={fetchSubcategories}
          categories={categories}
        />
      )}
    </div>
  );
};

export default SubcategoriesPage;
