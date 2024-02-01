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

import GTIELogo from '../../assets/images/gtie_rgb_02.png';
import MetaCampUsLogo from '../../assets/images/metaCampUsLogo.png';
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
import School from '../../assets/images/school.png';
import Manual from '../../assets/images/manual.png';
import Rule from '../../assets/images/rule.png';
import Mail from '../../assets/images/mail.png';

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

  const [worldsDetail, setWorldsDetail] = useState({
    publicOpen: false,
    privateOpen: false,
    publicChoosen: 1,
    privateChoosen: 1
  });

  const openWorlds = (access) => {
    //要素の表示、円周上に表示させる
    let num = access === 'public' ? [0,1] : [0,1,2,3];
    //HTMLに表示
    let roulette = access === 'public' ? document.getElementById("publicRoulette") : document.getElementById("privateRoulette");
    console.log('test', num, roulette);
    /*円形に並べる*/
    let item_length = num.length;
    //rouletteの半径を計算
    let r = roulette.clientWidth/2;
    console.log('test', r);
    //360度÷配置要素数
    let deg = 360.0/item_length;
    //さっきの角度をラジアンに変更
    let rad = (deg*Math.PI/180.0);
    
    //要素追加して表示させる
    for(var i = 0; i < num.length; i++ ){
      //div要素の追加
      let div = document.createElement('div');
      div.className = "cil";
      div.id = "cil"+ i;
      div.innerHTML= num[i] ;
      const x = Math.cos(rad * i) * r + r;
      const y = Math.sin(rad * i) * r + r;
      let circle = roulette.appendChild(div);
      circle.style.left = x + "px";
      circle.style.top = y + "px";
      // console.log(x);
    } 
  }


  return (
    
    <PageContainer className={styles.homePage}>
      
      <Container>
      <div className={styles.App}>
        <header>
          <div className='Logo'>
            <img src={MetaCampUsLogo}/>
            <img src={GTIELogo} />
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
              <div>
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
              </div>
              <p>
                MetaCampUsのハブとなるワールドです。
                <br />
                初めての方もリピートの方もまずはここから始めてみましょう！！
           
              <br /><br/>
            
                操作説明やチュートリアルはワールド内に用意されています。
                <br /><br/>
                必要なものはアカウントのみです。
              </p>
              <div className="details">
                <div className="schoolList">
                  <img src={School}/>
                  <p>参加大学一覧</p>
                  <div className="list">
                    aaaa
                  </div>
                </div>
                <div className="manualAndRule">
                  <div className="manual">
                    <img src={Manual}/>
                    <p>操作説明</p>
                  </div>
                  <div className="rule">
                    <img src={Rule}/>
                    <p>規約</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ground">© 2024- GTIE</div>
          </div>
          <div className='Scroll'>
            <div className="scrollHeader">
              <div className="logo">
              <img src={MetaCampUsLogo}/>
              <img src={GTIELogo}/></div>
            </div>
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
                <br/><br/>
                <div className={worldsDetail.publicOpen || worldsDetail.privateOpen ? "content" : "content offContent"}>
                  <div className={worldsDetail.publicOpen ? "public" : "public offPublic"}>
                      <div className="publicLabel">
                        <span>オープンワールド</span>
                        <p>
                          参加者全員がお楽しみいただけるワールドです。
                          <br/><br/>
                          まずはこのワールドから探索しましょう！！
                        </p>
                        <button onClick={() => 
                          {
                            setWorldsDetail({...worldsDetail, publicOpen: true})
                            openWorlds('public')
                          }
                        }>詳細</button>
                      </div>
                      <div id="publicRoulette" className={worldsDetail.publicOpen ? "" : "offPublic"}>
                      </div>
                  </div>
                  <div className={worldsDetail.privateOpen ? "private" : "private offPrivate"}>  
                    <div className="privateLabel">
                      <span>プライベートワールド</span>
                      <p>
                        限られたメンバーだけが入室できるワールドです。
                        <br/><br/>
                        グループ活動やイベントにご活用いただけます！！
                      </p>
                      <button onClick={() => 
                        {
                          setWorldsDetail({...worldsDetail, privateOpen: true})
                          openWorlds('private')
                        }
                      }>詳細</button>
                    </div>
                    <div id="privateRoulette" className={worldsDetail.privateOpen ? "" : "offPrivate"}></div>
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

                {/* 
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
                </div>*/}
              </div>
              {/*
              <div className='paging'>
                <span className='dot accent'></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
              </div>
               */}
            </div>
            <div className="contact">
              <img src={Mail}/>
              <p>お問い合わせはこちら</p>
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
