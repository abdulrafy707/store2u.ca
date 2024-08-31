export const fetchTopRatedProducts = async () => {
    const response = await fetch('/api/products/topRated');
    if (!response.ok) {
      throw new Error('Failed to fetch top-rated products');
    }
    return response.json();
  };
  