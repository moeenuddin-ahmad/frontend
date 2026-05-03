import { baseApi } from "../../api/baseApi";

export const shopsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query({
      query: (params) => ({
        url: "/shop",
        params,
      }),
      providesTags: ["Shops"],
    }),
    getShopById: builder.query({
      query: (id) => `/shop/${id}`,
      providesTags: (result, error, id) => [{ type: "Shops", id }, "Shops"],
    }),
    createShop: builder.mutation({
      query: (shopData) => ({
        url: "/shop",
        method: "POST",
        body: shopData,
      }),
      invalidatesTags: ["Shops"],
    }),
    updateShop: builder.mutation({
      query: ({ id, body }) => ({
        url: `/shop/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Shops", id },
        "Shops",
      ],
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `/shop/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shops"],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopByIdQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopsApi;
