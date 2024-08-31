'use client'
import React, { useState, useEffect } from 'react';
import FilterableCouponTable from './FilterableCouponTable';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return <FilterableCouponTable coupons={coupons} fetchCoupons={fetchCoupons} />;
};

export default CouponsPage;
