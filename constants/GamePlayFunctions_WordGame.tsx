import wordData from '../assets/Datasets/WordData.json';

export type WordEntry={
    id:number;
    word:string;
    category:string;
    hints:string;
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


let _wordData : WordEntry[] | null=null;

export async function loadWordData():Promise<WordEntry[]>{
    if (_wordData) return _wordData;

    _wordData=wordData as WordEntry[];
    return _wordData;
}

export async function getWordsByGenre(selectedGenres:string[]):Promise<WordEntry[]>{
    const data=await loadWordData();
    return data.filter(w=>selectedGenres.includes(w.category));    
}

export async function getRandomWord(selectedGenres:string[]):Promise<WordEntry | undefined>{
    const wordpool=await getWordsByGenre(selectedGenres);
    if (wordpool.length==0) return undefined;
    return wordpool[Math.floor(Math.random()*wordpool.length)];
}

export function getRandomHint(hintsString:string):string {
    const hints=hintsString.split("|");
    return hints[Math.floor(Math.random()*hints.length)];
}

export function getCategoryLabel(categoryId:string):string{
    return CATEGORY_LABELS[categoryId] ?? categoryId;
}