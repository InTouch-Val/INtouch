import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useGetAssignmentsQuery } from "../../store/entities";
import { useAuth } from "../../service/authContext";
import { useNavigate } from "react-router-dom";
import FilterDropDown from "./FilterDropDown/FilterDropDown";
import ModalAssignments from "./ModalsAssignments/ModalAssignments";
import TabsHideOrderComponent from "./TabsAssignments/TabsHideOrderComponent";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { changeTabActions } from "../../store/slices/assignments/assignmentSlice";
import AllTabs from "./AllTabs/AllTabs";

export default function AssignmentsPageRefactor({ isShareModal = false }) {
  //@ts-ignore
  const { currentUser } = useAuth();
  const [limit, setLimit] = React.useState(30);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const navigate = useNavigate();

  const { activeTab } = useAppSelector((state) => state.assignment);


  const { data: listAssignment } = useGetAssignmentsQuery({
     limit: limit,
     author: activeTab == 'my-list' ? currentUser.id : undefined,
    favorite: activeTab == 'favorites' && true
  });

  console.log(listAssignment);


  const handleAddAssignment = () => {
    navigate("/add-assignment");
  };


  return (
    <>
      <div className="assignments-page">
        {!isShareModal && (
          <header>
            <h1>Assignments</h1>
            <button className="action-button" onClick={handleAddAssignment}>
              <FontAwesomeIcon icon={faPlus as IconProp} /> Add Assignment
            </button>
          </header>
        )}
        <AllTabs />

        {!isShareModal && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        {!isShareModal && <FilterDropDown />}
      </div>

      <TabsHideOrderComponent filteredAssignments={listAssignment?.results} />

      <ModalAssignments />
    </>
  );
}
