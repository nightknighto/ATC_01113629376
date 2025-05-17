import multer from 'multer';

export namespace MulterService {
    // Multer storage config: store in memory for direct upload to Azure
    const storage = multer.memoryStorage();

    // Accept only image files (png, jpg, jpeg)
    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    };

    export const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    });
}
