const db = require("../model/db");
const uniqid = require("uniqid");
module.exports.getAllNewsDetail = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM newsdetail");
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getOneNewDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM newsdetail WHERE id=?", [id]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.createNewDetail = async (req, res) => {
  try {
    const { detail, news_id } = req.body;
    const id = uniqid();
    await db.execute("INSERT INTO newsdetail VALUES(?,?,?)", [
      id,
      detail,
      news_id,
    ]);
    res.status(201).json({ message: "Thêm mới chi tiết tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.updateNewDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { detail } = req.body;

    const updateQuery = "UPDATE newsdetail SET detail=? WHERE id=?";
    await db.execute(updateQuery, [detail, id]);
    res.status(200).json({ message: "Sửa chi tiết tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.deleteNewDetail = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM newsdetail WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa chi tiết tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
