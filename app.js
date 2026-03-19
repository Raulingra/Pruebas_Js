// Productos disponibles
const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 1299.99, image: 'archivos/Iphone 15 pro.webp' },
    { id: 2, name: 'Samsung Galaxy S24', price: 999.99, image: 'archivos/Samsung Galaxy S24.avif' },
    { id: 3, name: 'Xiaomi Redmi Note 13', price: 399.99, image: 'archivos/Xiaomi Redmi Note 13.webp' },
    { id: 4, name: 'Funda Protectora', price: 29.99, image: 'archivos/Funda Protectora.webp' },
    { id: 5, name: 'Protector de Pantalla', price: 15.99, image: 'archivos/Protector de Pantalla.jpg' },
    { id: 6, name: 'Auriculares Inalámbricos', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
    { id: 7, name: 'Batería Externa 20000mAh', price: 45.99, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { id: 8, name: 'Cargador Rápido 65W', price: 55.99, image: 'archivos/Cargador Rápido 65W.jpg' },
];

let cart = [];

// Inicializar página
function init() {
    renderProducts();
    updateCart();
}

// Renderizar productos
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product" onclick="addToCart(${product.id})">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">Q${product.price.toFixed(2)}</div>
            <button class="btn-add">Agregar</button>
        </div>
    `).join('');
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Actualizar carrito
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Cant: ${item.quantity}</div>
                </div>
                <div class="item-price">Q${(item.price * item.quantity).toFixed(2)}</div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `).join('');
        document.getElementById('checkoutBtn').disabled = false;
    }

    calculateTotals();
}

// Eliminar del carrito
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCart();
}

// Calcular totales
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Proceder a checkout
function proceedToCheckout() {
    if (cart.length === 0) return;
    
    const total = document.getElementById('total').textContent;
    document.getElementById('modalTotal').textContent = total;
    document.getElementById('checkoutModal').classList.add('active');
}

// Confirmar checkout
function confirmCheckout() {
    const total = document.getElementById('total').textContent;
    Swal.fire({
        icon: 'success',
        title: '¡Venta Completada!',
        html: `<strong>Total: Q${total}</strong><br><br>Gracias por su compra.`,
        confirmButtonColor: '#667eea',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        didClose: () => {
            cart = [];
            updateCart();
            closeModal();
        }
    });
}

// Cerrar modal
function closeModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Limpiar carrito
function clearCart() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito Vacío',
            text: 'El carrito ya está vacío',
            confirmButtonColor: '#667eea'
        });
        return;
    }
    Swal.fire({
        icon: 'warning',
        title: '¿Limpiar Carrito?',
        text: '¿Estás seguro de que deseas limpiar el carrito?',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cart = [];
            updateCart();
            Swal.fire({
                icon: 'success',
                title: 'Carrito Limpiado',
                text: 'El carrito ha sido vaciado',
                confirmButtonColor: '#667eea',
                timer: 1500
            });
        }
    });
}

// Cerrar modal al hacer clic fuera
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkoutModal').addEventListener('click', (e) => {
        if (e.target.id === 'checkoutModal') {
            closeModal();
        }
    });

    // Inicializar
    init();
});
