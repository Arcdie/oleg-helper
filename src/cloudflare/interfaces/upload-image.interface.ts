export interface IUploadImageResponse {
  success: boolean;
  errors: [];
  messages: [];

  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
}
