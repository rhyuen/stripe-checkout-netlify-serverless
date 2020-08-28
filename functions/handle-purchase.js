const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mail = require("@sendgrid/mail");
mail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async ({ body, headers }) => {
    try {
        const stripeEvent = stripe.webhooks.constructEvent(
            body, headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (stripeEvent.type === "checkout.session.completed") {
            const eventObject = stripeEvent.data.object;
            const items = eventObject.display_items;
            const shippingDetails = eventObject.shipping;
            const purchase = { items, shippingDetails };

            const msg = {
                to: process.env.FULFILLMENT_EMAIL_ADDRESS,
                from: process.env.FROM_EMAIL_ADDRESS,
                subject: `New purchase from ${shippingDetails.name}`,
                text: JSON.stringify(purchase, null, 2)
            };

            await mail.send(msg);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };
    } catch (e) {
        console.error(`Stripe webhook failed with ${e}`);
        return {
            statusCode: 400,
            body: `Webhook Error: ${e.message}`
        };
    }
}