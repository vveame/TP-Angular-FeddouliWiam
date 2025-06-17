export enum UserType {
  Admin = "admin",
  Member = "member",
  Guest = "guest"
}

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface ISignUpCredentials extends IUserCredentials {
  fullName: string;
}

export class User {
  private userId: string;
  private fullName: string;
  private email: string;
  private phone: number;
  private iban: string;
  private bankName: string;
  private userType: UserType;

  constructor(
    userId: string,
    fullName: string,
    email: string,
    phone: number,
    iban: string,
    bankName: string,
    userType: UserType = UserType.Member
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.iban = iban;
    this.bankName = bankName;
    this.userType = userType;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public greetUser(): string {
    switch (this.userType) {
      case UserType.Admin:
        return `Welcome Admin ${this.fullName}, you have full access.`;
      case UserType.Member:
        return `Welcome Member ${this.fullName}, enjoy your shopping.`;
      default:
        return `Welcome Guest, feel free to explore.`;
    }
  }

  public getUserId(): string {
    return this.userId;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setFullName(fullName: string): void {
    this.fullName = fullName;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPhone(): number {
    return this.phone;
  }

  public setPhone(phone: number): void {
    this.phone = phone;
  }

  public getIban(): string {
    return this.iban;
  }

  public setIban(iban: string): void {
    this.iban = iban;
  }

  public getBankName(): string {
    return this.bankName;
  }

  public setBankName(bankName: string): void {
    this.bankName = bankName;
  }

  public getUserType(): UserType {
    return this.userType;
  }

  public setUserType(userType: UserType): void {
    this.userType = userType;
  }

  public static fromJSON(data: any): User {
    console.log('fromJSON data:', data);
    
    let userTypeEnum: UserType;
    switch ((data.userType || '').toLowerCase()) {
      case 'admin':
        userTypeEnum = UserType.Admin;
        break;
      case 'member':
        userTypeEnum = UserType.Member;
        break;
      case 'guest':
      default:
        userTypeEnum = UserType.Guest;
    }

    return new User(
      data.userId,
      data.fullName,
      data.email,
      Number(data.phone),
      data.iban,
      data.bankName,
      userTypeEnum
    );
  }

  public toJSON(): any {
    return {
      userId: this.userId,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      iban: this.iban,
      bankName: this.bankName,
      userType: this.userType
    };
  }
}
