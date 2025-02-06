export class SharedTokens {
  public static Storage = Symbol.for('Storage');
  public static Email = Symbol.for('Email');
  public static Jwt = Symbol.for('Jwt');
  public static Google = Symbol.for('Google');
  public static Hash = Symbol.for('Hash');
  public static Producer = Symbol.for('Producer');
  public static Context = Symbol.for('Context');
  public static Error = Symbol.for('Error');
  public static GenericRequester = Symbol.for('GenericRequester');
  public static FileRequester = Symbol.for('FileRequester');
}
