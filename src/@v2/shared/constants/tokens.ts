export class SharedTokens {
  public static Storage = Symbol.for('Storage')
  public static Producer = Symbol.for('Producer')
  public static Context = Symbol.for('Context')
  public static Error = Symbol.for('Error')
  public static GenericRequester = Symbol.for('GenericRequester')
}
