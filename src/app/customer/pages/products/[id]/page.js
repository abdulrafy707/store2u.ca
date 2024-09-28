import ProductPage from './product'; // Import your ProductPage component
import { notFound } from 'next/navigation';

// Fetch product data server-side using async function
async function getProductData(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${apiUrl}/api/products/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.product;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { id } = params;
  const product = await getProductData(id);

  if (!product) {
    return {
      title: 'Product not found',
      description: 'No product information available',
    };
  }

  return {
    title: product.meta_title || product.name || 'Product Title',
    description: product.meta_description || 'Product Description',
    keywords: product.meta_keywords || 'Product Keywords',
  };
}

const ProductDetailsPage = async ({ params }) => {
  const { id } = params;

  // Fetch the product data
  const product = await getProductData(id);

  // Handle product not found
  if (!product) {
    return notFound(); // Use Next.js built-in 404 handling
  }

  // Return the ProductPage component with the fetched product data
  return <ProductPage productData={product} />;
};

export default ProductDetailsPage;
