import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'data', 'products_new.json');

export function getAllProducts() {
  try {
    if (!fs.existsSync(productsPath)) {
      return [];
    }
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const data = JSON.parse(rawData);
    return data;
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

function saveProducts(products) {
  try {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
}

export function addProduct(productData) {
  try {
    const products = getAllProducts();
    
    // Генерируем новый ID
    const maxId = products.reduce((max, p) => {
      const id = parseInt(p.id) || 0;
      return id > max ? id : max;
    }, 0);
    const newId = String(maxId + 1);
    
    const newProduct = {
      id: newId,
      ...productData,
    };
    
    products.push(newProduct);
    
    if (saveProducts(products)) {
      return { success: true, product: newProduct };
    }
    
    return { success: false, error: 'Failed to save product' };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
}

export function updateProduct(id, productData) {
  try {
    const products = getAllProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));
    
    if (index === -1) {
      return { success: false, error: 'Product not found' };
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      id: String(id), // Сохраняем ID
    };
    
    if (saveProducts(products)) {
      return { success: true, product: products[index] };
    }
    
    return { success: false, error: 'Failed to update product' };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

export function deleteProduct(id) {
  try {
    const products = getAllProducts();
    const filteredProducts = products.filter((p) => String(p.id) !== String(id));
    
    if (products.length === filteredProducts.length) {
      return { success: false, error: 'Product not found' };
    }
    
    if (saveProducts(filteredProducts)) {
      return { success: true };
    }
    
    return { success: false, error: 'Failed to delete product' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

export function getProductById(id) {
  try {
    const products = getAllProducts();
    return products.find((p) => String(p.id) === String(id)) || null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

