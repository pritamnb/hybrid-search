import ollama from 'ollama';

export const EMBEDDING_MODEL = 'snowflake-arctic-embed';

/**
 * Generates a vector embedding for a given text using the Ollama model.
 * Throws if the model is unavailable or returns no embedding, so callers fail loudly
 * instead of querying the database with an empty vector.
 * @param text - The input text to embed.
 * @returns The embedding as an array of numbers.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    let response: { embeddings?: number[][] };
    try {
        response = await ollama.embed({ model: EMBEDDING_MODEL, input: text });
    } catch (error) {
        console.error('Embedding request failed:', error);
        throw new Error(`Could not generate an embedding with "${EMBEDDING_MODEL}". Is Ollama running?`);
    }

    const embedding = response?.embeddings?.[0];
    if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error('Invalid embedding response from Ollama');
    }
    return embedding;
};
