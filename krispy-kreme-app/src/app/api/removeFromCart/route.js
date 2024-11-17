import clientPromise from "../../lib/mongodb";

export async function DELETE(req) {
    const {searchParams} = new URL(req.url);
    const userID = searchParams.get('userID');
    const productID = searchParams.get('productID');

    if (!userID || !productID) {
        return new Response('User ID and Product ID are required', {status: 400});
    }

    try {
        const client = await clientPromise;
        const db = client.db('krispy-kreme');
        const collection = db.collection('cart');

        console.log('productID:', productID); // Log the raw productID passed
        console.log('productID Type:', typeof productID); // Log the type of productID

        // Remove all items with this productID from the user's cart
        const result = await collection.deleteMany({
            userID,
            productID: productID
        });
        console.log('Delete result: ', result);

        if (result.deletedCount > 0) {
            return new Response('Item(s) removed successfully', {status: 200});
        } else {
            return new Response('No items found to remove', {status: 404});
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return new Response('Error removing item from cart', {status: 500});
    }
}