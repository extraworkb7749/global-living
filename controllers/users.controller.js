const db = require("../model/db");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.getAllUsers = async (req, res) => {
  try {
    const data = await db.execute("SELECT * FROM users");
    res.status(200).json({ users: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};
module.exports.getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.execute("SELECT * FROM users WHERE id=?", [id]);
    res.status(200).json(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

module.exports.createNewUser = async (req, res) => {
  const { full_name, email, phone, area, agent_name, password, role_id } =
    req.body;
  const id = uniqid();

  try {
    const existingUser = await db.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (existingUser[0].length !== 0) {
      res.status(200).json({ message: "Email đã tồn tại trong hệ thống" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        id,
        full_name,
        email,
        phone,
        area,
        agent_name,
        hashedPassword,
        role_id ? role_id : 3,
      ]);
      res.status(200).json({ message: "Đăng ký thành công" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};

module.exports.signInExistingUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (existingUser[0].length !== 0) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser[0][0].password
      );
      if (passwordMatch) {
        const token = jwt.sign(
          {
            id: existingUser[0][0].id,
            email: email,
            role: existingUser[0][0].role_id,
          },
          `${process.env.TOKEN_SECRET}`
        );
        res.status(200).json({ message: "Đăng nhập thành công", token: token });
      } else {
        res.status(500).json({ message: "Sai mật khẩu" });
      }
    } else {
      res.status(500).json({ message: "Sai tên tài khoản hoặc mật khẩu" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await db.execute("SELECT * FROM users WHERE id=?", [
      id,
    ]);
    if (existingUser[0].length === 0) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    } else {
      await db.execute("DELETE FROM users WHERE id=?", [id]);
      res.status(200).json({ message: "Người dùng đã được xóa thành công" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};

module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, area, agent_name, password, role_id } =
    req.body;

  try {
    const existingUser = await db.execute("SELECT * FROM users WHERE id=?", [
      id,
    ]);
    if (existingUser[0].length === 0) {
      res.status(404).json({ message: "User does not exist" });
    } else {
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : existingUser[0][0].password;
      await db.execute(
        "UPDATE users SET full_name=?, email=?, phone=?, area=?, agent_name=?, password=?, role_id=? WHERE id=?",
        [full_name, email, phone, area, agent_name, hashedPassword, role_id, id]
      );
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
