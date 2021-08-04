import "package:flutter/material.dart";

class CustomNumber extends StatelessWidget {
  final int value;

  final Map<int, List<int>> valuesMap = {
    0: [1, 0, 1, 1, 1, 1, 1],
    1: [0, 0, 0, 0, 0, 1, 1],
    2: [1, 1, 1, 0, 1, 1, 0],
    3: [1, 1, 1, 0, 0, 1, 1],
    4: [0, 1, 0, 1, 0, 1, 1],
    5: [1, 1, 1, 1, 0, 0, 1],
    6: [1, 1, 1, 1, 1, 0, 1],
    7: [1, 0, 0, 0, 0, 1, 1],
    8: [1, 1, 1, 1, 1, 1, 1],
    9: [1, 1, 1, 1, 0, 1, 1],
  };

  CustomNumber({required this.value});

  Color showColor(int valueIndex) =>
      valueIndex == 1 ? Colors.white : Colors.transparent;

  Widget renderConstructedNumber(int index) {
    final List<int> values = valuesMap[index] ?? [1, 0, 1, 1, 1, 1, 1];

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 7),
      child: Container(
        width: 60,
        height: 80,
        child: Stack(
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(color: showColor(values[0]), height: 15),
                Container(color: showColor(values[1]), height: 15),
                Container(color: showColor(values[2]), height: 15),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    Container(
                        width: 15, color: showColor(values[3]), height: 40),
                    Container(
                        width: 15, color: showColor(values[4]), height: 40),
                  ],
                ),
                Column(
                  children: [
                    Container(
                        width: 15, color: showColor(values[5]), height: 40),
                    Container(
                        width: 15, color: showColor(values[6]), height: 40),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String valueString = value.toString().padLeft(2, "0");

    final int first = int.parse(valueString[0]);
    final int second = int.parse(valueString[1]);

    return Row(
      children: [
        renderConstructedNumber(first),
        renderConstructedNumber(second),
      ],
    );
  }
}
