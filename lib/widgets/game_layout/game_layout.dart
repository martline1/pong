import "package:flutter/material.dart";
import "package:flutter_hooks/flutter_hooks.dart";
import "package:hooks_riverpod/hooks_riverpod.dart";

// Import Own Modules
import "middle_lines.dart";
import "custom_number.dart";
import "package:flutter_pong/prodivers/game/game_provider.dart";

class GameLayout extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    final gameState = useProvider(gameProvider);

    return Stack(
      children: [
        Container(
          width: size.width,
          height: size.height,
          decoration: BoxDecoration(
            color: Colors.black,
          ),
        ),
        MiddleLines(),
        Padding(
          padding: EdgeInsets.only(top: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              CustomNumber(value: gameState.aiCounter),
              SizedBox(width: 75),
              CustomNumber(value: gameState.playerCounter),
            ],
          ),
        ),
      ],
    );
  }
}
