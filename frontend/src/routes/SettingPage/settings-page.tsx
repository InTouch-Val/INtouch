//@ts-nocheck
import { useState } from "react";
import { useAuth } from "../../service/authContext";
import "../../css/settings.scss";
import { ProfileTab } from "./ProfileTab/ProfileTab";
import { SecurityTab } from "./SecurityTab/SeciurityTab";

// TODO: PopUp windows for users

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { currentUser } = useAuth();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="settings-page">
      <header>
        <h2>{`${currentUser.first_name} ${currentUser.last_name}`}</h2>
      </header>
      <div className="tabs">
        <button
          onClick={() => handleTabClick("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          Profile
        </button>
        <button
          onClick={() => handleTabClick("security")}
          className={activeTab === "security" ? "active" : ""}
        >
          Security
        </button>
      </div>
      <div className="settings_section">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
      </div>
    </div>
  );
}

export { SettingsPage };
