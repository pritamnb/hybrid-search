import ollama from 'ollama';

/**
 * Generates a vector embedding for a given text using the Ollama model.
 * @param text - The input text to embed.
 * @returns A Promise that resolves to an array of numbers representing the embedding vector.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        const response: any = await ollama.embed({
            model: 'snowflake-arctic-embed', // Specify the embedding model
            input: text,
        });

        // Extract the embedding vector from the response
        const embedding = response.embeddings[0]?.embedding;
        return embedding;
    } catch (error) {
        console.error('Embedding error:', error);
        throw new Error('Failed to generate embedding');
    }
};
