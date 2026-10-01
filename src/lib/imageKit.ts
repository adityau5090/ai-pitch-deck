import ImageKit, { toFile } from "@imagekit/nodejs"

let imagekitClient: ImageKit | null = null;

function getImageKit():  ImageKit {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if(!privateKey){
        throw new Error("IMAGEKIT_PRIVATE_KEY is not set")
    }

    imagekitClient ??= new ImageKit({ privateKey })
    
    return imagekitClient; 
}

export async function uploadSlideImage(buffer: Buffer, fileName: string): Promise<string> {
    const client = getImageKit();

    const response = await client.files.upload({
        file: await toFile(buffer, fileName),
        fileName,
        folder: "/pitch-decks-build"
    })

    if(!response.url){
        throw new Error("Failed to upload single slide")
    }

    return response.url as string;
}