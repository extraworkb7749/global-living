const db = require("../model/db");
const uniqid = require("uniqid");
const currentDate = new Date();

module.exports.getAllCategory = async (req, res) => {
  try {
    const dataCategory = await db.execute("SELECT * FROM category");
    const dataDetail = await db.execute("SELECT * FROM detailcategory");
    const dataDocument = await db.execute("SELECT * FROM documents");

    const arr = dataCategory[0].map((category) => {
      const children = dataDetail[0]
        .filter((detail) => category.id === detail.category_id)
        .map((detail, index) => {
          const documents = dataDocument[0].filter(
            (document) =>
              document.category_id === category.id &&
              document.detailcategory_id === detail.id
          );
          const sortedDocuments = documents.sort(
            (a, b) => a.sortNumber - b.sortNumber
          );
          const numberedDocuments = sortedDocuments.map((doc, i) => ({
            ...doc,
            sortNumber: i + 1,
          }));
          return { ...detail, documents: numberedDocuments };
        });
      return { ...category, children };
    });

    res.status(200).json({ categories: arr });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports.getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.execute("SELECT * FROM category WHERE id=?", [id]);
    res.status(200).json({ category: data[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const { category, sortNumber } = req.body;
    const checkCategory = await db.execute(
      "SELECT * FROM category WHERE category=?",
      [category]
    );
    if (checkCategory[0].length !== 0) {
      res.status(500).json({ message: "Category đã tồn tại trong hệ thống " });
    } else {
      const id = uniqid();
      await db.execute("INSERT INTO category VALUE(?,?,?,?)", [
        id,
        category,
        null,
        sortNumber,
      ]);
      res.status(201).json({ message: "Thêm category mới thành công" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { category, sortNumber } = req.body;
    const { id } = req.params;
    await db.execute(
      "UPDATE category SET category=?, sortNumber=? WHERE id=?",
      [category, sortNumber, id]
    );
    res.status(200).json({ message: "Cập nhật category thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM category WHERE id=?", [id]);
    res.status(200).json({ message: "Deleted document successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getCategoryListDetail = async (req, res) => {
  try {
    const { category_id } = req.body;
    const data = await db.execute(
      "SELECT * FROM detailcategory WHERE category_id=?",
      [category_id]
    );
    res.status(200).json({ data: data[0] });
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
    const listCategory = await db.execute("SELECT * FROM category");

    if (listCategory[0].length) {
      for (let itemCategory of listCategory[0]) {
        switch (type) {
          case "create":
            if (itemCategory.sortNumber >= body.sortNumber) {
              await db.execute(`UPDATE category ct
            SET ct.sortNumber = ${itemCategory.sortNumber + 1}
            WHERE ct.id = '${itemCategory.id}'`);
            }
            break;
          case "update":
            //check sortNumber and increase sortNumber of other item
            //nếu sortNumber của category hiện tại > sortNumber của category đích
            if (
              body.currentCategory.sortNumber > body.targetCategory.sortNumber
            ) {
              //thì tăng giá trị của bản ghi midle category: category đích <= midle category < category hiện tại
              if (
                body.targetCategory.sortNumber <= itemCategory.sortNumber &&
                itemCategory.sortNumber < body.currentCategory.sortNumber
              ) {
                await db.execute(`UPDATE category ct
          SET ct.sortNumber = ${itemCategory.sortNumber + 1}
          WHERE ct.id = '${itemCategory.id}'`);
              }
            } else {
              //nếu sortNumber của category hiện tại < sortNumber của category đích
              //thì giảm giá trị của bản ghi midle category: category hiện tại < midle category <= category đích
              if (
                body.currentCategory.sortNumber < itemCategory.sortNumber &&
                itemCategory.sortNumber <= body.targetCategory.sortNumber
              ) {
                await db.execute(`UPDATE category ct
          SET ct.sortNumber = ${itemCategory.sortNumber - 1}
          WHERE ct.id = '${itemCategory.id}'`);
              }
            }
            break;
          case "delete":
            if (itemCategory.sortNumber > body.sortNumber) {
              await db.execute(`UPDATE category ct
              SET ct.sortNumber = ${itemCategory.sortNumber - 1}
              WHERE ct.id = '${itemCategory.id}'`);
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

module.exports.addCategory1 = async (req, res) => {
  try {
    const { category, sortNumber } = req.body;
    const checkCategory = await db.execute(
      "SELECT * FROM category WHERE category=?",
      [category]
    );

    if (checkCategory[0].length !== 0) {
      res.status(500).json({ message: "Category đã tồn tại trong hệ thống " });
    } else {
      const id = uniqid();
      await handleUpdatePosition({ sortNumber }, "create");

      await db.execute("INSERT INTO category VALUE(?,?,?,?)", [
        id,
        category,
        currentDate,
        sortNumber,
      ]);

      res.status(201).json({ message: "Thêm category mới thành công" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.updateCategory1 = async (req, res) => {
  try {
    const { category, targetCategoryId } = req.body;
    const { id } = req.params;

    if (!targetCategoryId) {
      await db.execute("UPDATE category SET category=? WHERE id=?", [
        category,
        id,
      ]);
    } else {
      const [currentCategory, targetCategory] = await Promise.all([
        db.execute(`SELECT * FROM category WHERE id = '${id}'`),
        db.execute(`SELECT * FROM category WHERE id = '${targetCategoryId}'`),
      ]);

      await handleUpdatePosition(
        {
          currentCategory: currentCategory[0][0],
          targetCategory: targetCategory[0][0],
        },
        "update"
      );

      //update category
      await db.execute(
        "UPDATE category SET category=?, sortNumber=? WHERE id=?",
        [category, targetCategory[0][0].sortNumber, id]
      );
    }

    res.status(200).json({ message: "Cập nhật category thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteCategory1 = async (req, res) => {
  try {
    const { id } = req.params;
    //get data to update sort number
    const data = await db.execute("SELECT * FROM category WHERE id=?", [id]);
    await handleUpdatePosition({ sortNumber: data[0][0].sortNumber }, "delete");

    //delete category
    await db.execute("DELETE FROM category WHERE id=?", [id]);
    res.status(200).json({ message: "Xóa category mới thành công" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.getAllCategory1 = async (req, res) => {
  try {
    // ORDER BY sortNumber ASC
    const [dataCategory] = await db.execute(
      "SELECT * FROM category ORDER BY sortNumber ASC"
    );
    const [dataDocuments] = await db.execute(
      "SELECT * FROM documents ORDER BY sortNumber ASC "
    );

    if (dataCategory.length) {
      for (let category of dataCategory) {
        const [dataDetailCategory] = await db.execute(
          `SELECT * FROM detailcategory WHERE category_id = '${category.id}' ORDER BY sortNumber ASC`
        );
        if (dataDetailCategory.length) {
          for (let detailCategory of dataDetailCategory) {
            const documents = dataDocuments.filter(function (document) {
              return document.detailcategory_id === detailCategory.id;
            });
            detailCategory.documents = documents;
          }
          category.children = dataDetailCategory;
        }
      }
    }

    res.status(200).json({ categories: dataCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
