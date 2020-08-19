import { handleFormSubmission } from "./stripe-purchase.js";

export async function loadProducts() {
    const data = await fetch("/.netlify/functions/get-products").then(res => res.json()).catch(err => console.error(err));
    const products = document.querySelector(".products");


    data.forEach(item => {
        const product = createProductFromTemplate(item);
        products.appendChild(product);
    });

}

function createProductFromTemplate(item) {
    const template = document.querySelector("#product");
    const product = template.content.cloneNode(true);

    const { name, description, sku, currency, amount, image } = item;

    product.querySelector("h2").innerText = name;
    product.querySelector(".description").innerText = description;
    product.querySelector("[name=sku]").value = sku;
    product.querySelector(".price").innerText = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency
    }).format((amount / 100).toFixed(2));

    const img = product.querySelector("img");
    img.src = image;
    img.alt = name;

    const form = product.querySelector("form");
    form.addEventListener("submit", handleFormSubmission);

    return product;
}