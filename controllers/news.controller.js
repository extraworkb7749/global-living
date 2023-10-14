const db = require("../model/db");
const uniqid = require("uniqid");
module.exports.getAllNews = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM news");
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getOneNew = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM news WHERE id=?", [id]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.createNew = async (req, res) => {
  try {
    const { title, content, img } = req.body;
    const id = uniqid();
    await db.execute("INSERT INTO news VALUES(?,?,?,?,?)", [
      id,
      title,
      content,
      img ? img : null,
      null,
    ]);
    res.status(201).json({ message: "Thêm mới tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.updateNew = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, img } = req.body;
    console.log(req.body);
    const updateQuery = "UPDATE news SET title=?, content=?, img=? WHERE id=?";
    await db.execute(updateQuery, [title, content, img, id]);
    res.status(200).json({ message: "Sửa tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.deleteNew = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM news WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa tin tức thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
