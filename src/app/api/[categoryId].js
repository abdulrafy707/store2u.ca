// src/api/category/[categoryId].js
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../util/prisma';

export default async function handler(req, res) {
  const { categoryId } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: {
        images: true,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
}
