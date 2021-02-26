import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

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
    completedChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps{
    children: ReactNode;
    level: number;
    currenteExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext  = createContext({} as ChallengesContextDate);

export function ChallengesProvider({
  children,
  ...rest
}: ChallengesProviderProps){
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currenteExperience, setCurrenteExperience] = useState(rest.currenteExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLeveUpModalOpen, setIsLeveUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
      Notification.requestPermission();
    },[])

    useEffect(() => {
      Cookies.set('level', String(level));
      Cookies.set('currenteExperience', String(currenteExperience));
      Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currenteExperience, challengesCompleted]);

    function levelup(){
        setLevel(level + 1);
        setIsLeveUpModalOpen(true);
    }

    function closeLevelUpModal(){
       setIsLeveUpModalOpen(false);
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
                closeLevelUpModal,
            }}
        >
          {children}

          {isLeveUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>  
      ) 

}