# Media Storage Architecture

## 1. Storage Provider Abstraction
To ensure media assets (lookbook photography, runway videos, course PDFs, cutting patterns) can be transitioned from local storage to S3, Cloudflare R2, or Google Cloud Storage, the platform implements a `MediaStorageProvider`:

```typescript
export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

export interface MediaStorageProvider {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<MediaAsset>;
  deleteFile(assetId: string): Promise<boolean>;
  getPublicUrl(assetId: string): string;
}
```

## 2. Default Asset Pipeline
- Provides curated high-definition atelier vector assets, lookbooks, and fashion diagrams with zero dependence on fragile third-party CDNs.
- Supports direct file uploads with client and server MIME-type validation.
