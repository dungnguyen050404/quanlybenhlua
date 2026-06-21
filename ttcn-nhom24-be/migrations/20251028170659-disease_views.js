"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng disease_views
    await queryInterface.createTable("disease_views", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      disease_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "FK -> diseases.id",
        references: {
          model: "diseases",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_ip: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "Địa chỉ IP của người xem",
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
      CREATE OR REPLACE FUNCTION fn_disease_views_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_disease_views_updated_at
      BEFORE UPDATE ON disease_views
      FOR EACH ROW
      EXECUTE FUNCTION fn_disease_views_updated_at();
    `);
  },

  async down(queryInterface) {
    // 🧹 Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_disease_views_updated_at ON disease_views;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_disease_views_updated_at();
    `);

    // 🗑️ Xóa bảng
    await queryInterface.dropTable("disease_views");
  },
};
