let allProducts = [];
const savedCart = localStorage.getItem('cart');
let cart;
if(savedCart){
    cart = JSON.parse(savedCart)
} else {
    cart = [];
}
console.log(cart)
const search = document.getElementById('search');
const category = document.getElementById('category');
const deleteCart = document.getElementById('delete')




search.addEventListener('input', () => {
    applyFilters();
});

category.addEventListener('change', () => {
    applyFilters();
});
deleteCart.addEventListener('click', () =>{
        cart.length = 0; // cart = [];
        saveCart();
        renderCart();
});

async function loadProduct() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) {
            throw new Error('Ошибка сервера: ' + res.status);
        }
        const product = await res.json();
        allProducts = product;
        renderProduct(product);
    } catch(error) {
        console.log("Error!", error);
        const container = document.getElementById("prod");
        container.innerHTML = `<h2>Ошибка загрузки данных</h2>`;
    }
}

function renderProduct(product) {
    const container = document.getElementById("prod")
    if(product.length === 0){
            container.innerHTML = `<article>Not found</article>`;
            return;
        }
    container.innerHTML = product
        .map((item, i) => `<article class="article">
        <img src="${item.image}" alt="${item.title}" class="image">
        <h2>${item.title} </h2>
        <p>Price: ${item.price}$</p>
        <p class="description">${item.description}</p>
        <button type="button" onclick="addToCart(${item.id})">Add to cart</button>
        </article>`)
        .join('');
}

function applyFilters() {
    const text = search.value.toLowerCase();
    const selectedCategory = category.value;

    let result = allProducts;

    if (selectedCategory !== 'all') {
        result = result.filter(item => item.category === selectedCategory);
    }

    result = result.filter(item => item.title.toLowerCase().includes(text));

    renderProduct(result);   
}

function addToCart(id) {
    const product = allProducts.find(item => item.id === id);
    cart.push(product);
    renderCart();
    saveCart();
}
function deleteFromCart(i) {
    cart.splice(i, 1);
    renderCart()
    saveCart();
}

function renderCart() {
    const info = document.getElementById("cart-info");
    
    if(cart.length === 0){
            info.innerHTML = `<article>Cart is empty</article>`;
            return;
        }

        const cost = cart.reduce((sum, item) => sum + item.price, 0)
        info.innerHTML = `
        <article>Products in cart:${cart.length} 
        Total price: ${cost.toFixed(2)}$</article>
        `;
        info.innerHTML += cart.map((item, i) => `<div class="article-container"><article class="article">
        <img src="${item.image}" alt="${item.title}" class="image">
        <h2>${item.title} </h2>
        <p>Price: ${item.price}$</p>
        <p class="description">${item.description}</p>
        <button type="button" onclick="deleteFromCart(${i})">Delete</button></article></div>`)
        .join('');
}

function saveCart() {
    const cartText = JSON.stringify(cart);
    localStorage.setItem('cart', cartText);
}

function toggleCart() {
    const cartSection = document.getElementById('cart');
    cartSection.classList.toggle('hiden');
}

loadProduct()
renderCart()