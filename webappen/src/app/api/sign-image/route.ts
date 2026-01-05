import {cloudinary} from "@/lib/cloudinary";

export async function POST(request: Request) {
    const body = (await request.json()) as {paramsToSign: Record<string, string>} ;
    
    const signature = cloudinary.v2.utils.api_sign_request(body.paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
    
    return Response.json({signature});
}