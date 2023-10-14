const db = require("../model/db");
const uniqid = require("uniqid");

module.exports.getAllCustomerInfo = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM customer_info");
    res.status(200).json({ users: data[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};
module.exports.getOneCustomerInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.execute("SELECT * FROM customer_info WHERE id=?", [
      id,
    ]);
    res.status(200).json({ user: data[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

module.exports.takeCustomerInfo = async (req, res) => {
  const { full_name, email, phone, product } = req.body;
  const id = uniqid();

  try {
    await db.execute("INSERT INTO customer_info VALUE(?,?,?,?,?)", [
      id,
      full_name,
      email,
      phone,
      product,
    ]);
    res.status(200).json({ message: "Sent user's info successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
};
module.exports.deleteCustomerInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.execute("DELETE FROM customer_info WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Customer info not found" });
    } else {
      res.status(200).json({ message: "Customer info deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
};

module.exports.updateCustomerInfo = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, product } = req.body;

  try {
    const existingCustomerInfo = await db.execute(
      "SELECT * FROM customer_info WHERE id = ?",
      [id]
    );

    if (existingCustomerInfo[0].length === 0) {
      res.status(404).json({ message: "Customer info not found" });
    } else {
      await db.execute(
        "UPDATE customer_info SET full_name=?, email=?, phone=?, product=? WHERE id = ?",
        [full_name, email, phone, product, id]
      );
      res
        .status(200)
        .json({ message: "Update thông tin khách hàng thành công" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
