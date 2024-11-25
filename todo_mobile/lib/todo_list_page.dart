import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class Todo {
  final String id;
  final String title;
  bool completed;

  Todo({
    required this.id,
    required this.title,
    this.completed = false,
  });

  // Convert Todo to a map for Firestore (sans 'id')
  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'completed': completed,
    };
  }

  // Create Todo from Firestore map (en utilisant l'ID du document Firestore)
  static Todo fromMap(String id, Map<String, dynamic> map) {
    return Todo(
      id: id,
      title: map['title'] ?? '',
      completed: map['completed'] ?? false,
    );
  }
}

class TodoItem extends StatelessWidget {
  final Todo todo;
  final Function(Todo) onToggleCompleted;
  final Function(Todo) onDelete;

  const TodoItem({
    Key? key,
    required this.todo,
    required this.onToggleCompleted,
    required this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Checkbox(
                  value: todo.completed,
                  onChanged: (value) {
                    if (value != null) {
                      onToggleCompleted(todo);
                    }
                  },
                ),
                Text(
                  todo.title,
                  style: TextStyle(
                    decoration: todo.completed
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                  ),
                ),
              ],
            ),
            IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () => onDelete(todo),
            ),
          ],
        ),
      ),
    );
  }
}

class TodoListPage extends StatefulWidget {
  const TodoListPage({Key? key}) : super(key: key);

  @override
  _TodoListPageState createState() => _TodoListPageState();
}

class _TodoListPageState extends State<TodoListPage> {
  final CollectionReference todosCollection =
      FirebaseFirestore.instance.collection('todos');

  List<Todo> todos = [];

  @override
  void initState() {
    super.initState();
    fetchTodos();
  }

  void fetchTodos() {
    todosCollection.snapshots().listen((snapshot) {
      setState(() {
        todos = snapshot.docs
            .map((doc) => Todo.fromMap(doc.id, doc.data() as Map<String, dynamic>))
            .toList();
      });
    });
  }

  void toggleCompleted(Todo todo) {
    if (todo.id.isEmpty) {
      print("Erreur : L'ID de la tâche est vide !");
      return;
    }
    todosCollection.doc(todo.id).update({'completed': !todo.completed});
  }

  void deleteTodo(Todo todo) {
    if (todo.id.isEmpty) {
      print("Erreur : L'ID de la tâche est vide !");
      return;
    }
    todosCollection.doc(todo.id).delete();
  }

  void addTodo(String title) {
    final newTodoRef = todosCollection.doc(); // Générez un ID unique pour le document
    final newTodo = Todo(
      id: newTodoRef.id, // L'ID est utilisé uniquement localement
      title: title,
      completed: false,
    );
    newTodoRef.set(newTodo.toMap()); // Ne stocke pas 'id' dans Firestore
  }

  void showAddTodoDialog() {
    TextEditingController controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Nouvelle tâche"),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(hintText: "Entrez le titre de la tâche"),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text("Annuler"),
            ),
            TextButton(
              onPressed: () {
                if (controller.text.trim().isNotEmpty) {
                  addTodo(controller.text.trim());
                  Navigator.of(context).pop();
                }
              },
              child: const Text("Ajouter"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Liste des tâches"),
      ),
      body: ListView.builder(
        itemCount: todos.length,
        itemBuilder: (context, index) {
          return TodoItem(
            todo: todos[index],
            onToggleCompleted: toggleCompleted,
            onDelete: deleteTodo,
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: showAddTodoDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}
