const db = require("../model/db");
const uniqid = require("uniqid");

module.exports.createDocuments = async (req, res) => {
  try {
    const { title, category_id, image, link, detailcategory_id,sortNumber } = req.body;
    const id = uniqid();
    console.log(title, category_id, image, link, detailcategory_id);
    await db.execute("INSERT INTO documents VALUES(?,?,?,?,?,?,?,?)", [
      id,
      title,
      category_id,
      image || null,
      link,
      null,
      detailcategory_id,
      sortNumber
    ]);
    res.status(201).json({
      message: "Added document successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
};

module.exports.getAllDocuments = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM documents ORDER BY sortNumber ASC");
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.getOneDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM documents WHERE id=?", [id]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports.updateDocument = async (req, res) => {
  try {
    const { title, category_id, image, link, detailcategory_id, sortNumber } =
      req.body;
    const { id } = req.params;
    await db.execute(
      "UPDATE documents SET title=?, category_id=?, image=?, link=?, detailcategory_id=?,sortNumber=? WHERE id=?",
      [title, category_id, image, link, detailcategory_id, sortNumber, id]
    );
    res.status(200).json({ message: "Updated document successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM documents WHERE id=?", [id]);
    res.status(200).json({ message: "Deleted document successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
