import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { CharacterTextSplitter } from "@langchain/textsplitters";


const splitter=new CharacterTextSplitter({
    separator: "\n\n",
    chunkSize:10,
    chunkOverlap:1,

})

const loader = new TextLoader("./sample.txt");
const docs = await loader.load();

const chunks=await splitter.splitDocuments(docs);

console.log(chunks.length)


for(let i of chunks) console.log(i.pageContent);

