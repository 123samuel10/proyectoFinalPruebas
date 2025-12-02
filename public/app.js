// API Configuration
const API_URL = 'http://localhost:3000/api';

// State
let categories = [];
let products = [];
let editingItem = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

// Tab Navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Categories Functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();

        if (data.success) {
            categories = data.data;
            renderCategories();
            updateCategorySelects();
        } else {
            showToast('Error al cargar categorías', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

function renderCategories() {
    const container = document.getElementById('categories-list');

    if (categories.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay categorías registradas</p></div>';
        return;
    }

    container.innerHTML = categories.map(category => `
        <div class="list-item">
            <div class="list-item-header">
                <h3 class="list-item-title">${category.name}</h3>
                <div class="list-item-actions">
                    <button class="btn btn-secondary" onclick="editCategory(${category.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function handleCategorySubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const categoryData = {
        name: formData.get('name')
    };

    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        const data = await response.json();

        if (data.success) {
            showToast('Categoría creada exitosamente', 'success');
            e.target.reset();
            loadCategories();
        } else {
            showToast(data.error || 'Error al crear categoría', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

async function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const modalBody = `
        <form id="edit-category-form">
            <div class="form-group">
                <label for="edit-category-name">Nombre de la categoría:</label>
                <input type="text" id="edit-category-name" value="${category.name}" required>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
        </form>
    `;

    openModal('Editar Categoría', modalBody);

    document.getElementById('edit-category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-category-name').value;

        try {
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (data.success) {
                showToast('Categoría actualizada exitosamente', 'success');
                closeModal();
                loadCategories();
            } else {
                showToast(data.error || 'Error al actualizar categoría', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error de conexión', 'error');
        }
    });
}

async function deleteCategory(id) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showToast('Categoría eliminada exitosamente', 'success');
            loadCategories();
            loadProducts(); // Reload products as they might be affected
        } else {
            showToast(data.error || 'Error al eliminar categoría', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

// Products Functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (data.success) {
            products = data.data;
            renderProducts();
        } else {
            showToast('Error al cargar productos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

function renderProducts(filteredProducts = null) {
    const container = document.getElementById('products-list');
    const productsToRender = filteredProducts || products;

    if (productsToRender.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay productos registrados</p></div>';
        return;
    }

    container.innerHTML = productsToRender.map(product => `
        <div class="list-item">
            <div class="list-item-header">
                <div>
                    <h3 class="list-item-title">${product.name}</h3>
                    <span class="category-badge">${product.category?.name || 'Sin categoría'}</span>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>
            </div>
            <div class="list-item-body">
                <p>${product.description || 'Sin descripción'}</p>
            </div>
            <div class="product-details">
                <div class="detail-item">
                    <div class="detail-label">Precio</div>
                    <div class="detail-value">$${parseFloat(product.price).toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Stock</div>
                    <div class="detail-value">${product.stock} unidades</div>
                </div>
            </div>
        </div>
    `).join('');
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category_id: parseInt(formData.get('category_id'))
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (data.success) {
            showToast('Producto creado exitosamente', 'success');
            e.target.reset();
            loadProducts();
        } else {
            showToast(data.error || 'Error al crear producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

async function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const categoriesOptions = categories.map(cat =>
        `<option value="${cat.id}" ${cat.id === product.category_id ? 'selected' : ''}>${cat.name}</option>`
    ).join('');

    const modalBody = `
        <form id="edit-product-form">
            <div class="form-group">
                <label for="edit-product-name">Nombre del producto:</label>
                <input type="text" id="edit-product-name" value="${product.name}" required>
            </div>
            <div class="form-group">
                <label for="edit-product-description">Descripción:</label>
                <textarea id="edit-product-description" rows="3">${product.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-product-price">Precio:</label>
                    <input type="number" id="edit-product-price" value="${product.price}" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label for="edit-product-stock">Stock:</label>
                    <input type="number" id="edit-product-stock" value="${product.stock}" min="0" required>
                </div>
            </div>
            <div class="form-group">
                <label for="edit-product-category">Categoría:</label>
                <select id="edit-product-category" required>
                    ${categoriesOptions}
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
        </form>
    `;

    openModal('Editar Producto', modalBody);

    document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedProduct = {
            name: document.getElementById('edit-product-name').value,
            description: document.getElementById('edit-product-description').value,
            price: parseFloat(document.getElementById('edit-product-price').value),
            stock: parseInt(document.getElementById('edit-product-stock').value),
            category_id: parseInt(document.getElementById('edit-product-category').value)
        };

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            const data = await response.json();

            if (data.success) {
                showToast('Producto actualizado exitosamente', 'success');
                closeModal();
                loadProducts();
            } else {
                showToast(data.error || 'Error al actualizar producto', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error de conexión', 'error');
        }
    });
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showToast('Producto eliminado exitosamente', 'success');
            loadProducts();
        } else {
            showToast(data.error || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

function filterProducts() {
    const categoryId = document.getElementById('filter-category').value;

    if (!categoryId) {
        renderProducts();
        return;
    }

    const filtered = products.filter(p => p.category_id === parseInt(categoryId));
    renderProducts(filtered);
}

// Utility Functions
function updateCategorySelects() {
    const productCategorySelect = document.getElementById('product-category');
    const filterCategorySelect = document.getElementById('filter-category');

    const options = categories.map(cat =>
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    productCategorySelect.innerHTML = '<option value="">Seleccionar categoría...</option>' + options;
    filterCategorySelect.innerHTML = '<option value="">Todas las categorías</option>' + options;
}

function openModal(title, body) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('edit-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeModal();
    }
}
