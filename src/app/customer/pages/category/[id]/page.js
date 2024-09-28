import { notFound } from 'next/navigation';
import CategoryPage from './CategoryPage'; // Your CategoryPage component
import Head from 'next/head';

// Fetch category data server-side using async function
async function getCategoryData(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${apiUrl}/api/categories/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('Error fetching category data:', res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data || !data.data) {
      console.error('Category data is missing in the response');
      return null;
    }

    return data.data; // Ensure you return the correct data structure
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { id } = params;
  const category = await getCategoryData(id);

  if (!category) {
    return {
      title: 'Category not found',
      description: 'No category information available',
    };
  }

  // Set meta title, description, and keywords dynamically based on category data
  return {
    title: category.meta_title || category.name || 'Category Title',
    description: category.meta_description || 'Category Description',
    keywords: category.meta_keywords || 'Category Keywords',
  };
}

const CategoryDetailsPage = async ({ params }) => {
  const { id } = params;

  // Fetch the category data
  const category = await getCategoryData(id);

  // Handle category not found
  if (!category) {
    return notFound(); // Use Next.js built-in 404 handling
  }

  // Return the page with meta tags and category data
  return (
    <>
      {/* Set Meta Tags for SEO */}
      <Head>
        <title>{category.meta_title || 'Category Title'}</title>
        <meta name="description" content={category.meta_description || 'Category Description'} />
        <meta name="keywords" content={category.meta_keywords || 'Category Keywords'} />
      </Head>

      {/* Render the Category Page */}
      <CategoryPage categoryData={category} />
    </>
  );
};

export default CategoryDetailsPage;
