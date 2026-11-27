import {collection,getDocs} from "firebase/firestore";
import {db} from "../store/firebase";
import localWordData from '../assets/Datasets/WordData.json';

export type WordEntry={
    id?:string | number;
    word:string;
    category:string;
    hints:string | string[];
};

export type FetchResult={
    words:WordEntry[];
    source:'remote' | "local";
};

export type GenreCounts=Record<string,number>;

export type CountsFetchResult={
    counts:GenreCounts;
    source:'remote' | "local";
};

export const CATEGORY_LABELS:Record<string,string>={
    animals: 'Animals',
    fruit:'Fruit',
    food:'Food',
    objects:'Objects',
    famous_people:'Famous People',
    cities:'Cities',
    countries:'Countries',
    health:'Health',
    brands:'Brands',
    games:'Games',
    movies:'Movies',
    sports:'Sports',
    professions:'Professions',
    abstract:'Abstract',
};

const LOCAL_COUNTS:GenreCounts=Object.fromEntries(
    Object.keys(CATEGORY_LABELS).map(key => [key,10])
);

export async function fetchWordBatch(selectedGenres:string[],count:number=5):Promise<FetchResult>{
    try{
        const snapshot=await getDocs(collection(db,"words"));

        if(snapshot.empty) throw new Error("No data in Firestore.");

        const allWords:WordEntry[]=snapshot.docs.map(doc=>({
            id:doc.id,
            ...(doc.data() as Omit<WordEntry,'id'>)}))
            .filter(w=>selectedGenres.includes(w.category));

        if(allWords.length===0) throw new Error("No words matching selected genres");

        const shuffled=[...allWords].sort(()=>Math.random()-0.5);
        const words=shuffled.slice(0,Math.min(count,shuffled.length));

        return {words,source:'remote'};
    }
    catch(e){
        console.warn("Firestore fetch failed,using local data : ",e);
        const allLocal=(localWordData as unknown as WordEntry[]).filter(w=>selectedGenres.includes(w.category));
        const shuffled=[...allLocal].sort(()=>Math.random()-0.5);
        const words=shuffled.slice(0,Math.min(count,shuffled.length));
        return {words,source:'local'};
    }
}

export async function fetchGenreCounts():Promise<CountsFetchResult>{
    try{
        const snapshot=await getDocs(collection(db,"counts"));

        if(snapshot.empty) throw new Error("No counts in Firestore.");

        const counts:GenreCounts={};
        snapshot.docs.forEach(doc=>{
            const data=doc.data();
            counts[data.category]=data.count;
        });

        return {counts,source:'remote'};
    }
    catch(e){
        console.warn("Failed to fetch genre counts,using local data : ",e);
        return {counts:LOCAL_COUNTS,source:'local'};
    }
}

export function popWordFromQueue(queue:WordEntry[]) : {word:WordEntry | undefined; remaining:WordEntry[]}{
    if(queue.length===0) return {word:undefined,remaining:[]};
    const [word,...remaining]=queue;
    return {word,remaining};
}

export function getRandomHint(hints:string | string[]):string {
    const hintArray=Array.isArray(hints) ? hints : hints.split("|");
    return hintArray[Math.floor(Math.random()*hintArray.length)];
}

export function getCategoryLabel(categoryId:string):string{
    return CATEGORY_LABELS[categoryId] ?? categoryId;
}

// Used by GenreSelectScreen
export function getWordCountByGenre(categoryId : string):number{
    return (localWordData as unknown as WordEntry[]).filter(w=>w.category === categoryId).length;
}