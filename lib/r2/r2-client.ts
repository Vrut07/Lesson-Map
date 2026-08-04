import {
  S3Client,
} from "@aws-sdk/client-s3";

const r2UrlEndpoint = process.env.CF_R2_URL!;
const r2AccessKeyId = process.env.CF_R2_ACCESS_KEY_ID!;
const r2SecretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY!;

if (!r2UrlEndpoint || !r2AccessKeyId || !r2SecretAccessKey) {
  throw new Error("Cloudflare R2 credentials are not configured");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: r2UrlEndpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});
