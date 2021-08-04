import 'package:hooks_riverpod/hooks_riverpod.dart';

// Import Own Modules
import "game_podo.dart";

class _GameNotifier extends StateNotifier<GameState> {
  _GameNotifier() : super(GameState());

  void incrementCounter({required bool ofPlayer}) {
    int newValue = 0;

    if (ofPlayer) {
      newValue = state.playerCounter + 1;

      state = state.fromPrevious(playerCounter: newValue > 99 ? 0 : newValue);
    } else {
      newValue = state.aiCounter + 1;

      state = state.fromPrevious(aiCounter: newValue > 99 ? 0 : newValue);
    }
  }
}

final gameProvider =
    StateNotifierProvider<_GameNotifier, GameState>((_) => _GameNotifier());
