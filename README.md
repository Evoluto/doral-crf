# Time Card

### Currently Using Angular 8.2

The documentation describes how to switch the existing credentials to target your own Box Developer and AWS accounts.

## Prerequisites
* [Angular CLI](https://cli.angular.io/)
* [Node.js](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)


#### Angular 8 Application Configuration
##### Step 1. Download the project dependencies
1. Use `npm install` to download the needed depenedencies for this project.
2. Don't forget to install the [Angular CLI](https://cli.angular.io/) if you haven't already.

##### Step 2. Add environment variables to the Angular App
1. Navigate to `src > environments` and change the `environment.ts` file to the values from your AWS Cognito User Pool, Federated Identity pool, and Client Application.
2. Build and run your app by using the `ng serve` command from the root directory.
3. Navigate your browser to `http://localhost:4200`.

#### Angular CLI Commands
##### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


##### Build
Run `ng build` to build the project. The build artifacts will be stored in the `angular-build/` directory. Use the `-prod` flag for a production build.
Run application from build using npm start