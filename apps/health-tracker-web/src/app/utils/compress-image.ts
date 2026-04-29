import imageCompression from 'browser-image-compression';

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_DIMENSION = 768;
const JPEG_QUALITY = 0.72;
const TARGET_MAX_SIZE_MB = 0.22;

export async function compressImage(file: File): Promise<File> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Ảnh vượt quá 20MB. Vui lòng chọn ảnh nhỏ hơn.');
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxWidthOrHeight: MAX_DIMENSION,
      initialQuality: JPEG_QUALITY,
      maxSizeMB: TARGET_MAX_SIZE_MB,
      useWebWorker: true,
      fileType: 'image/jpeg',
    });
    const normalizedName = file.name.replace(/\.[^.]+$/, '') || 'avatar';
    return new File([compressedFile], `${normalizedName}.jpg`, { type: 'image/jpeg' });
  } catch {
    throw new Error('Không thể nén ảnh đã chọn.');
  }
}
