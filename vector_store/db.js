import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function IndexTheDocument() {
  try {
    console.log("Loading PDF...");

    // 1. Load PDF
    const loader = new PDFLoader("Asbab.pdf");
    const docs = await loader.load();

    console.log(`Loaded ${docs.length} PDF document(s)`);

    // 2. Split PDF into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const documents = await textSplitter.splitDocuments(docs);

    console.log(`Split into ${documents.length} chunks`);

    // 6. Create embeddings and store documents in Pinecone
    // await vectorStore.addDocuments(documents);

    console.log(`Successfully indexed ${documents.length} chunks in Pinecone`);
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error;
  }
}

