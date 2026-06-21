"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng search_logs
    await queryInterface.createTable("search_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      keyword: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Từ khóa người dùng nhập",
      },
      disease_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Kết quả được chọn (nếu có)",
        references: {
          model: "diseases",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      CREATE OR REPLACE FUNCTION fn_search_logs_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_search_logs_updated_at
      BEFORE UPDATE ON search_logs
      FOR EACH ROW
      EXECUTE FUNCTION fn_search_logs_updated_at();
    `);
  },

  async down(queryInterface) {
    // 🧹 Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_search_logs_updated_at ON search_logs;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_search_logs_updated_at();
    `);

    // 🗑️ Xóa bảng
    await queryInterface.dropTable("search_logs");
  },
};
