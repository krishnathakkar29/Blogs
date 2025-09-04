import { v4 as uuidv4 } from "uuid";
import { BUCKET_NAME } from "../constant";
import { createSupabaseClient } from "./client";

type UploadProps = {
  file: File;
};

type UploadResponse = {
  data: {
    fileName: string;
    url: string;
  } | null;
  error: string | null;
};

function getStorage() {
  const { storage } = createSupabaseClient();
  return storage;
}

export async function uploadFile({
  file,
}: UploadProps): Promise<UploadResponse> {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${uuidv4()}.${fileExtension}`;
  const bucketName = BUCKET_NAME ?? "uploads";
  try {
    const storage = getStorage();
    const { data, error } = await storage.from(bucketName).upload(path, file);

    if (error) {
      return {
        data: null,
        error: error.message || "Image upload failed",
      };
    }

    const imageUrl = `${process.env
      .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucketName}/${
      data?.path
    }`;

    return {
      data: {
        fileName: file.name,
        url: imageUrl,
      },
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: (error as Error).message || "Image upload failed",
    };
  }
}

export async function downloadFile() {
  const storage = getStorage();
  try {
    const { data, error } = await storage
      .from("email-resume")
      .download("attachments/0a1ec39a-9cdf-48c2-b495-80fc6380db54.pdf");

    if (error) {
      return { data: null, error: "File download failed" };
    }

    // Convert Blob to Buffer if needed
    if (data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return { data: buffer, error: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Download error:", error);
    return { data: null, error: "Failed to download file" };
  }
}
