const db = require("../model/db");
const uniqid = require("uniqid");

module.exports.getAllFaqCategory = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM faqcategory");
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.getOneFaqCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM faqcategory WHERE id=?", [id]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.createOneFaqCategory = async (req, res) => {
  try {
    const id = uniqid();
    const { category } = req.body;
    await db.execute("INSERT INTO faqcategory VALUES(?,?)", [id, category]);
    res.status(200).json({ message: "Tạo FAQ category thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateOneFaqCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const updateSql = "UPDATE faqcategory SET category=? WHERE id=?";
    await db.execute(updateSql, [category, id]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM faqcategory WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa FAQ category thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
