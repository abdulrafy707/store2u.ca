'use client'
import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';

const SizePage = () => {
  const [sizes, setSizes] = useState([]);

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
    fetchSizes();
  }, []);

  return <FilterableTable sizes={sizes} fetchSizes={fetchSizes} />;
};

export default SizePage;
