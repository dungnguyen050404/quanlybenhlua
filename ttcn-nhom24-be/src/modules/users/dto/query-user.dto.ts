import { IsOptional, IsInt, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const ALLOWED_SORT_FIELDS = ['name', 'email', 'phone', 'created_at'];

export class QueryUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang không được nhỏ hơn 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số bản ghi phải là số nguyên' })
  @Min(1, { message: 'Số bản ghi phải lớn hơn 1' })
  per_page?: number = 20;

  @IsOptional()
  @IsString({ message: 'Tìm kiếm phải là chuỗi' })
  q?: string = '';

  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi' })
  @IsIn(ALLOWED_SORT_FIELDS, {
    message: `Trường sắp xếp chỉ được là một trong các giá trị: ${ALLOWED_SORT_FIELDS.join(', ')}`,
  })
  sort_field?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'Thứ tự sắp xếp chỉ có thể là "asc" hoặc "desc"',
  })
  sort_order?: 'asc' | 'desc';
}
