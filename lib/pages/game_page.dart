import "package:flutter/material.dart";

// Import Own Modules
import "package:flutter_pong/widgets/game_loop/game_loop.dart";
import "package:flutter_pong/widgets/game_layout/game_layout.dart";

class GamePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GameLayout(),
          GameLoop(),
        ],
      ),
    );
  }
}
