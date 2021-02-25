import { createContext, useState, ReactNode, useEffect } from 'react'
import challenges from '../../challenges.json'

interface Challenge{
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextDate{
    level: number; 
    currenteExperience: number; 
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge; 
    levelup: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completedChallenge:() => void;
}

interface ChallengesProviderProps{
    children: ReactNode
}

export const ChallengesContext  = createContext({} as ChallengesContextDate);

export function ChallengesProvider({children}: ChallengesProviderProps){
    const [level, setLevel] = useState(1);
    const [currenteExperience, setCurrenteExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
      Notification.requestPermission();
    },[])

    function levelup(){
        setLevel(level + 1);
    }

    function startNewChallenge(){
       const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
       const challenge = challenges[randomChallengeIndex]

       setActiveChallenge(challenge)

       new Audio('/notification.mp3').play(); 

       if (Notification.permission === 'granted'){
         new Notification('Novo desafio', {
           body: `Valendo ${challenge.amount} xp!`
         })
       } 
    }

    function resetChallenge(){
      setActiveChallenge(null);
    }

    function completedChallenge(){
      if (!activeChallenge) {
         return; 
      }  

      const { amount } = activeChallenge;

      let finalExperience = currenteExperience + amount;

      if(finalExperience >= experienceToNextLevel){
         finalExperience = finalExperience - experienceToNextLevel;
         levelup(); 
      }

      setCurrenteExperience(finalExperience);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
            value={{ 
                level, 
                currenteExperience,
                experienceToNextLevel, 
                challengesCompleted, 
                levelup,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completedChallenge,
            }}
        >
          {children}
        </ChallengesContext.Provider>  
      ) 

}