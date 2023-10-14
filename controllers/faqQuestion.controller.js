const db = require("../model/db");
const uniqid = require("uniqid");

module.exports.getAllQuestions = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM faqquestions");
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.getOneFaqQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM faqquestions WHERE id=?", [
      id,
    ]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.createOneQuestion = async (req, res) => {
  try {
    const id = uniqid();
    const { question, answer, category_id } = req.body;
    await db.execute("INSERT INTO faqquestions VALUES(?,?,?,?)", [
      id,
      question,
      answer,
      category_id,
    ]);
    res.status(200).json({ message: "Tạo FAQ question thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateOneQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category_id } = req.body;
    const updateSql =
      "UPDATE faqquestions SET question=?, answer=?, category_id=? WHERE id=?";
    await db.execute(updateSql, [question, answer, category_id, id]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteOneQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM faqquestions WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa FAQ questions thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
