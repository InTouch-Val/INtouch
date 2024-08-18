import React from "react";

import { useNavigate } from "react-router-dom";
import FilterDropDown from "./FilterDropDown/FilterDropDown";
import ModalAssignments from "./ModalsAssignments/ModalAssignments";
import { useAppDispatch } from "../../store/store";
import AllTabs from "./AllTabs/AllTabs";
import TabsAssignments from "./TabsAssignments/Tab";
import { changeSearchAction } from "../../store/slices";
import { WithTab } from "./TabsAssignments/Hoc";
import addAssignment from "../../images/psy-icons/add-assignment-icon.svg";
import Button from "../../stories/buttons/Button";
import useAssignmentsOnboardingTour from "../../utils/hook/onboardingHooks.ts/assignmentsOnboardingTour";

interface Props {
  isShareModal?: boolean;
  selectedAssignmentIdForShareModalOnClientPage?: string;
  setSelectedAssignmentIdForShareModalOnClientPage?: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function AssignmentsPageRefactor({
  isShareModal = false,
  selectedAssignmentIdForShareModalOnClientPage,
  setSelectedAssignmentIdForShareModalOnClientPage,
}: Props): JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  useAssignmentsOnboardingTour();

  const handleDeleteClick = (assignmentId: string): void => {
    setSelectedAssignmentId(assignmentId);
    setIsDeleteModalOpen(true);
  };

  const handleShareButton = (assignmentId: string): void => {
    if (isShareModal) {
      setSelectedAssignmentIdForShareModalOnClientPage &&
        setSelectedAssignmentIdForShareModalOnClientPage(assignmentId);
    } else {
      setSelectedAssignmentId(assignmentId);
      setIsShareModalOpen(true);
    }
  };

  const handleAddAssignment = (): void => {
    navigate("/add-assignment");
  };

  function handleChangeSearch(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchTerm(e.target.value);
    dispatch(changeSearchAction(e.target.value));
  }

  const Tab = WithTab(TabsAssignments);

  return (
    <>
      <div className="assignments-page">
        {!isShareModal && (
          <header>
            <h1>Assignments</h1>
            <div id="onboarding_add_assignment">
            <Button
              buttonSize="small"
              fontSize="medium"
              label="Add Assignment"
              type="button"
              onClick={handleAddAssignment}
              icon={addAssignment}
            />
            </div>
          </header>
        )}
        <AllTabs />

        {!isShareModal && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleChangeSearch(e)}
            />
          </div>
        )}
        {!isShareModal && <FilterDropDown />}
      </div>

      <Tab
        isShareModal={isShareModal}
        handleDeleteClick={handleDeleteClick}
        handleShareButton={handleShareButton}
        selectedAssignmentIdForShareModalOnClientPage={
          selectedAssignmentIdForShareModalOnClientPage
        }
      />

      <ModalAssignments
        setIsShareModalOpen={setIsShareModalOpen}
        isShareModalOpen={isShareModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setSelectedAssignmentId={setSelectedAssignmentId}
        selectedAssignmentId={selectedAssignmentId}
      />
    </>
  );
}
