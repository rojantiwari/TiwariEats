import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import axios from "axios"
import { toast } from "sonner"

const API_END_POINT = "http://localhost:8000/api/v1/restaurant"
axios.defaults.withCredentials = true

// type RestaurantState = {
//     loading: boolean,
//     restaurant: null,
//     restaurantResult: null,
// }



export const useRestaurantStore = create<any>()(persist((set) => (
    {
        loading: false,
        restaurant: null,
        searchedRestaurant: null,

        createRestaurant: async (formData: FormData) => {
            try {
                set({ loading: true });
                const response: any = await axios.post(`${API_END_POINT}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    set({ loading: false });
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
                set({ loading: false });
            }
        },

        getRestaurant: async () => {
            try {
                set({ loading: true });
                const response: any = await axios.get(`${API_END_POINT}/`);
                if (response.data.success) {
                    set({ loading: false, restaurant: response.data.restaurant });
                }
            } catch (error: any) {
                if (error.response.status === 404) {
                    set({ restaurant: null });
                }
                set({ loading: false });
            }
        },

        updateRestaurant: async (formData: FormData) => {
            try {
                set({ loading: true });
                const response: any = await axios.put(`${API_END_POINT}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    set({ loading: false });
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
                set({ loading: false });
            }
        },

        searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
            try {
                set({ loading: true });

                const params = new URLSearchParams();
                params.set("searchQuery", searchQuery);
                params.set("selectedCuisines", selectedCuisines.join(","));

                // await new Promise((resolve) => setTimeout(resolve, 2000));
                const response: any = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
                if (response.data.success) {
                    console.log(response.data)
                    set({ loading: false, searchedRestaurant: response.data });
                }
            } catch (error) {
                set({ loading: false });
            }
        },

        // addMenuToRestaurant: (menu: MenuItem) => {
        //     set((state: any) => ({
        //         restaurant: state.restaurant ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] } : null,
        //     }))
        // },


        // updateMe


        // setAppliedFilter: (value: string) => {
        //     set((state) => {
        //         const isAlreadyApplied = state.appliedFilter.includes(value);
        //         const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
        //         return { appliedFilter: updatedFilter }
        //     })
        // },

        // resetAppliedFilter: () => {
        //     set({ appliedFilter: [] })
        // },

        // getSingleRestaurant: async (restaurantId: string) => {
        //     try {
        //         const response: any = await axios.get(`${API_END_POINT}/${restaurantId}`);
        //         if (response.data.success) {
        //             set({ singleRestaurant: response.data.restaurant })
        //         }
        //     } catch (error) { }
        // },

        // getRestaurantOrders: async () => {
        //     try {
        //         const response: any = await axios.get(`${API_END_POINT}/order`);
        //         if (response.data.success) {
        //             set({ restaurantOrder: response.data.orders });
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // },

        // updateRestaurantOrder: async (orderId: string, status: string) => {
        //     try {
        //         const response: any = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         });
        //         if (response.data.success) {
        //             const updatedOrder = get().restaurantOrder.map((order: Orders) => {
        //                 return order._id === orderId ? { ...order, status: response.data.status } : order;
        //             })
        //             set({ restaurantOrder: updatedOrder });
        //             toast.success(response.data.message);
        //         }
        //     } catch (error: any) {
        //         toast.error(error.response.data.message);
        //     }
        // }
    }),
    {
        name: " restaurant-name",
        storage: createJSONStorage(() => localStorage)
    }
))