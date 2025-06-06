"use server";
import { S3 } from "@aws-sdk/client-s3";

export const s3Upload = async (file: File) => {
  console.log("Uploading file to S3:", file);
  // Convert the Web File into a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Build a unique key (e.g., prefix + timestamp + original filename)
  const timestamp = Date.now();
  // Replace spaces in original filename with hyphens if needed
  const sanitizedFileName = file.name.replace(/ /g, "-");
  const fileKey = `nexora/${timestamp}-${sanitizedFileName}`;

  const s3 = new S3({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  if (!file) {
    throw new Error("No file provided");
  }

  //   const fileKey = `nexora/${Date.now()}-${file.name.replace(/ /g, "-")}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: file.type,
  };

  await s3.putObject(params);

  const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;
  return {
    fileKey,
    fileName: file.name,
    url: publicUrl,
  };
};
