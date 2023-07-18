"use client";
import "../css/todo.css";
import { useEffect, useState } from "react";

export default function TODO() {
  const [inputValue, setInputValue] = useState("");
  const [tasksArray, setTasksArray] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasksArray(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasksArray));

    // console.table(tasksArray);
  }, [tasksArray]);

  function updateTasks(action, taskId, event) {
    event.preventDefault();

    switch (action) {
      case "add":
        if (inputValue.length === 0) {
          return;
        }

        const maxId =
          tasksArray.length > 0
            ? Math.max(...tasksArray.map((task) => task.id)) + 1
            : 0;

        const updatedTasksArray1 = tasksArray.map((task) => {
          return { ...task, fadeIn: false, pushDown: true };
        });

        let newTask = {
          text: inputValue,
          id: maxId,
          fadeIn: true,
          pushDown: false,
        };
        setTasksArray([newTask, ...updatedTasksArray1]);
        setInputValue("");

        setTimeout(() => {
          setTasksArray((prevTasks) =>
            prevTasks.map((task) =>
              task.id === maxId
                ? { ...task, fadeIn: false }
                : { ...task, pushDown: false }
            )
          );
        }, 2000);

        break;

      case "delete":
        const updatedTasksArray = tasksArray.map((task) => {
          if (task.id === taskId) {
            return { ...task, fadeOut: true };
          }
          return task;
        });
        setTasksArray(updatedTasksArray);

        setTimeout(() => {
          setTasksArray((prevTasks) =>
            prevTasks.filter((task) => !(task.id === taskId && task.fadeOut))
          );
        }, 900);

        break;

      default:
        break;
    }
  }

  function handleInput(event) {
    setInputValue(event.target.value);
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <label htmlFor="form-text-input">What needs to be done?</label>
        <form>
          <input
            type="text"
            id="form-text-input"
            placeholder="Task, chore, errand"
            onInput={handleInput}
            value={inputValue}
          />
          <button
            className="button"
            onClick={updateTasks.bind(null, "add", null)}
          >
            +
          </button>
        </form>
      </div>
      <div className="todo-body">
        <div>Total todos: {tasksArray.length}</div>
      </div>
      <div className="todo-footer">
        {tasksArray.map((task) => (
          <div
            className={`todo-footer-task 
            ${task.fadeIn ? "fade-in" : ""} 
            ${task.fadeOut ? "fade-out" : ""}
            ${task.pushDown ? "push-down" : ""}
            `}
            key={task.id}
          >
            <div>{task.text}</div>
            <button
              className="button"
              onClick={(event) => {
                updateTasks("delete", task.id, event);
              }}
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
