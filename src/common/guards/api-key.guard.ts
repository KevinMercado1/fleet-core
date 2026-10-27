import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing'); // Check if the API key is present in the request headers
    }

    const validApiKeys = process.env.API_KEYS
      ? process.env.API_KEYS.split(',') // Split the API keys by comma if they are provided in the environment variable
      : [];

    if (!validApiKeys.includes(apiKey as string)) {
      // Check if the provided API key is valid
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
