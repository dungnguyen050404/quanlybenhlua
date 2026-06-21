"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 🧩 Tạo bảng liên kết news_diseases
    await queryInterface.createTable("news_diseases", {
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "FK -> news.id",
        references: {
          model: "news",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    });

    // 🧱 Tạo unique index (news_id, disease_id)
    await queryInterface.addConstraint("news_diseases", {
      fields: ["news_id", "disease_id"],
      type: "unique",
      name: "unique_news_disease",
    });

    // 🕒 Trigger tự động cập nhật updated_at
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_news_diseases_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_news_diseases_updated_at
      BEFORE UPDATE ON news_diseases
      FOR EACH ROW
      EXECUTE FUNCTION fn_news_diseases_updated_at();
    `);
  },

  async down(queryInterface) {
    // 🧹 Xóa trigger và function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_news_diseases_updated_at ON news_diseases;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS fn_news_diseases_updated_at();
    `);

    // 🗑️ Xóa bảng
    await queryInterface.dropTable("news_diseases");
  },
};
