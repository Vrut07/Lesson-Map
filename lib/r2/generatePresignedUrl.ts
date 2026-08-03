import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "./r2-client";

const DEFAULT_R2_BUCKET_NAME = "lesson-map";

function getR2BucketName() {
  return process.env.CF_R2_BUCKET_NAME || DEFAULT_R2_BUCKET_NAME;
}

export async function generatePresignedUrl(
  filename: string,
  contentType: string,
  folder: string,
) {
  const uniqueName = `${Date.now()}-${filename}`;

  const key = `${folder}/${uniqueName}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      ContentType: contentType,
    }),
    {
      expiresIn: 60 * 5,
    },
  );

  return {
    uploadUrl,
    key,
  };
}
