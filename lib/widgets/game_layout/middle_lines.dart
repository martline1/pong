import "package:flutter/material.dart";

class MiddleLines extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) => Container(
        width: constraints.maxWidth,
        height: constraints.maxHeight,
        child: CustomPaint(
          painter: _MiddleLinesPainter(),
        ),
      ),
    );
  }
}

class _MiddleLinesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const Size rectSize = Size(10, 15);
    const double marginBottom = 20.0;

    for (int i = 0; i < size.height; i++) {
      // Middle of the screen
      double dx = (size.width / 2) - (rectSize.width / 2);

      // One after the other with a marginBottom
      double dy = (rectSize.height * i) + (marginBottom * i);

      Rect rect = Offset(dx, dy) & rectSize;

      canvas.drawRect(rect, Paint()..color = Colors.white);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
