"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng users
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Tên người dùng",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Email người dùng",
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Số điện thoại người dùng",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Mật khẩu sau khi mã hóa",
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "Trạng thái khóa hoặc mở khóa của tài khoản (0=khóa,1=mở)",
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Vai trò của người dùng",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });

    // 🕒 Trigger tự động cập nhật updated_at khi UPDATE
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION fn_users_updated_at();
    `);
  },

  async down(queryInterface) {
    // Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_users_updated_at();
    `);

    // Xóa bảng
    await queryInterface.dropTable("users");
  },
};
