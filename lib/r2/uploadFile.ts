import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2-client";

export async function uploadFile(file: File, folder: string) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key = `${folder}/${file.name}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: "lesson-map",
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return key;
  } catch (error) {
    console.log("Error uploading file:", error);
  }
}
