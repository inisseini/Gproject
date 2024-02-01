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
import ProducedBy from '../../assets/images/producedby.png';
import GTIEBackground from '../../assets/images/GTIE.png';
import Glass from '../../assets/images/glass.png';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

import { Button } from "../input/Button";
import { AvatarSettingsContent } from "../room/AvatarSettingsContent";
 
import gsap from "gsap";

export function HomePage() {
  const store = window.APP.store;
  store.initProfile();
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

    function doSwap() {
      document.querySelectorAll("#nav li").forEach(function(item) {
        if (item.classList.contains("active")) {
          swap(item);
        } else {
          swapBack(item);
        }
      });
    }
    
    function clear() {
      document.querySelectorAll("#nav li").forEach(function(item) {
        item.classList.remove("active");
      });
    }
    
    document.querySelectorAll("#nav li").forEach(function(item) {
      item.addEventListener("click", function() {
        clear();
        item.classList.add("active");
        doSwap();
        rotate('.dial', item);
      });
    });
    
    function rotate(m, o) {
      const id = "#" + o.getAttribute("id");
      const menu = document.querySelector(m);
      
      menu.classList.remove('r0', 'lr1', 'lr2', 'rr1', 'rr2');
      
      if (id === "#email") menu.classList.add("lr2");
      if (id === "#photo") menu.classList.add('lr1');
      if (id === "#cloud") menu.classList.add('r0');
      if (id === "#portfolio") menu.classList.add('rr1');
      if (id === "#settings") menu.classList.add('rr2');
    }
    
    function swap(o) {
      const id = "#" + o.getAttribute("id");
      const cimg = document.querySelector(id + " img");
      const burl = "http://grantcr.com/files/";
      const ext = ".png";
      let nimg;
    
      if (id === "#email") nimg = burl + "iemailh" + ext;
      if (id === "#photo") nimg = burl + "photosh" + ext;
      if (id === "#cloud") nimg = burl + "icloudh" + ext;
      if (id === "#portfolio") nimg = burl + "portfolioh" + ext;
      if (id === "#settings") nimg = burl + "settingsh" + ext;
    
      if (nimg) cimg.setAttribute("src", nimg);
    }
    
    function swapBack(o) {
      const id = "#" + o.getAttribute("id");
      const cimg = document.querySelector(id + " img");
      const burl = "http://grantcr.com/files/";
      const ext = ".png";
      let nimg;
    
      if (id === "#email") nimg = burl + "iemail" + ext;
      if (id === "#photo") nimg = burl + "iphoto" + ext;
      if (id === "#cloud") nimg = burl + "icloud" + ext;
      if (id === "#portfolio") nimg = burl + "portfolio" + ext;
      if (id === "#settings") nimg = burl + "settings" + ext;
    
      if (nimg) cimg.setAttribute("src", nimg);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
  const email = auth.email;

  const [isAccountMenuOpen, setAccountMenu] = useState(false);
  const [accountContent, setAccountContent] = useState({
    profile: false,
    friends: false,
    nortification: false,
    myAccount: false,
  })

  const onSignOut = () => {

    const logOutConfirm = confirm("ログアウトしますか？")
    if(logOutConfirm) {
      auth.signOut()
    } else {
      return
    }
  }


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
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: true,
                    friends: false,
                    nortification: false,
                    myAccount: false
                  }))  
                }}>
                  <img src={Profile} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: true,
                    nortification: false,
                    myAccount: false
                  }))  
                }}>
                  <img src={Friends} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: false,
                    nortification: true,
                    myAccount: false
                  }))  
                }}>
                  <img src={Nortification} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: false,
                    nortification: false,
                    myAccount: true
                  }))  
                }}>
                  <img src={MyAccount} />
                </li>
              </a>
              <a href="#" onClick={onSignOut} >
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
                <button className="accountMenuCloseButton" onClick={() => setAccountMenu(false)}>閉じる</button>
                {accountContent.profile ?
                <div className="profile">
                  <AvatarSettingsContent
                    displayName={window.APP.store.state.profile.displayName}
                    profile={window.APP.store.profile}
                    pronouns={window.APP.store.state.pronouns}
                    sendDiscordMessage={window.APP.store.state.sendDiscordMessage}
                  />
                </div>
                : undefined}
              </div>
            : undefined}
          </div>
          <div className='Discord'>
            <img src={Discord} />
            <p>Discordサーバーに参加する →</p>
          </div>
        </header>
        <div className="contentContainer">
        <div className='content'>
          <div className='Enter'>
            <h2 className='title'>ENTER</h2>
            <div className='enterBox'>
              <img src={Entry} />
              {auth.isSignedIn ?
              <a href="/MQU3Mkg/rewarding-caring-land">
                <div className='entryButton'>
                  <p>クリックして入場</p>
                </div>
              </a>
              : 
              
              <div className='entryButton'>
                <p>ログインしてください</p>
              </div>
              }
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
            <div className="ground">© 2024- GTIE</div>
          </div>
          <div className='Scroll'>
            <div className="scrollHeader"></div>
            <div className="scrollHero"></div>
            <div className="scrollAbout">
              <div className="container">
                <br/>
                <h2 className='title'>ABOUT</h2>
                <br/><br/>
                <p>MetaCampUs Japan（MCU：エムシーユー）は、アカデミア起業のためのコンテンツやネットワークを共有するためのコミュニティ・プラットフォームです。
                <br/><br/>
                メタバース上のキャンパスに通いコミュニティに参加することで、普段のキャンパスライフにはない新たな出会いや気づきが生まれます。</p>
              </div>
            </div>
            <div className="scrollFeature">
              <div className="container">
                <br/>
                <h2 className='title'>FEATURE</h2>
                <br/><br/>
                <p>
                MCUは、大学の垣根を横断した、出会い、共感、触発が生まれるコミュニティです。
                <br/><br/>
                ・<span>出会い</span>：自分と異なる価値観や世界と出会い、「当たり前」の感覚を広げていく。
                <br/><br/>
                ・<span>共感</span>：お互いの想いに共有しあい、仲間と共感し、高めあう。夢と理想の壁打ちの場。    
                <br/><br/>
                ・<span>触発</span>：仲間や先輩達の熱にあてられ、自分もできる、という根拠のない自信。
                </p>
              </div>
            </div>
            <div className="scrollWorlds">
              <div className="container">
                <h2 className='title'>WORLDS</h2>
                <div className='content'>
                <div id="mainB">
                  <div className="bg">
                    <div className="bg1">

                    </div>
                  </div>
                </div>
                <div className="over">
                  <div className="dial">
                    <div className="grad">
                        
                    </div>
                  </div>
                  <div className="container">
                  <div className="nav">
                    <ul id="nav">
                      <li id="email">
                        <a>
                          <img src="http://grantcr.com/files/iemail.png" />
                        </a>
                      </li>
                      <li id="photo">
                        <a>
                          <img src="http://grantcr.com/files/iphoto.png" />
                        </a>
                      </li>
                      <li id="cloud" className="active">
                        <a>
                          <img src="http://grantcr.com/files/icloud.png" />
                        </a>
                      </li>
                      <li id="portfolio">
                        <a>
                          <img src="http://grantcr.com/files/portfolio.png" />
                        </a>
                      </li>
                      <li id="settings">
                        <a>
                          <img src="http://grantcr.com/files/settings.png" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  </div>
                </div>

                </div>

              </div>
            </div>
            <div className="scrollGTIE">
              <img className="ProducedBy" src={ProducedBy}/>
              <div className="GTIE">
                <img className="GTIEBackground" src={GTIEBackground}/>
                <p>
                MetaCampUs Japan（MCU）の運営団体であるGTIE（ジータイ）とは、東京大学・東京工業大学・早稲田大学を主幹機関とした『世界を変える大学発スタートアップを育てる』プラットフォームです。
                <br/><br/>
                  <button>GTIEサイト</button>              
                </p>

              </div>
            </div>
            <div className="scrollGround">
              <img className="glass" src={Glass}/>
              <div className="ground"></div>
            </div>
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
            <div className="ground">
            Ver. β 1.0
            </div>
          </div>
        </div>
      </div>
    </div>
       
      </Container>
    </PageContainer>
  );
}
