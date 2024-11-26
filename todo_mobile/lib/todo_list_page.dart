import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class Todo {
  final String id;
  final String title;
  bool completed;

  Todo({
    required this.id,
    required this.title,
    this.completed = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'completed': completed,
    };
  }

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
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final CollectionReference todosCollection =
      FirebaseFirestore.instance.collection('todos');
  final CollectionReference usersCollection =
      FirebaseFirestore.instance.collection('users');

  List<Todo> todos = [];

  @override
  void initState() {
    super.initState();
    fetchTodos();
  }

  Future<void> fetchTodos() async {
    final User? user = _auth.currentUser;

    Query query;

    if (user == null) {
      query = todosCollection.where('user', isNull: true);
    } else {
      QuerySnapshot querySnapshot =
          await usersCollection.where('email', isEqualTo: user.email).get();
      DocumentReference userRef =
          usersCollection.doc(querySnapshot.docs.first.id);
      query = todosCollection.where('user', isEqualTo: userRef);
    }

    query.snapshots().listen((snapshot) {
      setState(() {
        todos = snapshot.docs
            .map((doc) =>
                Todo.fromMap(doc.id, doc.data() as Map<String, dynamic>))
            .toList();
      });
    });
  }

  void toggleCompleted(Todo todo) {
    todosCollection.doc(todo.id).update({'completed': !todo.completed});
  }

  void deleteTodo(Todo todo) {
    todosCollection.doc(todo.id).delete();
  }

  Future<void> addTodo(String title) async {
    final User? user = _auth.currentUser;
    final newTodoRef = todosCollection.doc();

    final newTodo = Todo(
      id: newTodoRef.id,
      title: title,
      completed: false,
    );

    final todoData = newTodo.toMap();
    if (user != null) {
      QuerySnapshot querySnapshot =
          await usersCollection.where('email', isEqualTo: user.email).get();
      if (querySnapshot.docs.isNotEmpty) {
        DocumentReference userRef =
            usersCollection.doc(querySnapshot.docs.first.id);
        todoData['user'] = userRef;
      }
    }

    newTodoRef.set(todoData);
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
            decoration:
                const InputDecoration(hintText: "Entrez le titre de la tâche"),
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

  void logout() async {
    await _auth.signOut();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    final User? user = _auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Liste des tâches"),
        actions: [
          if (user != null)
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: logout,
            ),
        ],
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
