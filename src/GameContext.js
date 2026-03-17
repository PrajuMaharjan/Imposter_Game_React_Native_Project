import { createContext,useContext,useState } from "react";

const GameContext=createContext();

export function GameProvider({children}){
    const [gameState,setGameState]=useState({
    players:4,
    imposters:1,
    gameMode:'Word',
    genre:[],
    playerNames:[],
    hintsForImposter:true,
    showGenreToImposter:true,
    noImposterMode:false,
    music: true,
    sound: true,
    haptics: true,
    shakeForNext: false,
});

return(
    <GameContext.Provider value={{gameState,setGameState}}>
        {children}
    </GameContext.Provider>
    );
}

export function useGame(){
    return useContext(GameContext);
}