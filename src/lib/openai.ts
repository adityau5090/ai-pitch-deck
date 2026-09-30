import OpenAI from "openai"

const imageModel = "gpt-image-1-mini";
const imageSize = "1024*1024";

let openAIClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if(!apiKey){
        throw new Error("OPENAI_API_KEY is missing")
    }

    if(!openAIClient){
        openAIClient = new OpenAI({ apiKey });  
    }

    return openAIClient; 
}