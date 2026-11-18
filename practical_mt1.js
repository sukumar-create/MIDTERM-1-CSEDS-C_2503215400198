const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests from Postman
app.use(express.json());

// In-memory product inventory array (Format: id, name, price, category)
let products = [
    { id: 101, name: "Wireless Mouse", price: 799, category: "Electronics" },
    { id: 102, name: "Notebook", price: 120, category: "Stationery" }
];

// 1. GET ALL PRODUCTS
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

// 2. GET SINGLE PRODUCT BY ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
});

// 3. ADD A NEW PRODUCT (POST)
app.post('/products', (req, res) => {
    const { id, name, price, category } = req.body;

    if (!id || !name || !price || !category) {
        return res.status(400).json({ message: "All fields (id, name, price, category) are required" });
    }

    const numericId = parseInt(id);
    if (products.some(p => p.id === numericId)) {
        return res.status(409).json({ message: "Product ID already exists" });
    }

    const newProduct = {
        id: numericId,
        name: name,
        price: parseFloat(price),
        category: category
    };

    products.push(newProduct);
    res.status(201).json({ message: "Product added", product: newProduct });
});

// 4. UPDATE A PRODUCT BY ID (PUT)
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category } = req.body;
    products[index] = {
        id: id,
        name: name || products[index].name,
        price: price !== undefined ? parseFloat(price) : products[index].price,
        category: category || products[index].category
    };

    res.status(200).json({ message: "Product updated", product: products[index] });
});

// 5. DELETE A PRODUCT BY ID (DELETE)
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});