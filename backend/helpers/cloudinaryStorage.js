class CloudinaryStorage {
  constructor({ cloudinary, cloudinaryOptions }) {
    this.cloudinary = cloudinary;
    this.cloudinaryOptions = cloudinaryOptions;
  }

  upload(file) {
    console.log(file);
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        this.cloudinaryOptions,
        (err, response) => {
          if (response) {
            return resolve(response);
          }
          if (err) {
            return reject(err);
          }
        }
      );
      file.stream.pipe(uploadStream);
    });
  }

  async _handleFile(req, file, cb) {
    try {
      const response = await this.upload(file);
      cb(null, {
        secure_url:response.secure_url,
        //these properties are merged with the multer's file object.
      });
    } catch (err) {
      cb(err, null);
    }
  }

  _removeFile(req, file, cb) {
    console.log('Removing file..')
    this.cloudinary.uploader.destroy(file.filename, { invalidate: true }, cb);
  }
}

module.exports = CloudinaryStorage;
