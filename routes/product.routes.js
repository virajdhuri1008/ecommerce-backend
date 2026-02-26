const router = require("express").Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

const readData = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Read error:", err);
    return [];
  }
};

const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET PRODUCTS
router.get("/", (req, res) => {
  res.json(readData());
});

// ADD PRODUCT
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

// UPDATE PRODUCT
router.put("/:id", (req, res) => {
  let products = readData();
  products = products.map(p =>
    p.id == req.params.id ? { ...p, ...req.body } : p
  );
  writeData(products);
  res.json({ message: "Product updated" });
});

// DELETE PRODUCT
router.delete("/:id", (req, res) => {
  const products = readData().filter(p => p.id != req.params.id);
  writeData(products);
  res.json({ message: "Product deleted" });
});

module.exports = router;
