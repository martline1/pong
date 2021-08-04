import "package:flutter/material.dart";
import 'package:flutter/services.dart';
import "package:flutter_hooks/flutter_hooks.dart";

// Import Own Modules
import "ball.dart";
import "ai_paddle.dart";

class GameLoop extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    final focusNode = useFocusNode();

    final loopController = useAnimationController(
      duration: const Duration(seconds: 1),
    )..repeat();

    return LayoutBuilder(
      builder: (_, constraints) => Container(
        width: constraints.maxWidth,
        height: constraints.maxHeight,
        child: RawKeyboardListener(
          focusNode: focusNode,
          onKey: (RawKeyEvent event) {
            // if (event.logicalKey == LogicalKeyboardKey.)
          },
          autofocus: true,
          child: CustomPaint(
            painter: _GamePainter(loopController, size),
          ),
        ),
      ),
    );
  }
}

class _GamePainter extends CustomPainter {
  Ball? ball;
  AIPaddle? aiPaddle;

  _GamePainter(AnimationController controller, Size size)
      : super(repaint: controller) {
    ball = Ball(size);
    aiPaddle = AIPaddle(ball);
  }

  @override
  void paint(Canvas canvas, Size size) {
    ball?.update(canvas, size);
    ball?.render(canvas, size);

    aiPaddle?.update(canvas, size);
    aiPaddle?.render(canvas, size);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
