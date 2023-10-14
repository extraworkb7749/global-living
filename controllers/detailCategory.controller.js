const db = require("../model/db");
const uniqid = require("uniqid");
module.exports.getAllDetail = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM detailcategory ORDER BY sortNumber ASC");
    
    res.status(200).json({ detail: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getOneDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM detailcategory WHERE id=?", [
      id,
    ]);
    res.status(200).json({ detail: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.createDetailCategory = async (req, res) => {
  try {
    const id = uniqid();
    const { detail, category_id, sortNumber } = req.body;
    await db.execute("INSERT INTO detailcategory VALUES(?,?,?,?,?)", [
      id,
      detail,
      category_id,
      null,
      sortNumber,
    ]);
    res.status(201).json({ message: "Tạo mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateDetailCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { detail, sortNumber } = req.body;
    await db.execute(
      "UPDATE detailcategory SET detail=?, sortNumber=?  WHERE id =? ",
      [detail, sortNumber, id]
    );
    res.status(200).json({ message: "Sửa thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.deleteDetailCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM detailcategory WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
