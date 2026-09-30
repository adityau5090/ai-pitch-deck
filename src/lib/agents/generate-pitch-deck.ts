import { InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered, run } from "@openai/agents";
import { pitchDeckAgent } from "./pitch-deck-agent";
import { PitchDeck, PitchDeckSchema } from "../schemas/pitch-deck";
import { err } from "inngest/types";
import { output } from "zod";

export class PitchDeckGenerationError extends Error {
    readonly reason?: string;

    constructor(message: string, reason?: string){
        super(message);
        this.name = "PitchDeckGenerationError";
        this.reason = reason;
    }
}

function isGuardrailError(error: unknown): boolean {
    return (
        error instanceof InputGuardrailTripwireTriggered ||
        error instanceof OutputGuardrailTripwireTriggered
    );
}

function getGuardrailReason (error: unknown): string {
    if(
        error instanceof InputGuardrailTripwireTriggered ||
        error instanceof OutputGuardrailTripwireTriggered
    ) {
        const info = error.result.output.outputInfo as {reason?: string } | undefined;
        return info?.reason ?? "Pitch deck generation was blocked by a guardrail."
    }

    return "Pitch deck generation was blocked by a guardrail."
}

function parseAgentOutput(rawOutput: unknown): PitchDeck{
    return PitchDeckSchema.parse(rawOutput)
}

export async function generatePitchDeck(idea: string): Promise<PitchDeck> {
    const trimmedIdea = idea.trim();

    try{
        const agentResult = await run(pitchDeckAgent, trimmedIdea);

        return parseAgentOutput(agentResult.finalOutput);

    }catch(error){
        if(isGuardrailError(error)){
            const reason = getGuardrailReason(error);
            
            throw new PitchDeckGenerationError(reason, reason);
        }

        return error as unknown as PitchDeck
    }


}