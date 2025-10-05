# SalamatDoc - ITS120L Project

Course Project for the Application Development and Emerging Technologies course. Includes CRUD, Login, and Register.

## Setup
1. Clone or pull the latest version of the repository.
2. Install dependencies.

    ```npm install```

    ```npm install -g firebase-tools```
3. Login to your Firebase account.

    ```firebase login```
4. Link the local folder to the Firebase project

    ```firebase use salamatdoc-its120l-project```
    - To check sucessful linking, run this command:

        ```firebase use```
    - It should print: ```Active Project: salamatdoc-its120l-project```

## Deployment
1. The project is connected to Firebase Hosting through GitHub Actions. Pushing to the GitHub repository will **automatically update** the deployment.

    - If needed, the manual deployment command in GitBash is: ```firebase deploy```

2. Check the latest version of the app on the deployment URL: https://salamatdoc-its120l-project.web.app

## Testing
### Pull Request Previews
- Whenever someone opens or updates a pull request (PR), a temporary preview deployment will be created.
- Firebase posts a comment in the PR with a unique preview URL. This will allow you to **test changes live before merging**. Preview URLs are temporary and disappear when the PR is closed.
### Live Functional Testing
This uses the actual Firebase project linked in the setup. Inform and consult the group if you'd want to integrate emulators to enable local / offline testing.
- *Example:* Login/Register
  - Go to the login or register page.
  - Create an account. This will show up in Firebase Console under **Authentication**.
  - Log in with the same credentials. Firebase Auth will manage the session automatically.

- *Example:* CRUD Operations
  - Perform CRUD actions in the app.
  - Check the Firebase Console under Firestore Database to confirm data changes.