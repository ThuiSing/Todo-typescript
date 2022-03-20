import React, { useCallback, useReducer, useRef, useState } from "react";
import { Box } from "@mui/system";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
interface TodoList {
  id: number;
  text: string;
  description: any;
}

type TypeOfAction =
  | { type: "ADD"; text: string; description: any }
  | { type: "REMOVE"; id: number };

const addToDb = (data: object) => {
  const exists = localStorage.getItem("Todo");
  let todo: any[] = [];
  if (!exists) {
    todo = [...todo, data];
  } else {
    todo = JSON.parse(exists);
    const newData = [...todo, data];
    todo = newData;
  }
  localStorage.setItem("Todo", JSON.stringify(todo));
};

const Todo = () => {
  const reducer = (state: TodoList[], action: TypeOfAction) => {
    switch (action.type) {
      case "ADD":
        return [
          ...state,
          {
            id: state.length,
            text: action.text,
            description: action.description,
          },
        ];
      case "REMOVE":
        return state.filter(({ id }) => id !== action.id);
    }
  };
  const gotData = JSON.parse(`${localStorage.getItem("Todo")}`);
  const [todoData, dispatch] = useReducer(
    reducer,
    gotData === null ? [] : gotData
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const desRef = useRef<HTMLTextAreaElement>(null);

  //add to local storage
  const add = useCallback(() => {
    console.log(typeof desRef.current?.value);

    if (inputRef.current) {
      if (inputRef.current.value === "" && desRef.current?.value === "") {
        window.alert("No enpty boxes allowed");
      } else {
        const newItem = {
          id: todoData.length,
          text: inputRef.current?.value,
          description: desRef.current?.value,
        };
        addToDb(newItem);
        dispatch({
          type: "ADD",
          text: inputRef.current?.value,
          description: desRef.current?.value,
        });
        inputRef.current.value = "";
      }
    }
  }, [todoData]);

  const handleDEl = (id: number) => {
    // console.log(id);
    const confirm = window.confirm("Are u sure to delete this?");
    confirm &&
      dispatch({
        type: "REMOVE",
        id: id,
      });

    const todoList = JSON.parse(`${localStorage.getItem("Todo")}`);
    const filter = todoList.filter((data: any) => data.id !== id);
    localStorage.setItem("Todo", JSON.stringify(filter));
  };

  // console.log(todo);

  return (
    <Box
      sx={{
        margin: "auto",
        minHeight: "80vh",
        padding: 4,
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <input
          style={{ height: "30px", width: "30rem" }}
          ref={inputRef}
          type="text"
          placeholder="Enter Title"
        />
        <textarea
          ref={desRef}
          style={{ width: "30rem" }}
          rows={8}
          placeholder="Enter Description"
        />
        <Button
          onClick={add}
          style={{
            marginLeft: "10px",
            height: "38px",
          }}
          variant="outlined"
        >
          ADD
        </Button>
      </div>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {todoData.map((data, newId) => (
          <Grid item xs={2} sm={4} md={4} key={data.id}>
            <Item>
              <ListItem
                secondaryAction={
                  <IconButton
                    onClick={() => handleDEl(data.id)}
                    edge="end"
                    aria-label="delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>{newId + 1}</Avatar>
                </ListItemAvatar>
                <div style={{ width: "100%", overflow: "hidden" }}>
                  <h3>{data.text}</h3>
                  <p style={{ overflowWrap: "break-word" }}>
                    {data.description}
                  </p>
                </div>
              </ListItem>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Todo;
