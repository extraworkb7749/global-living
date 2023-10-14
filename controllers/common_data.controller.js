const db = require("../model/db");
const uniqid = require("uniqid");
const currentDate = new Date();

module.exports.addCommonData = async (req, res) => {
  try {
    const { name, link, type, typeDetail } = req.body;
    const id = uniqid();
    active = true

    await db.execute("INSERT INTO common_data VALUE(?,?,?,?,?,?,?)", [
      id,
      name,
      link,
      type,
      typeDetail,
      currentDate,
      active
    ]);

    res.status(201).json({ message: "Thêm dữ liệu mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateCommonData = async (req, res) => {
  try {
    const { name, link, type, typeDetail, active } = req.body;
    const { id } = req.params;

    await db.execute(
      "UPDATE common_data SET name=?, link=?, type=?, type_detail=?, active=? WHERE id=?",
      [name, link, type, typeDetail, active, id]
    );

    res.status(200).json({ message: "Cập nhật dữ liệu thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

module.exports.deleteCommonData = async (req, res) => {
  try {
    const { id } = req.params;

    //delete category
    await db.execute("DELETE FROM common_data WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa dữ liệu mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getOneCommonData = async (req, res) => {
  try {
    const { id } = req.params;

    //delete category
    const [data] = await db.execute(`SELECT * FROM common_data WHERE id='${id}'`);

    if(!data.length){
      res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
      return
    }
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getAllCommonData = async (req, res) => {
  try {
    // ORDER BY sortNumber ASC
    const [common_data] = await db.execute(
      "SELECT * FROM common_data ORDER BY name ASC"
    );

    res.status(200).json({ common_data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
