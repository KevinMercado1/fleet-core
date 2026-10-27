import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './auth.dto.js';

export class UpdateAuthDto extends PartialType(RegisterDto) {}
