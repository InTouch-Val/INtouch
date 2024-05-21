import React from "react";
import {
  assignmentAdapter,
  assignmentSelector,
  useGetAssignmentsQuery,
} from "../../../store/entities";
import { useAuth } from "../../../service/authContext";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { changeAssignmentFavoriteByIdAction } from "../../../store/actions/assignment/assignmentActions";
import { changePageAction, changeStatusAction } from "../../../store/slices";
import { useInView } from "react-intersection-observer";
import { PropsTabAssignments } from "./Tab";

export const WithTab = (WrappedComponent) => {
  return function WithTabComponent(props) {
    //@ts-ignore
    const { currentUser } = useAuth();
    const { ref, inView } = useInView({
      threshold: 0.5,
    });
    const {
      activeTab,
      activeLanguage,
      activeFilterType,
      activeOrder,
      searchTerm,
      page,
      status,
    } = useAppSelector((state) => state.assignment);

    const dispatch = useAppDispatch();

    const {
      data: listAssignment,
      refetch,
      isSuccess,
    } = useGetAssignmentsQuery(
      {
        limit: 15,
        page: page,
        author: activeTab == "my-list" ? currentUser.id : undefined,
        favorite: activeTab == "favorites" && true,
        language: activeLanguage !== "all" ? activeLanguage : undefined,
        assignmentType:
          activeFilterType !== "all" ? activeFilterType : undefined,
        ordering: activeOrder,
        search: searchTerm,
      },
      {
        selectFromResult: ({ data, ...originalArgs }) => ({
          data: assignmentSelector.selectAll(
            data ?? assignmentAdapter.getInitialState()
          ),
          ...originalArgs,
        }),
      }
    );

    React.useEffect(() => {
      dispatch(changeStatusAction(isSuccess));
    }, [isSuccess]);

    const toggleFavorite = async (assignmentId: number | string) => {
      const isFavorite = currentUser.doctor.assignments.find(
        (item) => item == assignmentId
      );
      dispatch(
        changeAssignmentFavoriteByIdAction({
          isFavorite: isFavorite,
          assignmentId: assignmentId,
        })
      );
      refetch();
    };

    React.useEffect(() => {
      if (isSuccess && inView) {
        dispatch(changePageAction(page + 1));
      }
    }, [inView]);

    return (
      <React.Fragment>
        <WrappedComponent
          {...props}
          filteredAssignments={listAssignment}
          toggleFavorite={toggleFavorite}
        />
        <div ref={ref} className="observer_element" />
      </React.Fragment>
    );
  };
};
