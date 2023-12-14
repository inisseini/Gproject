import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "../room/MediaGrid";
import { MediaTile } from "../room/MediaTiles";
import { PageContainer } from "../layout/PageContainer";
import { scaledThumbnailUrlFor } from "../../utils/media-url-utils";
import { Column } from "../layout/Column";
import { Container } from "../layout/Container";
import { SocialBar } from "../home/SocialBar";
import { SignInButton } from "./SignInButton";
import { AppLogo } from "../misc/AppLogo";
import { isHmc } from "../../utils/isHmc";
import maskEmail from "../../utils/mask-email";

import Logo from '../../assets/images/gtie_rgb_02.png'
import Profile from '../../assets/images/mingcute_profile-fill.png';
import Friends from '../../assets/images/fa-solid_user-friends.png';
import Nortification from '../../assets/images/Vector.png';
import MyAccount from '../../assets/images/mdi_account.png';
import LogOut from '../../assets/images/clarity_logout-solid.png';
import Entry from '../../assets/images/entry.png';
import Discord from '../../assets/images/skill-icons_discord.png';

import { Button } from "../input/Button";

export function HomePage() {
  console.log('test',window.APP.store.state);
  const auth = useContext(AuthContext);
  const intl = useIntl();

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const sortedFavoriteRooms = Array.from(favoriteRooms).sort((a, b) => b.member_count - a.member_count);
  const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);
  const wrapInBold = chunk => <b>{chunk}</b>;
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
  const email = auth.email;

  const [isAccountMenuOpen, setAccountMenu] = useState(false);
  return (
    
    <PageContainer className={styles.homePage}>
      
      <Container>
      <div className={styles.App}>
      <header>
        <div className='Logo'>
          <img src={Logo} />
        </div>
        <div className='Account'>
          {auth.isSignedIn ?
            <ul>
            <a>
              <li>
                <img src={Profile} />
              </li>
            </a>
            <a>
              <li>
                <img src={Friends} />
              </li>
            </a>
            <a>
              <li>
                <img src={Nortification} />
              </li>
            </a>
            <a>
              <li>
                <img src={MyAccount} />
              </li>
            </a>
            <a href="#" onClick={auth.signOut} >
              <li className='orange'>
                <img src={LogOut} />
              </li>
            </a>
          </ul>
          :
            <Button thick preset="signin" as="a" href="/signin" className={styles.signInButton}>
              <FormattedMessage id="sign-in-button" defaultMessage="Sign in/Sign up" />
            </Button>
          }
          
          {isAccountMenuOpen ?
            <div className="accountMenu">
              <button onClick={() => setAccountMenu(false)}></button>
            </div>
          : undefined}
        </div>
        <div className='Discord'>
          <img src={Discord} />
          <p>Discordサーバーに参加する →</p>
        </div>
      </header>
      <div className='content'>
        <div className='Enter'>
          <h2 className='title'>ENTER</h2>
          <div className='enterBox'>
            <img src={Entry} />
            <a href="/MQU3Mkg/rewarding-caring-land">
              <div className='entryButton'>
                <p>クリックして入場</p>
              </div>
            </a>
            <p>
              MetaCampUsのハブとなるワールドです。
              <br />
              初めての方もリピートの方もまずはここから始めてみましょう！！
            </p>
            <br />
            <p>
              操作説明やチュートリアルはワールド内に用意されています。
              <br />
              必要なものはアカウントのみです。
            </p>
          </div>
        </div>
        <div className='Scroll'>
          <div className='dummy'></div>
          <p>a</p>
        </div>
        <div className='IndexAndNews'>
          <div className='Index'>
            <ul>
              <li className='accent'>-CONCEPT</li>
              <li>-FEATURE</li>
              <li>-WORLD</li>
              <li>-CONTACT</li>
            </ul>
          </div>
          <div className='News'>
            <h2 className='title'>NEWS</h2>
            <div className='articleContainer'>
              <div className='article'>
                <h3 className='articleTitle'>2023-12-10 イベントのお知らせ</h3>
                <div className='articleContent'>
                  <img src={Entry} />
                  <p>起業家パネルディスカッション【VCとは】</p>
                </div>
                <a className='articleDetail'>詳細</a>
              </div>

              <div className='article'>
                <h3 className='articleTitle'>
                  2023-12-08 アップデートのお知らせ
                </h3>
                <div className='articleContent'>
                  <img src={Entry} />
                  <p>フレンド機能が追加されました</p>
                </div>
                <a className='articleDetail'>詳細</a>
              </div>

              <div className='article'>
                <h3 className='articleTitle'>
                  2023-12-08 アップデートのお知らせ
                </h3>
                <div className='articleContent'>
                  <img src={Entry} />
                  <p>図書館ワールドが追加されました</p>
                </div>
                <a className='articleDetail'>詳細</a>
              </div>
            </div>
            <div className='paging'>
              <span className='dot accent'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
            </div>
          </div>
        </div>
      </div>
    </div>
       
      </Container>
    </PageContainer>
  );
}
