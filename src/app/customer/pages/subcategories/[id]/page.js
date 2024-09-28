import { notFound } from 'next/navigation';
import SubcategoryPage from './SubcategoryPage'; // Adjust the import path if necessary

// Fetch subcategory data server-side
async function getSubcategoryData(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${apiUrl}/api/subcatdetail/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('Error fetching subcategory data:', res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data || !data.data) {
      console.error('Subcategory data is missing in the response');
      return null;
    }

    return data.data; // Return the subcategory details
  } catch (error) {
    console.error('Error fetching subcategory data:', error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { id } = params;
  const subcategory = await getSubcategoryData(id);

  if (!subcategory) {
    return {
      title: 'Subcategory not found',
      description: 'No subcategory information available',
    };
  }

  // Return metadata based on fetched subcategory details
  return {
    title: subcategory.meta_title || subcategory.name || 'Subcategory Title',
    description: subcategory.meta_description || 'Subcategory Description',
    keywords: subcategory.meta_keywords || 'Subcategory Keywords',
  };
}

const SubcategoryDetailsPage = async ({ params }) => {
  const { id } = params;

  // Fetch the subcategory data
  const subcategory = await getSubcategoryData(id);

  // Handle subcategory not found
  if (!subcategory) {
    return notFound(); // Use Next.js built-in 404 handling
  }

  // Return the SubcategoryPage component with the fetched subcategory data
  return <SubcategoryPage subcategoryData={subcategory} />;
};

export default SubcategoryDetailsPage;
