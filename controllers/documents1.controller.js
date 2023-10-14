const db = require("../model/db");
const uniqid = require("uniqid");
const currentDate = new Date();

/**
 * Description: update position by sort number
 * Updated:
 */
const handleUpdatePosition = async (body, type) => {
  try {
    const listDocuments = await db.execute(`SELECT * FROM documents WHERE detailcategory_id = ${body.detailcategory_id}`);

    if (listDocuments[0].length) {
      for (let itemDocuments of listDocuments[0]) {
        switch (type) {
          case "create":
            if (itemDocuments.sortNumber >= body.sortNumber) {
              await db.execute(`UPDATE documents dc
            SET dc.sortNumber = ${itemDocuments.sortNumber + 1}
            WHERE dc.id = '${itemDocuments.id}'`);
            }
            break;
          case "update":
            //check sortNumber and increase sortNumber of other item
            //nếu sortNumber của documents hiện tại > sortNumber của documents đích
            if (
              body.currentDocuments.sortNumber > body.targetDocuments.sortNumber
            ) {
              //thì tăng giá trị của bản ghi midle documents: documents đích <= midle documents < documents hiện tại
              if (
                body.targetDocuments.sortNumber <= itemDocuments.sortNumber &&
                itemDocuments.sortNumber < body.currentDocuments.sortNumber
              ) {
                await db.execute(`UPDATE documents dc
          SET dc.sortNumber = ${itemDocuments.sortNumber + 1}
          WHERE dc.id = '${itemDocuments.id}'`);
              }
            } else {
              //nếu sortNumber của documents hiện tại < sortNumber của documents đích
              //thì giảm giá trị của bản ghi midle documents: documents hiện tại < midle documents <= documents đích
              if (
                body.currentDocuments.sortNumber < itemDocuments.sortNumber &&
                itemDocuments.sortNumber <= body.targetDocuments.sortNumber
              ) {
                await db.execute(`UPDATE documents dc
          SET dc.sortNumber = ${itemDocuments.sortNumber - 1}
          WHERE dc.id = '${itemDocuments.id}'`);
              }
            }
            break;
          case "delete":
            if (itemDocuments.sortNumber > body.sortNumber) {
              await db.execute(`UPDATE documents dc
              SET dc.sortNumber = ${itemDocuments.sortNumber - 1}
              WHERE dc.id = '${itemDocuments.id}'`);
            }
            break;
          default:
            console.log("other option");
          // code block
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.createDocuments = async (req, res) => {
  try {
    const { title, category_id, image, link, detailcategory_id, sortNumber } =
      req.body;
    const checkCategory = await db.execute(
      "SELECT * FROM documents WHERE title=?",
      [title]
    );

    if (checkCategory[0].length !== 0) {
      res.status(500).json({ message: "Documents đã tồn tại trong hệ thống " });
    } else {
      const id = uniqid();
      await handleUpdatePosition({ sortNumber }, "create");

      await db.execute("INSERT INTO documents VALUES(?,?,?,?,?,?,?,?)", [
        id,
        title,
        category_id,
        image || null,
        link,
        currentDate,
        detailcategory_id,
        sortNumber,
      ]);

      res.status(201).json({ message: "Thêm documents mới thành công" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
};

module.exports.getAllDocuments = async (req, res) => {
  try {
    const data = await db.execute(
      "SELECT * FROM documents ORDER BY sortNumber ASC"
    );
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

    if (!sortNumber) {
      await db.execute(
        "UPDATE documents SET title=?, category_id=?, image=?, link=?, detailcategory_id=? WHERE id=?",
        [title, category_id, image, link, detailcategory_id, id]
      );
    } else {
      const [currentDocuments, targetDocuments] = await Promise.all([
        db.execute(`SELECT * FROM documents WHERE id = '${id}'`),
        db.execute(
          `SELECT * FROM documents WHERE category_id='${category_id}' AND detailcategory_id='${detailcategory_id}' AND sortNumber = ${sortNumber}`
        ),
      ]);

      await handleUpdatePosition(
        {
          currentDocuments: currentDocuments[0][0],
          targetDocuments: targetDocuments[0][0],
        },
        "update"
      );

      //update documents
      await db.execute(
        "UPDATE documents SET title=?, category_id=?, image=?, link=?, detailcategory_id=?,sortNumber=? WHERE id=?",
        [
          title,
          category_id,
          image,
          link,
          detailcategory_id,
          targetDocuments[0][0].sortNumber,
          id,
        ]
      );
    }
    res.status(200).json({ message: "Cập nhật documents thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    //get data to update sort number
    const data = await db.execute("SELECT * FROM documents WHERE id=?", [id]);
    await handleUpdatePosition({ sortNumber: data[0][0].sortNumber }, "delete");

    //delete documents
    await db.execute("DELETE FROM documents WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa category mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
