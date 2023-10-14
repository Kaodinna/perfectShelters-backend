import { Document } from "mongoose";

interface IBucketInterface {
    url: string;
    data: any;
}

export interface IBucket extends IBucketInterface, Document {}
