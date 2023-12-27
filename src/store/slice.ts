import { createSlice } from "@reduxjs/toolkit";

export interface ITodos {
  id: number;
  text: string;
  completed: boolean;
  labels: string[];
}
export interface SliceState {
  theme: "light" | "dark";
  todos: ITodos[];
  selectedLabel: string | null;
}

const initialTodos: ITodos[] = [
  {
    id: 1,
    text: "Learn Redux Toolkit",
    completed: false,
    labels: ["study"]
  },
  {
    id: 2,
    text: "Learn React",
    completed: true,
    labels: ["study", "work"]
  },
  {
    id: 3,
    text: "Build a todo app",
    completed: true,
    labels: ["work", "fun"]
  }
]

const initialState: SliceState = {
  theme: "light",
  todos: initialTodos,
  selectedLabel: null,
};

export const slice = createSlice({
  name: "slice",
  initialState: initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSelectedLabel: (state, action) => {
      state.selectedLabel = action.payload;
    },
    toggleTodoComplete: (state, action) => {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    }
  },
});

export const { setTheme, setSelectedLabel, toggleTodoComplete } = slice.actions;

export default slice.reducer;
