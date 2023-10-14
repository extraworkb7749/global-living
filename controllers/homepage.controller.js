const db = require("../model/db");
const uniqid = require("uniqid");
module.exports.getAllHomepage = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM homepage");
    const homepageImg = await db.execute("SELECT * FROM homepageimg");
    console.log(data[0]);
    console.log(homepageImg[0]);
    const arr = data[0].reduce((pre, curr) => {
      let img = [];

      homepageImg[0].forEach((e) => {
        if (e.imgOf === curr.id) {
          img.push(e.img);
        }
        curr.img = img;
      });
      pre.push(curr);
      return pre;
    }, []);
    res.status(200).json({ data: arr });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.getOneHomepage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM homepage WHERE id=?", [id]);
    res.status(200).json({ data: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.createOneHomepage = async (req, res) => {
  try {
    const {
      title,
      img,
      number,
      descriptionNumber,
      video,
      comment,
      userComment,
      invest,
      heading,
      detail,
    } = req.body;

    const id = uniqid();
    await img.forEach((e) => {
      const idImg = uniqid();
      db.execute("INSERT INTO homepageimg VALUES(?,?,?)", [idImg, e, id]);
    });
    await db.execute("INSERT INTO homepage VALUES(?,?,?,?,?,?,?,?,?,?)", [
      id,
      title,
      number ? number : null,
      descriptionNumber ? descriptionNumber : null,
      video ? video : null,
      comment ? comment : null,
      userComment ? userComment : null,
      invest ? invest : null,
      heading ? heading : null,
      detail ? detail : null,
    ]);
    res.status(200).json({ message: "Them bai dang thanh cong" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.updateOneHomepage = async (req, res) => {
  try {
    const {
      title,
      img,
      number,
      descriptionNumber,
      video,
      comment,
      userComment,
      invest,
      heading,
      detail,
    } = req.body;
    const { id } = req.params;
    if (img.length !== 0) {
      await db.execute("DELETE FROM homepageimg WHERE imgOf=?", [id]);
      await img.forEach((e) => {
        const idImg = uniqid();
        db.execute("INSERT INTO homepageimg VALUES(?,?,?)", [idImg, e, id]);
      });
    }
    const updateQuery =
      "UPDATE homepage SET number=?, descriptionNumber=?, video=?, comment=?, userComment=?, invest=?, heading=?, detail=? WHERE id=?";
    await db.execute(updateQuery, [
      number || null,
      descriptionNumber || null,
      video || null,
      comment || null,
      userComment || null,
      invest || null,
      heading || null,
      detail || null,
      id,
    ]);
    res.status(200).json({ message: "Sửa thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM homepage WHERE id=?", [id]);
    res.status(200).json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
