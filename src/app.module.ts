import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { VehiclesModule } from './modules/vehiculos/vehiculos.module.js';
import { MechanicsModule } from './modules/mecanicos/mecanicos.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { WorkshopsModule } from './modules/workshops/workshops.module.js';
import { MaintenancesModule } from './modules/maintenances/maintenances.module.js';
import { SeedModule } from './modules/seed/seed.module.js';

@Module({
  imports: [
    // Load environment variables globally across the application
    ConfigModule.forRoot({ isGlobal: true }),

    // Asynchronously configure TypeORM using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        // Fixed from DB_USERNAME to DB_USER to match your .env file
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // synchronize: true is fine for development, but consider migrations for production
        synchronize: true,
      }),
    }),

    // Feature modules
    VehiclesModule,
    MechanicsModule,
    UsersModule,
    AuthModule,
    WorkshopsModule,
    MaintenancesModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
