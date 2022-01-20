import { useContext } from 'react'
import type { NextPage } from 'next'
import { NearContext } from '../context/NearContext'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Role } from '../assembly/model'

const Home: NextPage = () => {
  const { currentUser } = useContext(NearContext)
  const title: string = currentUser ? `Welcome, ${currentUser.username}` : 'Welcome to d CMS'

  return (
    <Layout home>
      <h1 className="title">
        d CMS
      </h1>

      <h2 className="description">
        {title}
      </h2>

      {!currentUser && <p className="description">Please log in to continue</p>}

      <div className={styles.grid}>
        {currentUser && currentUser.role <= Role.Editor && (
          <Link href="/content">
            <a className={styles.card}>
              <h2>Content &rarr;</h2>
              <p>Create, edit, and view your content.</p>
            </a>
          </Link>
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
          </>
        )}
      </div>
    </Layout>
  )
}

export default Home
