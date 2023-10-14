import axios from "axios";
import { Bucket } from "../model/bucket.model";
import { uploadToCloudinary } from "../helpers/cloud";
import { Response } from "../interface/ExpressTypes";
import { sendResponse } from "../helpers/response";

export class BucketController {
  async addToBucket(res: Response, files: any) {
    if (!files) {
      return sendResponse(res, 500, false, "No Files Uploaded!");
    }
    const buckets: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const { path, fieldname } = files[i];

      try {
        const upload = await uploadToCloudinary(path);
        const toBucket = await Bucket.create({
          data: upload,
          url: upload.secure_url,
        });

        buckets.push({
          bucket: toBucket,
          fieldname,
          id: toBucket._id.toString(),
        });
      } catch (error: any) {
        console.log(error);
        buckets.push({
          bucket: false,
          fieldname,
          error: error.message,
        });
        return sendResponse(
          res,
          500,
          false,
          "There was an error adding files added to Bucket",
          buckets
        );
      }
    }

    return sendResponse(res, 200, true, "Files added to Bucket", buckets);
  }

  async getBucket(res: Response, bucketId: string) {
    try {
      const bucket = await Bucket.findById(bucketId);

      if (bucket === null) {
        return sendResponse(res, 404, false, "Bucket Not Found!");
      }

      const { secure_url } = bucket.data;

      const { data } = await axios.get(secure_url, {
        responseType: "stream",
      });

      data.pipe(res);
    } catch (error) {
      console.log(error);
      return sendResponse(res, 404, false, "Error fetching bucket!");
    }
  }
}
