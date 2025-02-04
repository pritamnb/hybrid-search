import ollama from 'ollama';

/**
 * Generates a vector embedding for a given text using the Ollama model.
 * @param text - The input text to embed.
 * @returns A Promise that resolves to a stringified array of numbers.
 */
export const generateEmbedding = async (text: string): Promise<string> => {
    try {
        console.log("\n\ntext :: ", text);

        const response: any = await ollama.embed({
            model: 'snowflake-arctic-embed', // Ensure this model is available
            input: text, // Some models use `prompt` instead of `input`
        });

        console.log('Embedding API Response:', response); // Log the full response for debugging

        if (!response || !response.embeddings || !response.embeddings[0]) {
            throw new Error('Invalid embedding response from Ollama');
        }

        const embedding = response.embeddings[0];

        // Convert embedding array to a JSON string for storage
        const embeddingString = JSON.stringify(embedding);

        console.log("Embedding (stringified):", embeddingString);
        return embeddingString;
    } catch (error) {
        console.error('Embedding error:', error);
        return '[]'; // Return an empty JSON array string instead of throwing an error
    }
};
