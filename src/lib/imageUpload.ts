export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 5;

export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".tif",
] as const;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
] as const;

export const ALLOWED_IMAGE_LABEL = "JPG, PNG, GIF, WebP, BMP, TIFF";

export const IMAGE_ACCEPT_ATTRIBUTE = ALLOWED_IMAGE_EXTENSIONS.join(",");

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const extensionAllowed = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(extension);

    if (!extensionAllowed) {
      return `Unsupported image format. Allowed formats: ${ALLOWED_IMAGE_LABEL}.`;
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  return null;
};

export const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong"
): string => {
  const data = (
    err as {
      response?: {
        data?: {
          message?: string;
          errors?: Array<{ field?: string; message: string }>;
        };
      };
    }
  )?.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((error) => error.message).join(", ");
  }

  return data?.message || fallback;
};
