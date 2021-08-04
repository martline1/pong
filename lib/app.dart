import "package:flutter/material.dart";

// Import Own Modules
import "pages/routes.dart";

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      routes: routes,
      initialRoute: "game",
      debugShowCheckedModeBanner: false,
      title: "Flutter Pong",
      theme: ThemeData(
        primaryColor: Colors.black,
      ),
    );
  }
}
