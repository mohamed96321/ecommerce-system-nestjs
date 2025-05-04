import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.name'),
      api_key: this.configService.get('cloudinary.key'),
      api_secret: this.configService.get('cloudinary.secret'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Only image files are allowed');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'products' },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      uploadStream.end(file.buffer);
    });
  }
}
