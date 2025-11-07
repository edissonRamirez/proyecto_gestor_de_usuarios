// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";
//Definir la composición de la variable reactiva
interface UserState {
    user: User | null;
}

const storedUser = localStorage.getItem("user");
console.log(storedUser);

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
};

console.log(initialState);


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;