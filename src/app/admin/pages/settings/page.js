'use client';

import React, { useState, useEffect } from 'react';
import FilterableTable from './filterabletable';

const SettingsPage = () => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings([data]);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div>
      <FilterableTable settings={settings} fetchSettings={fetchSettings} />
    </div>
  );
};

export default SettingsPage;
