import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchAvatar } from "../utils/avatar-utils";
import { replaceHistoryState } from "../utils/history";
import { AvatarSettingsSidebar } from "./room/AvatarSettingsSidebar";
import { AvatarSetupModal } from "./room/AvatarSetupModal";
import AvatarPreview from "./avatar-preview";
import configs from "../utils/configs";

export default class ProfileEntryPanel extends Component {
  static propTypes = {
    containerType: PropTypes.oneOf(["sidebar", "modal"]),
    displayNameOverride: PropTypes.string,
    store: PropTypes.object,
    mediaSearchStore: PropTypes.object,
    messages: PropTypes.object,
    finished: PropTypes.func,
    history: PropTypes.object,
    avatarId: PropTypes.string,
    onClose: PropTypes.func,
    onBack: PropTypes.func,
    showBackButton: PropTypes.bool
  };

  static defaultProps = {
    containerType: "modal"
  };

  state = {
    avatarId: null,
    displayName: null,
    avatar: null,
    pronouns: null,
    profile: null,
    friendContent: null,
    sendDiscordMessage: "希望しない",
    metacampusID: null,
    isAdmin: false
  };

  constructor(props) {
    super(props);
    this.state = this.getStateFromProfile();
    if (props.avatarId) {
      this.state.avatarId = props.avatarId;
    }
    this.state.metacampusID = localStorage.getItem("myID");
    this.state.isAdmin = configs.isAdmin();
    this.props.store.addEventListener("statechanged", this.storeUpdated);
    this.scene = document.querySelector("a-scene");
  }

  getStateFromProfile = () => {
    const { displayName, avatarId, pronouns, profile, friendContent, sendDiscordMessage, metacampusID, isAdmin } =
      this.props.store.state.profile;
    return { displayName, avatarId, pronouns, profile, friendContent, sendDiscordMessage, metacampusID, isAdmin };
  };

  storeUpdated = () => this.setState(this.getStateFromProfile());

  saveStateAndFinish = e => {
    e && e.preventDefault();

    const { displayName, pronouns, profile, friendContent, sendDiscordMessage, metacampusID, isAdmin } =
      this.props.store.state.profile;
    const { hasChangedNameOrPronounsOrProfile } = this.props.store.state.activity;

    const hasChangedNowOrPreviously =
      hasChangedNameOrPronounsOrProfile ||
      this.state.displayName !== displayName ||
      this.state.pronouns !== pronouns ||
      this.state.profile !== profile;
    this.props.store.update({
      activity: {
        hasChangedNameOrPronounsOrProfile: hasChangedNowOrPreviously,
        hasAcceptedProfile: true
      },
      profile: {
        displayName: this.state.displayName,
        avatarId: this.state.avatarId,
        pronouns: this.state.pronouns,
        friendContent: this.state.friendContent,
        profile: this.state.profile,
        sendDiscordMessage: this.state.sendDiscordMessage,
        metacampusID: this.state.metacampusID,
        isAdmin: this.state.isAdmin
      }
    });
    this.props.finished();
    this.scene.emit("avatar_updated");
  };

  stopPropagation = e => {
    e.stopPropagation();
  };

  setAvatarFromMediaResult = ({ detail: { entry, selectAction } }) => {
    if ((entry.type !== "avatar" && entry.type !== "avatar_listing") || selectAction !== "use") return;

    this.setState({ avatarId: entry.id });
    // Replace history state with the current avatar id since this component gets destroyed when we open the
    // avatar editor and we want the back button to work. We read the history state back via the avatarId prop.
    // We read the current state key from history since it could be "overlay" or "entry_step".
    replaceHistoryState(this.props.history, this.props.history.location.state.key, "profile", { avatarId: entry.id });
  };

  componentDidMount() {
    if (this.nameInput || this.pronounsInput || this.profileInput) {
      // stop propagation so that avatar doesn't move when wasd'ing during text input.
      this.nameInput.addEventListener("keydown", this.stopPropagation);
      this.nameInput.addEventListener("keypress", this.stopPropagation);
      this.nameInput.addEventListener("keyup", this.stopPropagation);
    }
    this.scene.addEventListener("action_selected_media_result_entry", this.setAvatarFromMediaResult);
    // This handles editing avatars in the entry_step, since this component remains mounted with the same avatarId
    this.scene.addEventListener("action_avatar_saved", this.refetchAvatar);

    this.refetchAvatar();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.avatarId !== this.state.avatarId) {
      this.refetchAvatar();
    }
  }

  componentWillUnmount() {
    this.props.store.removeEventListener("statechanged", this.storeUpdated);
    if (this.nameInput || this.pronounsInput || this.profileInput) {
      this.nameInput.removeEventListener("keydown", this.stopPropagation);
      this.nameInput.removeEventListener("keypress", this.stopPropagation);
      this.nameInput.removeEventListener("keyup", this.stopPropagation);
    }
    this.scene.removeEventListener("action_selected_media_result_entry", this.setAvatarFromMediaResult);
    this.scene.removeEventListener("action_avatar_saved", this.refetchAvatar);
  }

  refetchAvatar = async () => {
    const avatar = await fetchAvatar(this.state.avatarId);
    if (this.state.avatarId !== avatar.avatar_id) return; // This is an old result, ignore it
    this.setState({ avatar });
  };

  render() {
    console.log(this.props.store.schema);
    const avatarSettingsProps = {
      displayNameInputRef: inp => (this.nameInput = inp),
      pronounsInputRef: inp => (this.pronounsInput = inp),
      profileInputRef: inp => (this.profileInput = inp),
      friendContentInputRef: inp => (this.friendContentInput = inp),
      sendDiscordMessageInputRef: inp => (this.sendDiscordMessageInput = inp),
      metacampusIDInputRef: inp => (this.metacampusIDInput = inp),
      isAdminInputRef: inp => (this.isAdminInput = inp),
      disableDisplayNameInput: !!this.props.displayNameOverride,
      displayName: this.props.displayNameOverride ? this.props.displayNameOverride : this.state.displayName,
      pronouns: this.state.pronouns,
      profile: this.state.profile,
      friendContent: this.state.friendContent,
      sendDiscordMessage: this.state.sendDiscordMessage,
      metacampusID: this.state.metacampusID,
      isAdmin: this.state.isAdmin,
      displayNamePattern: this.props.store.schema.definitions.profile.properties.displayName.pattern,
      pronounsPattern: this.props.store.schema.definitions.profile.properties.pronouns.pattern,
      profilePattern: this.props.store.schema.definitions.profile.properties.profile.pattern,
      friendContentPattern: this.props.store.schema.definitions.profile.properties.friendContent.pattern,
      sendDiscordMessagePattern: this.props.store.schema.definitions.profile.properties.sendDiscordMessage.pattern,
      metacampusIDPattern: this.props.store.schema.definitions.profile.properties.metacampusID.pattern,
      isAdminPattern: this.props.store.schema.definitions.profile.properties.isAdmin.pattern,
      onChangeDisplayName: e => this.setState({ displayName: e.target.value }),
      onChangePronouns: e => this.setState({ pronouns: e.target.value }),
      onChangeProfile: e => this.setState({ profile: e.target.value }),
      onChangefriendContent: e => this.setState({ friendContent: e.target.value }),
      onChangeSendDiscordMessage: e => this.setState({ sendDiscordMessage: e }),
      onChangeMetacampusID: e => this.setState({ metacampusID: e.target.value }),
      onChangeisAdmin: e => this.setState({ isAdmin: e.target.value }),
      avatarPreview: <AvatarPreview avatarGltfUrl={this.state.avatar && this.state.avatar.gltf_url} />,
      onChangeAvatar: e => {
        e.preventDefault();
        this.props.mediaSearchStore.sourceNavigateWithNoNav("avatars", "use");
      },
      onSubmit: this.saveStateAndFinish,
      onClose: this.props.onClose,
      onBack: this.props.onBack
    };

    if (this.props.containerType === "sidebar") {
      console.log("avatarsettingsGENERAL");
      return <AvatarSettingsSidebar {...avatarSettingsProps} showBackButton={this.props.showBackButton} />;
    }

    return <AvatarSetupModal {...avatarSettingsProps} />;
  }
}
