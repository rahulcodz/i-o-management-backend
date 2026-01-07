import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('file')
    @ApiOperation({ summary: 'Upload a file (max 5MB)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload (max 5MB)',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        originalName: { type: 'string' },
                        filename: { type: 'string' },
                        path: { type: 'string' },
                        size: { type: 'number' },
                        sizeInMB: { type: 'number' },
                        mimetype: { type: 'string' },
                        encoding: { type: 'string' },
                        uploadedAt: { type: 'string' },
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Bad request - No file or file too large' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const metadata = this.uploadService.getFileMetadata(file);

        return {
            success: true,
            message: 'File uploaded successfully',
            data: metadata,
        };
    }
}
