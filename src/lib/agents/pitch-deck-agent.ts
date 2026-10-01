import { PitchDeckSchema } from "../schemas/pitch-deck";
import { Agent } from "@openai/agents"
import { pitchDeckQualityGuardrail, validProjectIdeaGuardrail } from "./guardrails";

const PITCH_DECK_INSTRUCTIONS = `You are a helpful AI assistant you help in write startup pitch deck for for investors.

You would given a project idea and you have to make 6-7 slides of that idea in a specific order.
SLIDES_ORDER -
1. Title - Acatchy deck title + a good and energetic tagline in content
2. Problem - The pain point your audience faces, point all of that
3. Solution - How this product is going to solve that problem
4. Market - target customers and market opportunities
5. Product - 3-4 key features as a bullet point about our product
6. Buisness Model - how company is going to make money
7. The Ask - funding amount or support needed (use a realistic placeholder)

Field rules:
- content: 2-4 bullet pointsas plain text, each starting with small filled circle
- imagePrompt: a short description for a professional slide illustration (clean and modern image, if needed use doodle style text)
- keep language clear, easy, confident and investor-friendly
- Do not use placeholder filler like "TBD" or "lorem ipsum"
`
 
export const pitchDeckAgent = new Agent({
    name: "PitchDeckGenerator",
    model: "gpt-4.1-mini",
    instructions: PITCH_DECK_INSTRUCTIONS,
    outputType: PitchDeckSchema as any,

    inputGuardrails: [validProjectIdeaGuardrail],
    outputGuardrails: [pitchDeckQualityGuardrail],
})