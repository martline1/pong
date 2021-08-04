import "dart:ui";

abstract class GameWidget {
  void update(Canvas canvas, Size size);
  void render(Canvas canvas, Size size);
}
