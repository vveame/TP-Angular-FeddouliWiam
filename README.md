# TP-Angular-FeddouliWiam

## Personal Informations

- Full Name : Feddouli Wiam

- Inscription Num : DCC0001/24

## Downloaded dependencies

- cookie-parser

```bash
npm install cookie-parser
```

- JWT (JSON Web Token)

```bash
npm install jsonwebtoken
```

- node-fetch & Fetching products from DummyJSON

```bash
npm install node-fetch
node dummyJSON.js
```

- Generate JWT_SECRET & dotenv

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 
npm install dotenv
```

- Leaflet

```bash
npm install @types/leaflet
```

- i18n (internationalization)

```bash
ng add @angular/localize
ng extract-i18n --output-path src/locale
npx xlf-auto-translate -i messages.xlf -o messages.fr.xlf -f en -t fr
ng build --localize
```

## Application GUI 

### - signin/

![image](https://github.com/user-attachments/assets/a897eb36-5185-480a-8881-3917944f0109)

### - signup/

![image](https://github.com/user-attachments/assets/11b93c5c-7178-4ddc-b9bd-11cc83c100d3)

### - catalog/

![image](https://github.com/user-attachments/assets/5ab8535c-4e84-47d0-92ce-8e339fc4221f)

![image](https://github.com/user-attachments/assets/d64d7022-9765-4568-b242-cf534d15ac30)

### - product-details/

![image](https://github.com/user-attachments/assets/bfcdc50c-d5cf-47c4-98f9-ce95db24db31)

### - shopping-cart/

![image](https://github.com/user-attachments/assets/3d85e699-0709-44d0-94e3-6d42d4294dca)

### - order-page/

![image](https://github.com/user-attachments/assets/178e6dee-d595-4f17-aa8c-a0f20c6204ca)

![image](https://github.com/user-attachments/assets/142f7275-663b-441d-b7a6-636341883a61)

![image](https://github.com/user-attachments/assets/ceb961eb-c3e8-46d9-b096-5214a2620efd)

### - profile/ as admin

- userType member wont have access to "Stock Monitoring", "Offer Management" and "User Management" !

![image](https://github.com/user-attachments/assets/36730277-cdd0-4e91-8c94-08d20fee1114)

![image](https://github.com/user-attachments/assets/79b0ba42-fa13-4657-8e4a-a8f478e1ca9d)

![image](https://github.com/user-attachments/assets/efe1eee3-f190-465a-9c77-8915ef51ec2b)

### - order-details/

![image](https://github.com/user-attachments/assets/20c5992a-c0d4-4ce8-91eb-387a35b658d2)

### - stock-monitoring/

![image](https://github.com/user-attachments/assets/5c1a2090-1618-4f9c-9865-0413c318a6a4)

### - offer-management/

![image](https://github.com/user-attachments/assets/48ed802e-ec63-4389-a4bb-2d625e082fb8)

![image](https://github.com/user-attachments/assets/94a63726-e0e7-45d0-ae06-7d91f99c430e)

### - user-management/

![image](https://github.com/user-attachments/assets/b9b8c3ca-7b82-41ad-b817-2f071b685d8b)

### - i18n internationalization/arabic

![image](https://github.com/user-attachments/assets/5f4ae517-7492-4ce8-902c-f4f782cd90c1)

# Auto generated Angular ReadME.md

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
