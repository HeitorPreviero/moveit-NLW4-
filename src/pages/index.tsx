import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from '../contexts/CountdownContext';

import styles from '../styles/pages/Home.module.css';
import { ChallengesProvider } from '../contexts/ChallengesContext';

interface HomeProps{
  level: number;
  currenteExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  return (    
    <ChallengesProvider
      level={props.level}
      currenteExperience={props.currenteExperience}
      challengesCompleted={props.challengesCompleted}
    >
        <div className= {styles.container}>

          <Head>
            <title>Inicio | move.it</title> 
          </Head>  

          <ExperienceBar />
          
          <CountdownProvider>
            <section>
              <div>
                <Profile />
                <CompletedChallenges />
                <Countdown />
              </div>
              <div>
                <ChallengeBox />
              </div>
            </section>
          </CountdownProvider>
        </div>
    </ChallengesProvider>          
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>{
  const { level, currenteExperience, challengesCompleted } = ctx.req.cookies;

  return{
    props: {
      level: Number(level),
      currenteExperience: Number(currenteExperience),
      challengesCompleted: Number(challengesCompleted)
    } 
  }
}
