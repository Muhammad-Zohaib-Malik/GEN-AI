import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { initChatModel } from "langchain";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const loader = new PDFLoader("iqra_book.pdf");
const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splitDocs = await textSplitter.splitDocuments(docs);

const template = ChatPromptTemplate.fromMessages([
  ["system", "You are an AI that summarizes the text."],
  ["human", "{docs}"],
]);

const model = await initChatModel("google-genai:gemini-3.6-flash", {
  apiKey: process.env.GEMINI_API_KEY,
});

console.log(`Loaded ${docs.length} document(s).`);
console.log(`Split into ${splitDocs.length} chunk(s).`);
console.log("First chunk content:", splitDocs[0].pageContent);

// Combine chunks into a single string to pass to the prompt
const docsContent = splitDocs.map(doc => doc.pageContent).join("\n\n---\n\n");

const prompt = await template.formatMessages({
  docs: docsContent,
});

const response = await model.invoke(prompt);

console.log("\n--- AI Summary ---");
console.log(response.content);
