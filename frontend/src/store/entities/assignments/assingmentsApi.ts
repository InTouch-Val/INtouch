import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AssignmentsType,
  AssignmentCreateRequestType,
  AssignmentsResponseType,
  AssignmentUpdateRequestType,
} from "./types";

const ASSIGNMENTS_URL = "assignments";
const BASE_URL = "https://app.intouch.care/api/v1/";

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Assignments", "UNAUTHORIZED", "UNKNOWN_ERROR"],
  keepUnusedDataFor: 180, //3 минуты
  endpoints: (build) => ({
    getAssignments: build.query<
      AssignmentsResponseType,
      { limit?: number; author?: number; favorite?: boolean }
    >({
      query: ({ limit, author, favorite }) => ({
        url: `${ASSIGNMENTS_URL}?${limit ? `limit=${limit} ` : ""}${author ? `&author=${author} ` : ""}${favorite ? `&favourites=${favorite} ` : ""}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: (result, error, args) =>
        result
          ? [
              { type: "Assignments", id: args.limit },
              { type: "Assignments", id: "PARTIAL-LIST" },
            ]
          : error?.status === 401
            ? ["UNAUTHORIZED"]
            : ["UNKNOWN_ERROR"],
    }),
    createAssignment: build.mutation<
      AssignmentsType,
      AssignmentCreateRequestType
    >({
      query: (newAssignmentData) => ({
        url: "assignments/",
        method: "POST",
        data: newAssignmentData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
      query: ({ uuid }) => ({
        url: `${ASSIGNMENTS_URL}/${uuid}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
    changeAssignmentFavoriteByUUID: build.query<
      AssignmentsResponseType,
      { uuid?: number; isFavorite?: boolean }
    >({
      query: ({ uuid, isFavorite }) => ({
        url: `${ASSIGNMENTS_URL}/${isFavorite ? `delete-list` : "add-list"}/${uuid}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
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
  useGetAssignmentByUUIDQuery,
  useGetAssignmentsQuery,
  useChangeAssignmentFavoriteByUUIDQuery,
} = assignmentApi;
