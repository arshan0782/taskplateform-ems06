
import UserModel from "../models/User.model.js";

// fetch employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await UserModel.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (err) {
    console.error("FETCH EMPLOYEES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// create employee(user)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password,gender,phone } = req.body;

    if (!name || !email || !password || !gender || !phone) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    
    const employee = await UserModel.create({
      name,
      email,
      password,
      gender,
      phone,
      role: "employee"
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        gender: employee.gender,
        role: employee.role,
        createdAt: employee.createdAt
      }
    });
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Failed to create employee"
    });
  }
};

// delete user  
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Admin cannot delete own account
    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admin cannot delete another admin
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot delete another admin" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// update user details

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, gender, role } = req.body;

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Admin ko update/delete nahi kar sakte
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot update admin" });
    }

    //  Duplicate email check
    if (email && email !== user.email) {
      const exists = await UserModel.findOne({ email });
      if (exists) {
        return res.status(400).json({
          message: "Email already in use"
        });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    //  Role change allowed only by admin
    if (role && ["employee"].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
