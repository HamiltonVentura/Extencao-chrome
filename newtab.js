document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const addTaskButton = document.getElementById("add-task");

  // Carregar as tarefas salvas ao iniciar
  chrome.storage.sync.get(["tasks"], function (result) {
    const tasks = result.tasks || [];
    tasks.forEach((task) => addTaskToList(task));
  });

  // Adicionar nova tarefa
  addTaskButton.addEventListener("click", function () {
    const task = taskInput.value;
    if (task) {
      addTaskToList(task);
      saveTask(task);
      taskInput.value = "";
    }
  });

  // Função para adicionar tarefa à lista
  function addTaskToList(task) {
    const li = document.createElement("li");
    li.textContent = task;

    const editButton = document.createElement("span");
    editButton.textContent = "Editar";
    editButton.classList.add("edit-task");

    const removeButton = document.createElement("span");
    removeButton.textContent = "x";
    removeButton.classList.add("remove-task");

    li.appendChild(editButton);
    li.appendChild(removeButton);

    taskList.appendChild(li);

    // Remover tarefa Evento ( clicar em X de remover )
    removeButton.addEventListener("click", function () {
      removeTask(task);         // - Remover a tarefa (dados)
      taskList.removeChild(li); // - Remover Lista de nó no DOM
    });

    // Editar Tarefa Evento ( Clicar em Editar )
    editButton.addEventListener("click", function () {
      editTask(task, li);
    });
  }

  // Salvar tarefa no armazenamento
  function saveTask(task) {
    chrome.storage.sync.get(["tasks"], function (result) {
      const tasks = result.tasks || [];
      tasks.push(task);
      chrome.storage.sync.set({ tasks: tasks });
    });
  }

  // Remover tarefa do armazenamento
  function removeTask(task) {
    chrome.storage.sync.get(["tasks"], function (result) {
      const tasks = result.tasks || [];
      const newTasks = tasks.filter((t) => t !== task);
      chrome.storage.sync.set({ tasks: newTasks });
    });
  }

  // Editar tarefa e atualizar o armazenamento
  function editTask(oldTask, li) {
    const newTask = prompt("Edite a tarefa:", oldTask);

    if (newTask && newTask !== oldTask) {
      // Atualizar o texto do item na lista
      li.firstChild.textContent = newTask;

      // Atualizar o armazenamento
      chrome.storage.sync.get(["tasks"], function (result) {
        const tasks = result.tasks || [];
        const taskIndex = tasks.indexOf(oldTask);
        if (taskIndex > -1) {
          tasks[taskIndex] = newTask;
          chrome.storage.sync.set({ tasks: tasks });
        }
      });
    }
  }
});
