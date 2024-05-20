import { listEmotions } from "../../../psy/DiaryPageContent/DiaryBlockEmotion/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function DiaryBlockEmotionClientMobile({
  primaryEmotionValue,
  setShowEmotionsPage,
}) {
  return (
    <div className="diary__block-event">
      <div className="diary__emotions-wrapper--mobile">
        {listEmotions.some((item) => item.title === primaryEmotionValue) ? (
          <span
            className="diary__emotions-mobile-link"
            onClick={() => setShowEmotionsPage(true)}
          >
            <ul className="diary__emotions-list--mobile">
              {listEmotions
                .filter((item) => item.title === primaryEmotionValue)
                .map((filteredItem) => (
                  <li key={filteredItem.id}>
                    <div className="diary__emotion-container--mobile">
                      <img
                        src={filteredItem.img}
                        className="diary__emotion--mobile"
                        alt={filteredItem.title}
                      />
                      <span>{filteredItem.title}</span>
                    </div>
                  </li>
                ))}
            </ul>
            <FontAwesomeIcon
              icon={faPencil}
              style={{ color: "#417D88", paddingRight: "5px" }}
              size="xl"
            />
          </span>
        ) : (
          <div className="diary__empty-emotion">
            <span
              onClick={() => setShowEmotionsPage(true)}
              className="diary__empty-emotion--link"
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "rgba(255 255 255 / 85%)", marginRight: "7px" }}
                size="lg"
              />
              Add emotions
            </span>

            <ul className="diary__empty-emotion--list">
              {listEmotions.slice(0, 3).map((item) => {
                return (
                  <li key={item.id}>
                    <img
                      src={item.img}
                      className="diary__empty-emotion--item"
                      alt={item.title}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
