import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"
import { NearContext } from "../context/NearContext"
import styles from '../styles/Layout.module.css'
import { LayoutProps } from "../types/app"
import Nav from "./Nav"

const Layout = ({ children, home }: LayoutProps): JSX.Element => {
  const { currentUser } = useContext(NearContext)
  const title = currentUser ? `Welcome ${currentUser.username}` : 'd CMS'

  return (
    <>
      <Head>
        <title>d CMS</title>
        <meta name="description" content="A decentralized content management system." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className={styles.container}>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Layout
