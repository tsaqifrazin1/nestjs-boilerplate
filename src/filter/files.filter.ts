import { BadRequestException } from '@nestjs/common';

export const fileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|JPG|JPEG|PNG|pdf|PDF|image)$/)) {
    return callback(
      new BadRequestException({
        status: 'error',
        message: 'Only image files or pdf are allowed!',
      }),
      false,
    );
  }
  callback(null, true);
};
