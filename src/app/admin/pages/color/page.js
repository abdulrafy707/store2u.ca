'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';

const ColorPage = () => {
  const [colors, setColors] = useState([]);

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return <FilterableTable colors={colors} fetchColors={fetchColors} />;
};

export default ColorPage;
