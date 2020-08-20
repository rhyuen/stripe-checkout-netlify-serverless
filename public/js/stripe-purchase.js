export async function handleFormSubmission(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
        sku: form.get("sku"),
        quantity: Number(form.get("quantity"))
    };

    const url = "/.netlify/functions/create-checkout";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
    console.log(response.publishableKey);
    const stripe = Stripe(response.publishableKey);
    const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId
    });

    if (error) {
        console.error(error)
    }
}