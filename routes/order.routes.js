const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../data/orders.json");

const readOrders = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const writeOrders = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET orders
router.get("/", (req, res) => {
  res.json(readOrders());
});

// POST order
router.post("/", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    id: Date.now(),
    status: "Pending",   // ✅ NEW
    ...req.body
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.json({ message: "Order placed successfully" });
});

// UPDATE ORDER STATUS
router.put("/:id", (req, res) => {
  let orders = readOrders();

  orders = orders.map(o =>
    o.id == req.params.id ? { ...o, status: req.body.status } : o
  );

  writeOrders(orders);
  res.json({ message: "Order updated" });
});


module.exports = router;
