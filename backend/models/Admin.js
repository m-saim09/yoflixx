const bcrypt = require("bcryptjs");
const { createFileModel } = require("../lib/fileModel");

const useFile = process.env.DATABASE_PROVIDER === 'file';

if (!useFile) {
  const mongoose = require("mongoose");

  const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      default: "Admin",
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
  );

  adminSchema.pre("save", async function () {
    if (!this.isModified('password')) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  // Method to compare passwords
  adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  module.exports = mongoose.model("Admin", adminSchema);
} else {
  // File-based model
  const Model = createFileModel('users.json');
  // Wrap create to hash password and apply admin defaults
  const originalCreate = Model.create.bind(Model);
  Model.create = async (doc) => {
    const next = { ...doc };
    if (next.password) {
      const salt = await bcrypt.genSalt(10);
      next.password = await bcrypt.hash(next.password, salt);
    }
    if (next.isActive === undefined) {
      next.isActive = true;
    }
    if (!next.role) {
      next.role = "admin";
    }
    if (!next.name) {
      next.name = "Admin";
    }
    return originalCreate(next);
  };

  // Provide comparePassword and save on instances
  const origFindById = Model.findById.bind(Model);
  Model.findById = async (id) => {
    const inst = await origFindById(id);
    if (!inst) return null;
    inst.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };
    inst.save = async function () {
      const items = await Model._readAll();
      const idx = items.findIndex((item) => String(item._id) === String(this._id));
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...this, updatedAt: new Date().toISOString() };
        await Model._writeAll(items);
      }
      return this;
    };
    return inst;
  };

  const origFindOne = Model.findOne.bind(Model);
  Model.findOne = (filter) => {
    const q = {
      select() {
        return this;
      },
      then(resolve, reject) {
        return origFindOne(filter).then((inst) => {
          if (inst) {
            inst.comparePassword = async function (enteredPassword) {
              return await bcrypt.compare(enteredPassword, this.password);
            };
            inst.save = async function () {
              const items = await Model._readAll();
              const idx = items.findIndex((item) => String(item._id) === String(this._id));
              if (idx >= 0) {
                items[idx] = { ...items[idx], ...this, updatedAt: new Date().toISOString() };
                await Model._writeAll(items);
              }
              return this;
            };
          }
          return resolve ? resolve(inst) : inst;
        }, reject);
      },
      catch(reject) {
        return origFindOne(filter).catch(reject);
      },
    };
    return q;
  };

  module.exports = Model;
}
