import { TokenTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("1785558779292.pdf");
const docs = await loader.load();


const splitter = new TokenTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });

const chunks=await splitter.splitDocuments(docs);

console.log(chunks[0].pageContent)
