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

## App GUI 

### signin/

![image](https://github.com/user-attachments/assets/b1cd063c-9225-45bf-b91b-f490f6ebef4b)

### signup/

![image](https://github.com/user-attachments/assets/2c8ac87f-4108-458b-9142-078f3097cd1c)

### catalog/

![image](https://github.com/user-attachments/assets/5ab8535c-4e84-47d0-92ce-8e339fc4221f)

### product-details/

![image](https://github.com/user-attachments/assets/75daadce-4ac2-41b0-bbc0-e8cb866edba7)

### shopping-cart/

![image](https://github.com/user-attachments/assets/3d85e699-0709-44d0-94e3-6d42d4294dca)

### order-page/

![image](https://github.com/user-attachments/assets/178e6dee-d595-4f17-aa8c-a0f20c6204ca)

![image](https://github.com/user-attachments/assets/142f7275-663b-441d-b7a6-636341883a61)

![image](https://github.com/user-attachments/assets/ceb961eb-c3e8-46d9-b096-5214a2620efd)

### profile/ as admin

- userType member wont have access to "Stock Monitoring", "Offer Management" and "User Management" !

![image](https://github.com/user-attachments/assets/c8b4a138-2ec2-4235-b263-25bc42c016e2)

![image](https://github.com/user-attachments/assets/519a6bb3-e5ab-4ba8-969a-91571fc23065)

![image](https://github.com/user-attachments/assets/5150ba12-03ae-4785-8540-a4f74f078a61)

### order-details/

![image](https://github.com/user-attachments/assets/0ebe2fd6-d80f-402d-a539-312f6c824926)

### stock-monitoring

![image](https://github.com/user-attachments/assets/c1fb78b2-8fdb-42d2-9fef-f0737803a350)

### offer-management/

![image](https://github.com/user-attachments/assets/48ed802e-ec63-4389-a4bb-2d625e082fb8)

![image](https://github.com/user-attachments/assets/94a63726-e0e7-45d0-ae06-7d91f99c430e)

### user-management/

![image](https://github.com/user-attachments/assets/05bc09a7-00d8-4730-a5ce-a06e3321b5fa)

### i18n internationalization/arabic

![image](https://github.com/user-attachments/assets/c24e7a48-ff45-4bda-bc10-0f84b40ac00c)

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
