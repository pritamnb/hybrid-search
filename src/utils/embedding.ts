import * as use from '@tensorflow-models/universal-sentence-encoder';

let model: use.UniversalSentenceEncoder | null = null;

/**
 * Loads the Universal Sentence Encoder model once (singleton pattern).
 */
const loadModel = async () => {
    if (!model) {
        console.log("Loading TensorFlow.js model...");
        model = await use.load();
        console.log("Model loaded successfully!");
    }
};

/**
 * Generates a vector embedding for a given text using the Universal Sentence Encoder.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        await loadModel();
        if (!model) throw new Error("Model failed to load.");

        const embeddings = await model.embed([text]);
        return Array.from(embeddings.dataSync()); // Convert tensor to a plain array
    } catch (error) {
        console.error('Embedding error:', error);
        throw new Error('Failed to generate embedding');
    }
};


/**
 * import * as tf from '@tensorflow/tfjs-node';


export const generateEmbedding = async (text: string): Promise<number[]> => {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json');
    
    // Tokenization & Vectorization (Mocking the real embedding process)
    const embedding = text.split(" ").map(word => word.length * 0.1); 

    return embedding.slice(0, 128); // Keep embedding vector fixed at 128 dimensions
};

 */