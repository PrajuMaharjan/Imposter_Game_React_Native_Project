import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext,useContext,useEffect,useState, ReactNode } from "react";

export type GameMode="Word" | "Question";

export type GameState={
    players:number;
    imposters:number;
    gameMode:GameMode;
    genre:string[];
    playerNames:string[];
    imposterNames:string[];
    hintsForImposter:boolean;
    showGenreToImposter:boolean;
    noImposterMode:boolean;
    music:boolean;
    sound:boolean;
    haptics:boolean;
    shakeForNext:boolean;
};

type GameContextType={
    gameState:GameState;
    setGameState:React.Dispatch<React.SetStateAction<GameState>>;
};

type GameProviderProps={
    children:ReactNode;
};

const DEFAULT_STATE:GameState={
    players:4,
    imposters:1,
    gameMode:'Word',
    genre:[],
    playerNames:[],
    imposterNames:[],
    hintsForImposter:true,
    showGenreToImposter:true,
    noImposterMode:false,
    music: true,
    sound: true,
    haptics: true,
    shakeForNext: false,
};

const GameContext=createContext<GameContextType>({
    gameState:DEFAULT_STATE,
    setGameState:()=>{},
});

export function GameProvider({children}:GameProviderProps){
    const [gameState,setGameState]=useState<GameState>(DEFAULT_STATE);

// Load settings on app start
    useEffect(()=>{
        async function loadSettings() {
        try{
            const saved=await AsyncStorage.getItem("settings");
            if(saved){
                const parsed=JSON.parse(saved);
                setGameState(prev=>({...prev,
                                    ...parsed,
                                    genre:Array.isArray(parsed.genre)? parsed.genre:[],
                                    playerNames:Array.isArray(parsed.playerNames) ? parsed.playerNames:[],
                                    imposterNames:[],
                }));
            }
        }catch(e){
            console.log("Failed to load settings : ",e);
        }
    }
    loadSettings();
    },[]);

    // Save settings when changed
    useEffect(()=>{
        async function saveSettings() {
        try{
            const toSave:Partial<GameState>={
                music:gameState.music,
                sound:gameState.sound,
                haptics:gameState.haptics,
                shakeForNext:gameState.shakeForNext,
                players:gameState.players,
                imposters:gameState.imposters,
                gameMode:gameState.gameMode,
                hintsForImposter:gameState.hintsForImposter,
                showGenreToImposter:gameState.showGenreToImposter,
                noImposterMode:gameState.noImposterMode,
                playerNames:gameState.playerNames,
                genre:gameState.genre,
            };
            await AsyncStorage.setItem('settings',JSON.stringify(toSave));
        }catch(e){
            console.log("Failed to save settings : ",e);
        }
    }
    saveSettings();
    },[
        gameState.music,
        gameState.sound,
        gameState.haptics,
        gameState.shakeForNext,
        gameState.players,
        gameState.imposters,
        gameState.gameMode,
        gameState.hintsForImposter,
        gameState.showGenreToImposter,
        gameState.noImposterMode,
        gameState.playerNames,
        gameState.genre]);

    return(
    <GameContext.Provider value={{gameState,setGameState}}>
        {children}
    </GameContext.Provider>
    );
}

export function useGame():GameContextType{
    return useContext(GameContext);
}