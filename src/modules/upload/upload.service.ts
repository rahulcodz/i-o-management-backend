import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class UploadService {
    private readonly uploadPath = 'uploads';

    getFileMetadata(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const filePath = `${this.uploadPath}/${file.filename}`;
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        return {
            originalName: file.originalname,
            filename: file.filename,
            path: filePath,
            size: file.size,
            sizeInMB: parseFloat(fileSizeInMB),
            mimetype: file.mimetype,
            encoding: file.encoding,
            uploadedAt: new Date().toISOString(),
        };
    }
}
