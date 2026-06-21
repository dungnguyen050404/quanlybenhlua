"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng news
    await queryInterface.createTable("news", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Tiêu đề",
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: "Nội dung",
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Loại tin tức",
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
      CREATE OR REPLACE FUNCTION fn_news_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_news_updated_at
      BEFORE UPDATE ON news
      FOR EACH ROW
      EXECUTE FUNCTION fn_news_updated_at();
    `);
  },

  async down(queryInterface) {
    // Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_news_updated_at ON news;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_news_updated_at();
    `);

    // Xóa bảng
    await queryInterface.dropTable("news");
  },
};
