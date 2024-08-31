'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './FilterableTable';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
    fetchColors();
    fetchSizes();
  }, []);

  return (
    <FilterableTable
      products={products}
      fetchProducts={fetchProducts}
      categories={categories}
      subcategories={subcategories}
      colors={colors}
      sizes={sizes}
    />
  );
};

export default ProductPage;
