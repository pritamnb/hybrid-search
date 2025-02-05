import ollama from 'ollama';

/**
 * Generates a vector embedding for a given text using the Ollama model.
 * @param text - The input text to embed.
 * @returns A Promise that resolves to a stringified array of numbers.
 */
export const generateEmbedding = async (text: string): Promise<string> => {
    try {

        const response: any = await ollama.embed({
            model: 'snowflake-arctic-embed',
            input: text,
        });


        if (!response || !response.embeddings || !response.embeddings[0]) {
            throw new Error('Invalid embedding response from Ollama');
        }

        const embedding = response.embeddings[0];

        // stringify to add it in req format in db
        const embeddingString = JSON.stringify(embedding);

        return embeddingString;
    } catch (error) {
        console.error('Embedding error:', error);
        return '[]';
    }
};
