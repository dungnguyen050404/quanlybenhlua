"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng diseases
    await queryInterface.createTable("diseases", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "Tên bệnh",
      },
      definition: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: "Khái niệm",
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: "Nội dung",
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
      CREATE OR REPLACE FUNCTION fn_diseases_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_diseases_updated_at
      BEFORE UPDATE ON diseases
      FOR EACH ROW
      EXECUTE FUNCTION fn_diseases_updated_at();
    `);
  },

  async down(queryInterface) {
    // Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_diseases_updated_at ON diseases;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_diseases_updated_at();
    `);

    // Xóa bảng
    await queryInterface.dropTable("diseases");
  },
};
