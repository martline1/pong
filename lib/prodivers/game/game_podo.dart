class GameState {
  final int playerCounter;
  final int aiCounter;

  GameState({
    this.playerCounter = 0,
    this.aiCounter = 0,
  });

  GameState fromPrevious({
    int? playerCounter,
    int? aiCounter,
  }) =>
      GameState(
        playerCounter:
            playerCounter != null ? playerCounter : this.playerCounter,
        aiCounter: aiCounter != null ? aiCounter : this.aiCounter,
      );
}
