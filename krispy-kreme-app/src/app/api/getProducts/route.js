import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const productsCollection = db.collection('products');

        const products = await productsCollection.find().toArray();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}