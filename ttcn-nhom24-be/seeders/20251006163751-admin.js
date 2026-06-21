'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const argon2 = require('argon2');

const ADMIN = {
  NAME: 'Super Admin',
  EMAIL: 'admin@gmail.com',
  PASSWORD: 'admin@123',
  TYPE: 2,
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Dùng transaction để đảm bảo thao tác đồng bộ, rollback nếu có lỗi
    return queryInterface.sequelize.transaction(async (transaction) => {
      const hashedPassword = await argon2.hash(ADMIN.PASSWORD);

      // Bước 1: Kiểm tra xem tài khoản admin đã tồn tại chưa
      const existingAdmins = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = :email`,
        {
          replacements: { email: ADMIN.EMAIL },
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        },
      );

      if (existingAdmins.length > 0) {
        // Bước 2: Nếu tài khoản đã tồn tại, cập nhật thông tin
        await queryInterface.bulkUpdate(
          'users',
          {
            name: ADMIN.NAME,
            password: hashedPassword,
            type: ADMIN.TYPE,
            updated_at: new Date(),
          },
          {
            email: ADMIN.EMAIL,
          },
          { transaction },
        );
      } else {
        // Bước 3: Nếu tài khoản chưa tồn tại, thêm mới
        await queryInterface.bulkInsert(
          'users',
          [
            {
              name: ADMIN.NAME,
              email: ADMIN.EMAIL,
              password: hashedPassword,
              type: ADMIN.TYPE,
              created_at: new Date(),
            },
          ],
          { transaction },
        );
      }
    });
  },

  async down(queryInterface) {
    // Dùng transaction để rollback nếu có lỗi khi xóa
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Xóa tài khoản admin dựa trên email
      await queryInterface.bulkDelete(
        'users',
        {
          email: ADMIN.EMAIL,
        },
        { transaction },
      );
    });
  },
};
