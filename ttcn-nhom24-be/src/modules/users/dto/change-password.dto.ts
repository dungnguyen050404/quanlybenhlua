import { IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchPassword } from '../validators';

export class ChangePasswordUserDto {
  @ApiProperty({
    description: 'Mật khẩu mới của người dùng, không được để trống',
    example: 'Example@123',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập mật khẩu mới.' })
  @IsString({ message: 'Vui lòng nhập mật khẩu hợp lệ.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới.' })
  new_password: string;

  @ApiProperty({
    description: 'Mật khẩu xác nhận của người dùng, không được để trống',
    example: 'Example@123',
    required: true,
  })
  @IsDefined({ message: 'Vui lòng nhập mật khẩu xác nhận.' })
  @IsString({ message: 'Vui lòng nhập mật khẩu hợp lệ.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu xác nhận.' })
  @Validate(MatchPassword)
  confirm_password: string;
}
