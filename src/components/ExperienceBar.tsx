import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import style from '../styles/components/ExperienceBar.module.css';

export function ExperienceBar(){
    const { currenteExperience, experienceToNextLevel } = useContext(ChallengesContext);

    const percentToNextLevel = Math.round(currenteExperience * 100) / experienceToNextLevel;

    return(
        <header className={style.experienceBar}>
          <span>0 xp</span>  
          <div>
            <div style={{ width: `${percentToNextLevel}%` }} />

            <span className={style.currentExperience} style={{ left: `${percentToNextLevel}%` }} >
              {currenteExperience} xp
            </span>      
          </div>                           
          <span>{experienceToNextLevel} xp</span>  
        </header>
    );
}