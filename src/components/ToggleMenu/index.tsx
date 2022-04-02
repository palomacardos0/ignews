import { ActiveLink } from '../ActiveLink';
import styles from './styles.module.scss';
import {RiCloseLine} from 'react-icons/ri'
import { useContext } from 'react';
import { ToggleMenuContext } from '../../contexts/ToggleMenuContexts';

export function ToggleMenu(){
  const {isActiveMenu, toggleCloseMenu} = useContext(ToggleMenuContext)
  
  return(
    <div className={`${styles.contentMenu} ${isActiveMenu && styles.menuActive}`}>
      <div className={styles.headerMenu}>

      <button onClick={toggleCloseMenu}>
        <RiCloseLine/>
      </button>
      <img src="/images/logo.svg" alt="ig.news" />

      </div>

      <nav className={styles.navigationMenu}>
        <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
        </ActiveLink>
      </nav>
    </div>
  )
}