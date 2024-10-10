//@ts-nocheck
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AssignmentsType,
  AssignmentCreateRequestType,
  AssignmentsResponseType,
  AssignmentUpdateRequestType,
} from "./types";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";

type ParamsAssignments = {
  limit?: number;
  author?: number;
  favorite?: boolean;
  language?: string;
  assignmentType?: string;
  ordering?: string;
  page: number;
  search?: string;
  issue?: string;
};

const ASSIGNMENTS_URL = "assignments";
const BASE_URL = "https://app.intouch.care/api/v1/";

const assignmentAdapter = createEntityAdapter({
  selectId: (item: AssignmentsType) => item.id,
});

const assignmentSelector = assignmentAdapter.getSelectors();

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Assignments", "UNAUTHORIZED", "UNKNOWN_ERROR"],
  keepUnusedDataFor: 180, //3 минуты
  endpoints: (build) => ({
    getAssignments: build.query<
      EntityState<AssignmentsType, number>,
      ParamsAssignments
    >({
      query: ({
        limit = 15,
        page = 1,
        author,
        favorite,
        language,
        assignmentType,
        ordering = "date_asc",
        search,
        issue,
      }) => ({
        url: `${ASSIGNMENTS_URL}?${limit ? `limit=${limit} ` : ""}&page=${page}${author ? `&author=${author}` : ""}${favorite ? `&favorites=${favorite}` : ""}${language ? `&language=${language}` : ""}${issue ? `&issue=${issue.toLowerCase().replace(/\s/g, "-")}` : ""}${assignmentType ? `&assignment_type=${assignmentType}` : ""}&ordering=${ordering}${search ? `&search=${search}` : ""}`.replace(
          /\s+/g,
          "",
        ), // regex удаляет все пробелы в строке
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      merge: (currentState, incomingState) => {
        return assignmentAdapter.addMany(
          currentState,
          assignmentSelector.selectAll(incomingState),
        );
      },
      transformResponse: (response: AssignmentsResponseType) => {
        return assignmentAdapter.addMany(
          assignmentAdapter.getInitialState(),
          response.results,
        );
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.author !== previousArg?.author ||
          currentArg?.favorite !== previousArg?.favorite ||
          currentArg?.language !== previousArg?.language ||
          currentArg?.assignmentType !== previousArg?.assignmentType ||
          currentArg?.ordering !== previousArg?.ordering ||
          currentArg?.issue !== previousArg?.issue ||
          currentArg?.search !== previousArg?.search
        );
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return JSON.stringify({
          language: queryArgs.language,
          ordering: queryArgs.ordering,
          search: queryArgs.search,
          author: queryArgs.author,
          issue: queryArgs.issue,
          assignmentType: queryArgs.assignmentType,
          favorite: queryArgs.favorite,
        });
      },

      providesTags: (result, error, args) =>
        result
          ? [
              { type: "Assignments", id: JSON.stringify(args) },
              { type: "Assignments", id: "PARTIAL-LIST" },
            ]
          : error?.status === 401
            ? ["UNAUTHORIZED"]
            : ["UNKNOWN_ERROR"],
    }),

    createAssignment: build.mutation<
      AssignmentsType,
      Partial<AssignmentCreateRequestType>
    >({
      query: (newAssignmentData) => ({
        url: "assignments/",
        method: "POST",
        data: newAssignmentData,

        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: newAssignmentData,
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),
    createClientAssignment: build.mutation<
      AssignmentsType,
      Partial<AssignmentCreateRequestType>
    >({
      query: (newAssignmentData) => ({
        url: "assignments-client/",
        method: "POST",
        data: newAssignmentData,

        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: newAssignmentData,
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),
    getAssignmentByUUID: build.query<AssignmentsType, string>({
      query: (uuid) => ({
        url: `${ASSIGNMENTS_URL}/${uuid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
    updateAssignmentByUUID: build.mutation<
      AssignmentsType,
      AssignmentUpdateRequestType
    >({
      query: ({ uuid, body }) => ({
        url: `${ASSIGNMENTS_URL}/${uuid}/`,
        method: "PUT",
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: body,
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),
    updateClientAssignmentByUUID: build.mutation<
      AssignmentsType,
      AssignmentUpdateRequestType
    >({
      query: ({ uuid, body }) => ({
        url: `${ASSIGNMENTS_URL}-client/${uuid}/`,
        method: "PUT",
        data: body,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: body,
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),

    deleteAssignmentClientByUUID: build.mutation<string, number>({
      query: (uuid) => ({
        url: `assignments-client/${uuid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),

    deleteAssignmentByUUID: build.mutation<string, string>({
      query: (uuid) => ({
        url: `${ASSIGNMENTS_URL}/${uuid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: () => [{ type: "Assignments", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useCreateAssignmentMutation,
  useDeleteAssignmentByUUIDMutation,
  useUpdateAssignmentByUUIDMutation,
  useUpdateClientAssignmentByUUIDMutation,
  useGetAssignmentByUUIDQuery,
  useGetAssignmentsQuery,
  useDeleteAssignmentClientByUUIDMutation,
} = assignmentApi;

export { assignmentAdapter, assignmentSelector };
