import validator from "validator";

export async function POST(req) {
    try {
        const { cardNumber, expiryDate, cvv } = await req.json();

        if (!validator.isCreditCard(cardNumber)) {
            return new Response(
                JSON.stringify({ message: 'Invalid card number. Must be 16 digits.' }),
                { status: 400 }
            );
        }

        if (!validator.matches(expiryDate, /^(0[1-9]|1[0-2])\/\d{2}$/)) {
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


        if (!validator.isNumeric(cvv)) {
            return new Response(
                JSON.stringify({ message: 'Invalid CVV. Must be 3 or 4 digits.' }),
                { status: 400 }
            );
        }

        return new Response(JSON.stringify({ message: 'Card details are valid.' }), { status: 200 });
    } catch (error) {
        console.error('Error validating card details:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}