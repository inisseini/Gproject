import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { ToolTip } from "@mozilla/lilypad-ui";
import styles from "./PeopleSidebar.scss";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { IconButton } from "../input/IconButton";
import { ReactComponent as StarIcon } from "../icons/Star.svg";
import { ReactComponent as DesktopIcon } from "../icons/Desktop.svg";
import { ReactComponent as DiscordIcon } from "../icons/Discord.svg";
import { ReactComponent as PhoneIcon } from "../icons/Phone.svg";
import { ReactComponent as VRIcon } from "../icons/VR.svg";
import { ReactComponent as VolumeOffIcon } from "../icons/VolumeOff.svg";
import { ReactComponent as VolumeHighIcon } from "../icons/VolumeHigh.svg";
import { ReactComponent as VolumeMutedIcon } from "../icons/VolumeMuted.svg";
import { ReactComponent as HandRaisedIcon } from "../icons/HandRaised.svg";
import { ReactComponent as UserSoundOnIcon } from "../icons/UserSoundOn.svg";
import { ReactComponent as UserSoundOffIcon } from "../icons/UserSoundOff.svg";
import { List, ButtonListItem } from "../layout/List";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import { PermissionNotification } from "./PermissionNotifications";

import userDemoImg from "../../assets/images/default-icon.png";
import configs from "../../utils/configs";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const toolTipDescription = defineMessage({
  id: "people-sidebar.muted-tooltip",
  defaultMessage: "User is {mutedState}"
});

function getDeviceLabel(ctx, intl) {
  if (ctx) {
    if (ctx.hmd) {
      return intl.formatMessage({ id: "people-sidebar.device-label.vr", defaultMessage: "VR" });
    } else if (ctx.discord) {
      return intl.formatMessage({ id: "people-sidebar.device-label.discord", defaultMessage: "Discord Bot" });
    } else if (ctx.mobile) {
      return intl.formatMessage({ id: "people-sidebar.device-label.mobile", defaultMessage: "Mobile" });
    }
  }

  return intl.formatMessage({ id: "people-sidebar.device-label.desktop", defaultMessage: "Desktop" });
}

function getDeviceIconComponent(ctx) {
  if (ctx) {
    if (ctx.hmd) {
      return VRIcon;
    } else if (ctx.discord) {
      return DiscordIcon;
    } else if (ctx.mobile) {
      return PhoneIcon;
    }
  }

  return DesktopIcon;
}

function getVoiceLabel(micPresence, intl) {
  if (micPresence) {
    if (micPresence.talking) {
      return intl.formatMessage({ id: "people-sidebar.voice-label.talking", defaultMessage: "Talking" });
    } else if (micPresence.muted) {
      return intl.formatMessage({ id: "people-sidebar.voice-label.muted", defaultMessage: "Muted" });
    }
  }

  return intl.formatMessage({ id: "people-sidebar.voice-label.not-talking", defaultMessage: "Not Talking" });
}

function getVoiceIconComponent(micPresence) {
  if (micPresence) {
    if (micPresence.muted) {
      return VolumeMutedIcon;
    } else if (micPresence.talking) {
      return VolumeHighIcon;
    }
  }

  return VolumeOffIcon;
}

function getPresenceMessage(presence, intl) {
  switch (presence) {
    case "lobby":
      return intl.formatMessage({ id: "people-sidebar.presence.in-lobby", defaultMessage: "In Lobby" });
    case "room":
      return intl.formatMessage({ id: "people-sidebar.presence.in-room", defaultMessage: "In Room" });
    case "entering":
      return intl.formatMessage({ id: "people-sidebar.presence.entering", defaultMessage: "Entering Room" });
    default:
      return undefined;
  }
}

function getPersonName(person, intl) {
  const you = intl.formatMessage({
    id: "people-sidebar.person-name.you",
    defaultMessage: "You"
  });
  const suffix = person.isMe ? `(${you})` : person.profile?.pronouns ? `(${person.profile.pronouns})` : "";
  return `${person.profile?.displayName} ${suffix}`;
}

export function PeopleSidebar({
  people,
  onSelectPerson,
  onClose,
  showMuteAll,
  onMuteAll,
  canVoiceChat,
  voiceChatEnabled,
  isMod
}) {
  const intl = useIntl();
  const me = people.find(person => !!person.isMe); //window.APP.hubChannel.store.state.profile.displayName;
  const filteredPeople = people
    .filter(person => !person.isMe)
    .sort(a => {
      return a.hand_raised ? -1 : 1;
    });
  me && filteredPeople.unshift(me);
  const store = window.APP.store;

  const DBClient = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: "AKIA6O7CLSZWBGWOEKTK",
      secretAccessKey: "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"
    }
  });

  const docClient = DynamoDBDocumentClient.from(DBClient);

  function getToolTipDescription(isMuted) {
    return intl.formatMessage(toolTipDescription, { mutedState: isMuted ? "muted" : "not muted" });
  }

  const onSendFriendRequest = (target, person) => {
    const confirm = window.confirm("フレンド申請をしてよろしいですか？");
    if (confirm) {
      const message =
        "systemMessage///from///" +
        window.APP.hubChannel.store.state.profile.displayName +
        `///${localStorage.getItem("myID")}` +
        "///to///" +
        target +
        "///sendFriendRequest";
      document.getElementById("avatar-rig").messageDispatch.dispatch(message);

      const myID = localStorage.getItem("myID");
      const targetID = person.profile?.metacampusID ? `${person.profile.metacampusID}` : "";

      const handleSubmit = async event => {
        const command = new UpdateCommand({
          TableName: "userList",
          Key: {
            ID: targetID
          },
          UpdateExpression: "SET #orders = list_append(#orders, :v_orderId)",
          ExpressionAttributeNames: {
            "#orders": "requested"
          },
          ExpressionAttributeValues: {
            ":v_orderId": [myID]
          }
        });

        try {
          await docClient.send(new UpdateCommand(command));
          console.log("Friend added successfully.");
        } catch (error) {
          console.error("Error updating DynamoDB:", error);
        }
      };

      handleSubmit();
    }
  };

  const GetFriends = async () => {
    const command = new GetCommand({
      TableName: "userList",
      Key: {
        ID: localStorage.getItem("myID")
      }
    });

    const response = await docClient.send(command);

    const myFriends = localStorage.getItem("myFriends");
    if (myFriends) {
      localStorage.setItem("myFriends", JSON.stringify(response.Item.friends));
    }
  };

  useEffect(() => {
    GetFriends();
  }, []);

  return (
    <Sidebar
      title={
        <FormattedMessage
          id="people-sidebar.title"
          defaultMessage="People ({numPeople})"
          values={{ numPeople: people.length }}
        />
      }
      beforeTitle={<CloseButton onClick={onClose} />}
      afterTitle={
        showMuteAll ? (
          <IconButton onClick={onMuteAll}>
            <FormattedMessage id="people-sidebar.mute-all-button" defaultMessage="Mute All" />
          </IconButton>
        ) : undefined
      }
    >
      {!canVoiceChat && <PermissionNotification permission={"voice_chat"} />}
      {!voiceChatEnabled && isMod && <PermissionNotification permission={"voice_chat"} isMod={true} />}
      <List>
        {!!people.length &&
          filteredPeople.map(person => {
            const DeviceIcon = getDeviceIconComponent(person.context);
            const VoiceIcon = getVoiceIconComponent(person.micPresence);
            console.log("friendtest", person.profile.metacampusID, person.profile.isAdmin);

            const encodedURL = encodeURIComponent(person.profile.metacampusID);

            const Img = () => {
              const imageElement = useMemo(() => {
                console.log("Rendering Img component");
                const url = "https://metacampusassets.s3.ap-northeast-1.amazonaws.com/" + encodedURL + ".jpg";
                console.log("img url=", url);
                return <img src={url} alt="" />;
              }, []);

              return imageElement;
            };

            return (
              <div className={styles.person} key={person.id} type="button" onClick={e => onSelectPerson(person, e)}>
                <div className={styles.icon}>
                  <Img />
                </div>
                <div className={styles.detail}>
                  <p>{getPersonName(person, intl)}</p>
                  <div className={styles.detailIcons}>
                    {person.hand_raised && <HandRaisedIcon />}
                    {<DeviceIcon title={getDeviceLabel(person.context, intl)} />}
                    {!person.context?.discord && VoiceIcon && (
                      <VoiceIcon title={getVoiceLabel(person.micPresence, intl)} />
                    )}
                    {!person.isMe && (
                      <ToolTip
                        classProp="tooltip"
                        location="bottom"
                        description={getToolTipDescription(
                          store._preferences?.avatarVoiceLevels?.[person.profile?.displayName]?.muted
                        )}
                      >
                        {store._preferences?.avatarVoiceLevels?.[person.profile?.displayName]?.muted ? (
                          <UserSoundOffIcon />
                        ) : (
                          <UserSoundOnIcon />
                        )}
                      </ToolTip>
                    )}
                    {person.roles?.owner && (
                      <StarIcon
                        title={intl.formatMessage({
                          id: "people-sidebar.moderator-label",
                          defaultMessage: "Moderator"
                        })}
                        className={styles.moderatorIcon}
                        width={12}
                        height={12}
                      />
                    )}
                    <p className={styles.presence}>{getPresenceMessage(person.presence, intl)}</p>
                  </div>
                </div>
                <div className={styles.status}>
                  {!person.isMe ? (
                    <>
                      {person.profile.isAdmin && <p className="isAdmin">運営</p>}
                      {JSON.parse(localStorage.getItem("myFriends"))?.includes(person.profile.metacampusID) ? (
                        <p className="friend">フレンド</p>
                      ) : (
                        <button
                          className="friend"
                          onClick={() => onSendFriendRequest(person.profile?.displayName, person)}
                        >
                          フレンド申請
                        </button>
                      )}
                    </>
                  ) : undefined}
                </div>
              </div>
            );
          })}
      </List>
    </Sidebar>
  );
}

PeopleSidebar.propTypes = {
  people: PropTypes.array,
  onSelectPerson: PropTypes.func,
  showMuteAll: PropTypes.bool,
  onMuteAll: PropTypes.func,
  onClose: PropTypes.func,
  canVoiceChat: PropTypes.bool,
  voiceChatEnabled: PropTypes.bool,
  isMod: PropTypes.bool
};

PeopleSidebar.defaultProps = {
  people: [],
  onSelectPerson: () => {},
  isMod: false
};
