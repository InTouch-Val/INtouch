//@ts-nocheck
import React from "react";
import { useAuth } from "../../../service/authContext";
import { API } from "../../../service/axios";
import "../../../css/settings.scss";
import { useForm, Controller } from "react-hook-form";
import { updateUserForm } from "./schemaValid";
import { yupResolver } from "@hookform/resolvers/yup";
import useMobileWidth from "../../../utils/hook/useMobileWidth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export function ProfileTab() {
  const isMobileWidth = useMobileWidth();
  const { currentUser, updateUserData } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: {
      firstName: currentUser.first_name || "",
      lastName: currentUser.last_name || "",
      email: currentUser.email || "",
      dateOfBirth: currentUser.date_of_birth || "",
    },
    resolver: yupResolver(updateUserForm),
    mode: "all",
  });
  const [statusMessageText, setStatusMessageText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState([]);
  const [previewImage, setPreviewImage] = React.useState(
    currentUser.photo || "default-avatar.png",
  );
  const fileInputRef = React.createRef();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await API.put(
        `user/update/${currentUser.id}/`,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          photo: selectedFile,
          date_of_birth: data.dateOfBirth,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      ).then(() => updateUserData());
      setStatusMessageText("Changes saved successfully");

      console.log(response);
    } catch (error) {
      console.error("Error updating profile:" + error);
    }

    try {
      const response = await API.post(
        `user/update/email/`,
        {
          new_email: data.email,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      ).then(() => updateUserData());

      console.log(response);
    } catch (error) {
      console.error("Error updating profile:" + error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {statusMessageText != "" && (
        <div className="success-message">{statusMessageText}</div>
      )}
      <div className="settings-profile-tab">
        {currentUser.user_type == "doctor" && (
          <div className="left-column">
            <img src={previewImage} alt="Profile" className="avatar" />
            <input
              type="file"
              id="photo"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <button className="action-button" onClick={handleChooseFileClick}>
              Change Photo
            </button>
          </div>
        )}
        <div className="right-column">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="firstName">First Name</label>
                  <div className="change-password-form_wrapper">
                    <input
                      {...fieldsProps}
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className={
                        !!errors.firstName
                          ? "settings-input profile__inputError"
                          : "settings-input"
                      }
                    />
                    <span className="input__container_icon">
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{ color: "#417D88", paddingRight: "5px" }}
                        size="fa-lg"
                      />
                    </span>
                  </div>
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="change-password-form_wrapper">
                    <input
                      {...fieldsProps}
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className={
                        !!errors.lastName
                          ? "settings-input profile__inputError"
                          : "settings-input"
                      }
                    />
                    <span className="input__container_icon">
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{ color: "#417D88", paddingRight: "5px" }}
                        size="fa-lg"
                      />
                    </span>
                  </div>
                </div>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { ...fieldsProps } }) => (
                <div className="input__container">
                  <label htmlFor="email">Email</label>
                  <div className="change-password-form_wrapper">
                    <input
                      {...fieldsProps}
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={
                        !!errors.email
                          ? "settings-input profile__inputError"
                          : "settings-input"
                      }
                    />
                    <span className="input__container_icon">
                      <FontAwesomeIcon
                        icon={faPencil}
                        style={{ color: "#417D88", paddingRight: "5px" }}
                        size="fa-lg"
                      />
                    </span>
                  </div>
                </div>
              )}
            />
            {currentUser.user_type == "doctor" && (
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field: { ...fieldsProps } }) => (
                  <div className="input__container">
                    <label htmlFor="dateOfBirt">Date Of Birth</label>
                    <input
                      {...fieldsProps}
                      type="date"
                      name="dateOfBirth"
                      placeholder="Date of Birth"
                      className="settings-input"
                    />
                  </div>
                )}
              />
            )}

            <div className="profile__errorMessages">
              <div className="profile__fieldError">
                {!!errors.firstName && (
                  <span className="profile__errorText">
                    {errors.firstName?.message}
                  </span>
                )}
                {!!errors.lastName && (
                  <span className="profile__errorText">
                    {errors.lastName?.message}
                  </span>
                )}
                {!!errors.email && (
                  <span className="profile__errorText">
                    {errors.email?.message}
                  </span>
                )}
                {!!errors.dateOfBirth && (
                  <span className="profile__errorText">
                    {errors.dateOfBirth?.message}
                  </span>
                )}
                {currentUser.new_email_changing && (
                  <span className="profile__errorText">
                    We’ve sent a confirmation email to your new email address —{" "}
                    {currentUser.new_email_temp}. Please check and confirm to
                    complete the email update process. Your current email will
                    remain active until then.
                  </span>
                )}
              </div>
              <div>
                <button
                  className={`save-settings`}
                  type="submit"
                  disabled={!(isValid && isDirty)}
                >
                  {isMobileWidth ? "Save" : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
