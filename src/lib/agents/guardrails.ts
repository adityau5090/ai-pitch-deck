import { Agent, run, type InputGuardrail, type OutputGuardrail } from "@openai/agents";
import { z } from "zod"

function getInputText(input: string | unknown[]): string {
    if(typeof input == "string"){
        return input;
    }
    return JSON.stringify(input);
}

export const validProjectIdeaGuardrail: InputGuardrail = {
    name: "valid_project_idea",
    execute: async ({ input }) => {
        const text = getInputText(input).trim();
        const tooShort = text.length < 20;

        return {
            tripwireTriggered: tooShort,
            outputInfo: tooShort
                ? { reason : "Project idea is too short. It must be atleast 20 characters"}
                : undefined,  
        }
    }
}

const QualityCheckSchema = z.object({
    isValid: z.boolean(),
    reason: z.string().optional(),
})

const qualityChekerAgent = new Agent({
    name: "PitchDeckQualityCheckerAgent",
    model: "gpt-4.1-mini",
    instructions: `You review pitch deck JSON for a beginner learning app.
    Return isValid: false, if any of these are true:
    - Profanity, hate speech or voilent content
    - Placeholder text like "TBD", "lorem ipsum", "[insert here]", "coming soon"
    - Slides with empty meaningless filler content
    - content that is clearly not a buisness pitch deck

    otherwise return isValid: true.
    If invalid explain why in the reason field.
    `,
    outputType: QualityCheckSchema as any,
})

export const pitchDeckQualityGuardrail: OutputGuardrail = {
    name: "pitch_deck_quality",
    execute: async ({ agentOutput }) => {
        const deckJson = JSON.stringify(agentOutput, null, 2);
        const checkResult = await run(qualityChekerAgent, deckJson);
        const check = QualityCheckSchema.parse(checkResult.finalOutput as unknown);
        const isValid = check.isValid;

        return {
            tripwireTriggered: !isValid,
            outputInfo: isValid ? undefined : { reason : check.reason ?? "Deck failed at quality check"}  
        }
    }
}