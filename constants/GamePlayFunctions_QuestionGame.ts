import {collection,getDocs} from "firebase/firestore";
import {db} from "../store/firebase";
import localQuestionData from '../assets/Datasets/QuestionData.json';

export type QuestionEntry={
    id?:string | number;
    category:string;
    question:string;
};

export type QuestionFetchResult={
    questions:QuestionEntry[];
    source:'remote' | "local";
};

export type QuestionGenreCounts=Record<string,number>;

export type QuestionCountsFetchResult={
    counts:QuestionGenreCounts;
    source:'remote' | "local";
};

export const CATEGORY_LABELS:Record<string,string>={
    general: 'General',
};

const LOCAL_COUNTS:QuestionGenreCounts=Object.fromEntries(
    Object.keys(CATEGORY_LABELS).map(key => [key,10])
);

// Builds a question pair from the same category so that not even the imposter does not know until the real question is revealed
function buildPairs(entries:QuestionEntry[]):QuestionEntry[][]{
    const byCategory:Record<string,QuestionEntry[]>={};
    entries.forEach(e=>{
        if(!byCategory[e.category]) byCategory[e.category]=[];
        byCategory[e.category].push(e);
    });

    const pairs:QuestionEntry[][]=[];
    Object.values(byCategory).forEach(catEntries=>{
        const shuffled=[...catEntries].sort(()=>Math.random()-0.5);
        for(let i=0;i+1<shuffled.length;i+=2){
            pairs.push([shuffled[i],shuffled[i+1]]);
        }
    });

    return pairs;
}

export async function fetchQuestionBatch(selectedGenres:string[],pairCount:number=5):Promise<QuestionFetchResult>{
    try{
        const snapshot=await getDocs(collection(db,"questions"));

        if(snapshot.empty) throw new Error("No data in Firestore.");

        const allQuestions:QuestionEntry[]=snapshot.docs.map(doc=>({
            id:doc.id,
            ...(doc.data() as Omit<QuestionEntry,'id'>)}))
            .filter(q=>selectedGenres.includes(q.category));

        if(allQuestions.length===0) throw new Error("No questions matching selected genres");

        const allPairs=buildPairs(allQuestions);
        if(allPairs.length==0) throw new Error("No valid question pairs for selected genres.");

        const shuffledPairs=[...allPairs].sort(()=>Math.random()-0.5);
        const selectedPairs=shuffledPairs.slice(0,Math.min(pairCount,shuffledPairs.length));
        const questions=selectedPairs.flat();

        return {questions,source:'remote'};
    } catch(e){
        console.warn("Firestore fetch failed,using local data : ",e);
        const allLocal=localQuestionData.filter(q=>selectedGenres.includes(q.category));
        const localPairs=buildPairs(allLocal);
        const shuffledPairs=[...localPairs].sort(()=>Math.random()-0.5);
        const selectedPairs=shuffledPairs.slice(0,Math.min(pairCount,shuffledPairs.length));
        const questions=selectedPairs.flat();
        return {questions,source:'local'};
    }
}

export async function fetchGenreCounts():Promise<QuestionCountsFetchResult>{
    try{
        const snapshot=await getDocs(collection(db,"question_counts"));

        if(snapshot.empty) throw new Error("No counts in Firestore.");

        const counts:QuestionGenreCounts={};
        snapshot.docs.forEach(doc=>{
            const data=doc.data();
            counts[data.category]=data.count;
        });

        return {counts,source:'remote'};
    }
    catch(e){
        console.warn("Failed to fetch question genre counts,using local data : ",e);
        return {counts:LOCAL_COUNTS,source:'local'};
    }
}

// Pops 2 questions from the list extracted from the server
export function popQuestionsFromQueue(queue:QuestionEntry[],noImposterMode:boolean=false) : {questions:QuestionEntry[]; remaining:QuestionEntry[]}{
    if(queue.length===0) return {questions:[],remaining:[]};

    const popCount=noImposterMode ? 1 : 2;
    const questions=queue.slice(0,popCount);
    const remaining = queue.slice(popCount);
    
    return {questions,remaining};
}

export function getCategoryLabel(categoryId:string):string{
    return CATEGORY_LABELS[categoryId] ?? categoryId;
}

// Used by GenreSelectScreen
export function getQuestionCountByGenre(categoryId : string):number{
    return localQuestionData.filter(q=>q.category === categoryId).length;
}