import { useState, useEffect } from "react";
import "./TodoComponent.css";
import pencilIcon from "../assets/pencil-svgrepo-com.svg";
import trashIcon from "../assets/trash-svgrepo-com.svg";
import saveIcon from "../assets/check-svgrepo-com.svg";
import categoryIcon from "../assets/category.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import studyIcon from "../assets/study.svg";
import maskIcon from "../assets/mask.svg";
import jobIcon from "../assets/jobicon.svg";

const TodoComponent = ({ selectedDay }) => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : {};
  });

  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletedTask, setDeletedTask] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // 🔹 salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    setTodos((prev) => ({
      ...prev,
      [selectedDay]: [
        ...(prev[selectedDay] || []),
        { id: Date.now().toString(), text: inputValue, category: null },
      ],
    }));
    setInputValue("");
  };

  const handleDelete = (id) => {
    const taskToDelete = todos[selectedDay].find((todo) => todo.id === id);

    setTodos((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((todo) => todo.id !== id),
    }));

    setDeletedTask({ ...taskToDelete, day: selectedDay });

    if (undoTimeout) clearTimeout(undoTimeout);

    const timeout = setTimeout(() => {
      setDeletedTask(null);
    }, 3000);

    setUndoTimeout(timeout);
  };

  const handleUndoDelete = () => {
    if (!deletedTask) return;

    setTodos((prev) => ({
      ...prev,
      [deletedTask.day]: [...(prev[deletedTask.day] || []), deletedTask],
    }));

    setDeletedTask(null);
    if (undoTimeout) clearTimeout(undoTimeout);
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const handleSaveEdit = (id) => {
    if (editValue.trim() === "") return;

    setTodos((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((todo) =>
        todo.id === id ? { ...todo, text: editValue } : todo
      ),
    }));
    setEditingId(null);
    setEditValue("");
  };

  const handleSetCategory = (id, category) => {
    setTodos((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((todo) =>
        todo.id === id ? { ...todo, category } : todo
      ),
    }));
    setMenuOpenId(null);
  };

  const filteredTodos = (todos[selectedDay] || []).filter((todo) =>
    selectedCategory ? todo.category === selectedCategory : true
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(filteredTodos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setTodos((prev) => ({
      ...prev,
      [selectedDay]: reordered,
    }));
  };
  const categoryIcons = {
    Trabalho: jobIcon,
    Estudo: studyIcon,
    Lazer: maskIcon,
  };
  return (
    <div className="todos-list">
      <h1 className="title">{selectedDay}</h1>

      <div className="filter-container">
        <button onClick={() => setSelectedCategory(null)}>Todas</button>
        <button onClick={() => setSelectedCategory("Trabalho")}>
          Trabalho
        </button>
        <button onClick={() => setSelectedCategory("Estudo")}>Estudo</button>
        <button onClick={() => setSelectedCategory("Lazer")}>Lazer</button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          className="input-field"
          type="text"
          placeholder={`Nova tarefa para ${selectedDay}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="add-button">
          Adicionar
        </button>
      </form>

      {(!todos[selectedDay] || todos[selectedDay].length === 0) && (
        <p className="empty">Não há tarefas</p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todoList">
          {(provided) => (
            <ul
              className="ul-todo"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {deletedTask && (
                <div className="undo-container">
                  <p>Tarefa deletada</p>
                  <button onClick={handleUndoDelete}>Desfazer</button>
                </div>
              )}
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li
                      className="todo-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {editingId === todo.id ? (
                        <>
                          <input
                            className="input-field"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <button
                            type="button"
                            className="save-button"
                            onClick={() => handleSaveEdit(todo.id)}
                          >
                            <img
                              src={saveIcon}
                              style={{ width: "16px", height: "16px" }}
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="todo-text">{todo.text}</div>
                          <span className="category-tag">
                            {todo.category || ""}
                          </span>
                          <fieldset className="button-container">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => handleEdit(todo.id, todo.text)}
                            >
                              <img
                                className="side-buttons"
                                src={pencilIcon}
                                alt="Editar"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </button>
                            {menuOpenId === todo.id ? (
                              <div className="menu">
                                <p
                                  className="menu-p"
                                  onClick={() =>
                                    handleSetCategory(todo.id, "Trabalho")
                                  }
                                >
                                  Trabalho
                                </p>
                                <p
                                  className="menu-p"
                                  onClick={() =>
                                    handleSetCategory(todo.id, "Estudo")
                                  }
                                >
                                  Estudo
                                </p>
                                <p
                                  className="menu-p"
                                  onClick={() =>
                                    handleSetCategory(todo.id, "Lazer")
                                  }
                                >
                                  Lazer
                                </p>
                              </div>
                            ) : (
                              <button
                                className="category-button"
                                type="button"
                                onClick={() => setMenuOpenId(todo.id)}
                              >
                                <img
                                  className="side-buttons"
                                  src={categoryIcon}
                                  alt="Categorias"
                                  style={{ width: "16px", height: "16px" }}
                                />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(todo.id)}
                              type="button"
                              className="delete-button"
                            >
                              <img
                                className="side-buttons"
                                src={trashIcon}
                                alt="delete"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </button>
                          </fieldset>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoComponent;
