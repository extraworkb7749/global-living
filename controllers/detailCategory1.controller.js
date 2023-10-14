const db = require("../model/db");
const uniqid = require("uniqid");
const currentDate = new Date();

module.exports.getAllDetail = async (req, res) => {
  try {
    const data = await db.execute(
      "SELECT * FROM detailcategory ORDER BY sortNumber ASC"
    );

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
    const { detail, categoryId, sortNumber } = req.body;
    const [checkCategory] = await db.execute(
      "SELECT * FROM detailcategory WHERE detail=?",
      [detail]
    );

    if (checkCategory.length) {
      res
        .status(500)
        .json({ message: "detailategory đã tồn tại trong hệ thống" });
    } else {
      const id = uniqid();
      await handleUpdatePosition({ sortNumber, categoryId }, "create");

      await db.execute("INSERT INTO detailcategory VALUE(?,?,?,?,?)", [
        id,
        detail,
        categoryId,
        currentDate,
        sortNumber,
      ]);

      res.status(201).json({ message: "Thêm detailcategory mới thành công" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateDetailCategory = async (req, res) => {
  try {
    const { detail, categoryId, targetDetailCategoryId } = req.body;
    const { id } = req.params;

    if (!targetDetailCategoryId) {
      await db.execute(
        "UPDATE detailcategory SET detail=?, category_id=? WHERE id=?",
        [detail, categoryId, id]
      );
    } else {
      const [currentDetailCategory, targetDetailCategory] = await Promise.all([
        db.execute(`SELECT * FROM detailcategory WHERE id = '${id}'`),
        db.execute(
          `SELECT * FROM detailcategory WHERE id = '${targetDetailCategoryId}'`
        ),
      ]);

      await handleUpdatePosition(
        {
          currentDetailCategory: currentDetailCategory[0][0],
          targetDetailCategory: targetDetailCategory[0][0],
          categoryId
        },
        "update"
      );

      //update category
      await db.execute(
        "UPDATE detailcategory SET detail=?, category_id=?, sortNumber=? WHERE id=?",
        [detail, categoryId, targetDetailCategory[0][0].sortNumber, id]
      );
    }

    res.status(200).json({ message: "Cập nhật detail detailcategory thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteDetailCategory = async (req, res) => {
  try {
    const { id } = req.params;
    //get data to update sort number
    const data = await db.execute("SELECT * FROM detailcategory WHERE id=?", [
      id,
    ]);
    await handleUpdatePosition({ sortNumber: data[0][0].sortNumber, categoryId: data[0][0].category_id }, "delete");

    //delete category
    await db.execute("DELETE FROM detailcategory WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa detail category mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

/**
 * Description: update position by sort number
 * Updated:
 */
const handleUpdatePosition = async (body, type) => {
  try {
    const [listDetailCategory] = await db.execute(`SELECT * FROM detailcategory WHERE category_id = '${body.categoryId}'`);
    if (listDetailCategory.length) {
      for (let itemDetailCategory of listDetailCategory) {
        switch (type) {
          case "create":
            if (itemDetailCategory.sortNumber >= body.sortNumber) {
              await db.execute(`UPDATE detailcategory dc
            SET dc.sortNumber = ${itemDetailCategory.sortNumber + 1}
            WHERE dc.id = '${itemDetailCategory.id}'`);
            }
            break;
          case "update":
            //check sortNumber and increase sortNumber of other item
            //nếu sortNumber của detailcategory hiện tại > sortNumber của detailcategory đích
            if (
              body.currentDetailCategory.sortNumber > body.targetDetailCategory.sortNumber
            ) {
              //thì tăng giá trị của bản ghi midle detailcategory: detailcategory đích <= midle detailcategory < detailcategory hiện tại
              if (
                body.targetDetailCategory.sortNumber <=
                  itemDetailCategory.sortNumber &&
                itemDetailCategory.sortNumber < body.currentDetailCategory.sortNumber
              ) {
                await db.execute(`UPDATE detailcategory dc
          SET dc.sortNumber = ${itemDetailCategory.sortNumber + 1}
          WHERE dc.id = '${itemDetailCategory.id}'`);
              }
            } else {
              //nếu sortNumber của detailcategory hiện tại < sortNumber của detailcategory đích
              //thì giảm giá trị của bản ghi midle detailcategory: detailcategory hiện tại < midle detailcategory <= detailcategory đích
              if (
                body.currentDetailCategory.sortNumber <
                  itemDetailCategory.sortNumber &&
                itemDetailCategory.sortNumber <= body.targetDetailCategory.sortNumber
              ) { 
                await db.execute(`UPDATE detailcategory dc
          SET dc.sortNumber = ${itemDetailCategory.sortNumber - 1}
          WHERE dc.id = '${itemDetailCategory.id}'`);
              }
            }
            break;
          case "delete":
            if (itemDetailCategory.sortNumber > body.sortNumber) {
              await db.execute(`UPDATE detailcategory dc
              SET dc.sortNumber = ${itemDetailCategory.sortNumber - 1}
              WHERE dc.id = '${itemDetailCategory.id}'`);
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
