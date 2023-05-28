import { v2 } from "cloudinary";

const { 
  CLOUDNAME,
  API_KEY,
  API_SECRET
} = process.env;

v2.config({
  cloud_name: CLOUDNAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

export default v2;