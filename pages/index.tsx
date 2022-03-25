import { useContext } from 'react'
import type { NextPage } from 'next'
import { NearContext } from '../context/NearContext'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Role } from '../assembly/model'
import LoadingIndicator from '../components/LoadingIndicator'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const title: string = currentUser ? `Welcome, ${currentUser.username}` : 'Welcome to d CMS'
  const { query } = useRouter()
  
  return (
    <Layout home>
      <div className="flex items-center justify-center">
        <div className="flex-none w-1/5">
          <img src="/d-cms-logo.png" className="w-full m-0" alt="d CMS logo" />
        </div>  
        <div className="flex-initial">
          <h1 className="title">
            d CMS
          </h1>
        </div>
      </div>

      <h2 className="description">
        {title}
      </h2>

      {(!contract || (query.account_id && !currentUser)) && <LoadingIndicator />}
      {contract && (!query.account_id && !currentUser) && <p className="description">Please log in to continue</p>}

      <div className={styles.grid}>
        {currentUser && currentUser.role <= Role.Editor && (
          <>
            <Link href="/content">
              <a className={styles.card}>
                <h2>Content &rarr;</h2>
                <p>Create, edit, and view your content.</p>
              </a>
            </Link>

            <Link href="/media">
              <a className={styles.card}>
                <h2>Media &rarr;</h2>
                <p>Upload and organize your files.</p>
              </a>
            </Link>
          </>
        )}

        {currentUser && currentUser.role === Role.Admin && (
          <>
            <Link href="/contentTypes">
              <a className={styles.card}>
                <h2>Content Types &rarr;</h2>
                <p>View and create content types.</p>
              </a>
            </Link>

            <Link href="/users/manage">
              <a className={styles.card}>
                <h2>Users &rarr;</h2>
                <p>View and manage user access.</p>
              </a>
            </Link>

            <Link href="/clients/manage">
              <a className={styles.card}>
                <h2>Clients &rarr;</h2>
                <p>Add and edit access for client apps.</p>
              </a>
            </Link>

            <Link href="/analytics">
              <a className={styles.card}>
                <h2>History &rarr;</h2>
                <p>View transactions to Near</p>
              </a>
            </Link>
          </>
        )}

        <Link href="/public">
          <a className={styles.card}>
            <h2>Public Content &rarr;</h2>
            <p>View public content.</p>
          </a>
        </Link>
      </div>
    </Layout>
  )
}

export default Home
