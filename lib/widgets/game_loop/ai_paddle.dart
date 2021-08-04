import "dart:ui";
import "package:flutter/material.dart";
import "package:flutter_pong/helpers/game_widget.dart";

// Import Own Modules
import "ball.dart";
import "package:flutter_pong/helpers/vector2.dart";

class AIPaddle extends GameWidget {
  Ball? ball;
  double speed = 6;
  Vector2<double> position = Vector2(30, 0);
  Vector2<double> direction = Vector2(0, 0);

  AIPaddle(Ball? _ball) : ball = _ball;

  @override
  void render(Canvas canvas, Size size) {
    double ballPositionY = ball?.position.y ?? 0;

    this.position.y += this.speed * (ballPositionY > this.position.y ? 1 : -1);
  }

  @override
  void update(Canvas canvas, Size size) {
    Rect rect = Offset(this.position.x, this.position.y) & const Size(15, 65);

    canvas.drawRect(rect, Paint()..color = Colors.white);
  }
}
