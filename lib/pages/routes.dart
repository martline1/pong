import "package:flutter/material.dart";

// Import Own Modules
import "game_page.dart";

final Map<String, Widget Function(BuildContext)> routes = {
  "game": (_) => GamePage(),
};
