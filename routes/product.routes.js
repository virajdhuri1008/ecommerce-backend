const router = require("express").Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

// READ DATA
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return [];
  }
};

// WRITE DATA
const writeData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Write failed:", err);
  }
};

// ✅ GET ALL PRODUCTS (VERY IMPORTANT)
router.get("/", (req, res) => {
  const products = readData();
  res.json(products);
});

// ✅ ADD PRODUCT
router.post("/", (req, res) => {
  const products = readData();

  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
    category: req.body.category || "other"
  };

  products.push(newProduct);
  writeData(products);
  res.json(newProduct);
});

// ✅ UPDATE PRODUCT
router.put("/:id", (req, res) => {
  let products = readData();
  products = products.map(p =>
    p.id == req.params.id ? { ...p, ...req.body } : p
  );
  writeData(products);
  res.json({ message: "Product updated" });
});

// ✅ DELETE PRODUCT
router.delete("/:id", (req, res) => {
  const products = readData().filter(p => p.id != req.params.id);
  writeData(products);
  res.json({ message: "Product deleted" });
});

module.exports = router;