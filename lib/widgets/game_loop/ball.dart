import "dart:ui";
import "dart:math";
import "package:flutter/material.dart";

// Import Own Modules
import "package:flutter_pong/helpers/vector2.dart";
import "package:flutter_pong/helpers/game_widget.dart";

class Ball extends GameWidget {
  double speed = 15;
  double ballSize = 8;
  Vector2<double> position = Vector2(0.0, 0.0);
  Vector2<double> direction = Vector2(0.0, 0.0);

  Random random;

  Ball(Size screenSize) : random = Random() {
    position = Vector2(screenSize.width / 2, screenSize.height / 2);

    direction.x =
        (random.nextDouble() + 0.1) * (random.nextDouble() > 0.5 ? 1 : -1);
    direction.y =
        (random.nextDouble() + 0.1) * (random.nextDouble() > 0.5 ? 1 : -1);
  }

  @override
  void update(Canvas canvas, Size size) {
    this.position.x += this.speed * this.direction.x;
    this.position.y += this.speed * this.direction.y;

    if (this.position.x < 0 || this.position.x > size.width) {
      this.direction.x *= -1;
    }

    if (this.position.y < 0 || this.position.y > size.height) {
      this.direction.y *= -1;
    }
  }

  @override
  void render(Canvas canvas, Size size) {
    canvas.drawCircle(
      Offset(this.position.x, this.position.y),
      this.ballSize,
      Paint()..color = Colors.white,
    );
  }
}
