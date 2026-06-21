import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Email của người dùng, bắt buộc phải là email hợp lệ',
    example: 'admin@gmail.com',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập địa chỉ email.' })
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ email.' })
  @IsEmail({}, { message: 'Vui lòng nhập địa chỉ email hợp lệ.' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng, cần ít nhất 8 ký tự',
    example: 'Admin@123',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập mật khẩu.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @IsString({ message: 'Vui lòng nhập mật khẩu hợp lệ.' })
  @MinLength(8, { message: 'Vui lòng nhập mật khẩu có ít nhất 8 ký tự.' })
  password: string;
}
