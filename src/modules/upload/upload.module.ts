import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

const uploadPath = 'uploads';

// Ensure uploads directory exists
if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
}

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const ext = extname(file.originalname);
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const name = file.originalname.replace(ext, '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    cb(null, `${name}-${uniqueSuffix}${ext}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule { }
