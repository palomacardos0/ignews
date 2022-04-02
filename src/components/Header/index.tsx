import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';
import { RiMenuLine } from 'react-icons/ri';
import { useContext } from 'react';
import { ToggleMenuContext } from '../../contexts/ToggleMenuContexts';

export function Header() {

  const {toggleOpenMenu} = useContext(ToggleMenuContext);


  return (
    <header className={styles.headerContainer}>

      <div className={styles.headerContent}>

        <button className={styles.menuButton} onClick={toggleOpenMenu}>
          <RiMenuLine/>
        </button>

        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>


        <SignInButton />

      </div>
    </header>
  );
}