import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import { NearContext } from '../context/NearContext'
import styles from '../styles/Home.module.css'
import Router from 'next/router'
import { Role, roleOptions } from '../assembly/model'
import Link from 'next/link'

const Home: NextPage = () => {
  const { contract, currentUser, nearConfig, wallet, setCurrentUser } = useContext(NearContext)

  const signIn = () => {
    if (!wallet || !nearConfig || !contract) {
      console.error('No wallet')
      return
    }

    wallet.requestSignIn(
      {contractId: nearConfig.contractName, methodNames: [contract.setContentType.name]}, //contract requesting access
      'NEAR CMS', //optional name
      undefined, //optional URL to redirect to if the sign in was successful
      undefined //optional URL to redirect to if the sign in was NOT successful
    )
  }

  const signOut = () => {
    if (!wallet) {
      console.error('No wallet')
      return
    }

    wallet.signOut()
    Router.push('/')
    setCurrentUser(undefined)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>d CMS</title>
        <meta name="description" content="A Near Protocol Content Management System." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        {currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }

        {currentUser &&
          <p>{currentUser.username} {roleOptions[currentUser.role].value}</p>
        }

        <Link href="/users/manage">
          <a>Manage Users</a>
        </Link>

        { !currentUser && <p>Not logged in</p> }

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
