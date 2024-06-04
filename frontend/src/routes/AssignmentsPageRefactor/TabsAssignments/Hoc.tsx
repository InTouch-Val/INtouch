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
import {
  AssignmentTab,
  TypeFilter,
  TypeLanguage,
} from "../../../utils/constants";

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
      assignments,
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
        author: activeTab == AssignmentTab.myList ? currentUser.id : undefined,
        favorite: activeTab == AssignmentTab.favorites && true,
        language:
          activeLanguage !== TypeLanguage.All ? activeLanguage : undefined,
        assignmentType:
          activeFilterType !== TypeFilter.All ? activeFilterType : undefined,
        ordering: activeOrder,
        search: searchTerm,
      },
      {
        selectFromResult: ({ data, ...originalArgs }) => ({
          data: assignmentSelector.selectAll(
            data ?? assignmentAdapter.getInitialState(),
          ),
          ...originalArgs,
        }),
      },
    );

    const toggleFavorite = async (
      assignmentId: number | string,
    ): Promise<void> => {
      const isFavorite = currentUser.doctor.assignments.find(
        (item) => item == assignmentId,
      );
      dispatch(
        changeAssignmentFavoriteByIdAction({
          isFavorite: isFavorite,
          assignmentId: assignmentId,
        }),
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
