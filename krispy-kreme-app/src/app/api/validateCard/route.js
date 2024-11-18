export async function POST(req) {
    try {
        const { cardNumber, expiryDate, cvv } = await req.json();

        // Basic regex validation
        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
        const cvvRegex = /^[0-9]{3,4}$/;

        if (!cardNumberRegex.test(cardNumber)) {
            return new Response(
                JSON.stringify({ message: 'Invalid card number. Must be 16 digits.' }),
                { status: 400 }
            );
        }

        if (!expiryRegex.test(expiryDate)) {
            return new Response(
                JSON.stringify({ message: 'Invalid expiry date. Use MM/YY format.' }),
                { status: 400 }
            );
        }

        const [month, year] = expiryDate.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return new Response(JSON.stringify({ message: 'Card is expired.' }), { status: 400 });
        }

        if (!cvvRegex.test(cvv)) {
            return new Response(
                JSON.stringify({ message: 'Invalid CVV. Must be 3 or 4 digits.' }),
                { status: 400 }
            );
        }

        // If all checks pass
        return new Response(JSON.stringify({ message: 'Card details are valid.' }), { status: 200 });
    } catch (error) {
        console.error('Error validating card details:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}