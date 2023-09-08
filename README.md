# Implementation decisions

The frontend components of the project are only three:
- The **App** component, i.e., the `main component`;
- A reusable **PasswordCardDisplay** component, used for displaying
  each password card on the page;
- A resuable **PasswordCardForm** component, used for editing and
  creating password cards;

Alongside those, a single `model.ts` file contains the `TypeScript`
data definition for a password card content.

A simplified version of the project's files tree can be read as:
```
├── build/                              The static files produced by building the project
├── docker-compose.yaml
├── nginx.conf                          The web server's configuration
├── package.json                        The javascript dependencies
└── src/
    ├── App.tsx                         The main component
    ├── components/
    │   ├── PasswordCardDisplay.tsx     The reusable card display component
    │   └── PasswordCardForm.tsx        The reusable card form component
    └── model.ts                        The card content data definition
```

# Project dependencies

- This project was built using **Node.js v18.17.1**
- The react library dependencies are listed in the **package.json**
  file (Note: a couple of `Material UI` components were used );
- A **docker-compose** recipe is also provided in this repository
  (**It is recommended to use it for running the project**)
- The only **hard dependencies** are **docker/docker-compose**

# Running

The simplest form of running this project, is bringing the web
server's (i.e., the **NGINX**) container up:
```
> docker-compose up -d nginx
```

As long as the `backend` is up and running at port `8080`, you should
be able to open your browser at `http://localhost:8000` and see the
user interface.

# Building

If you'd like to rebuild the static files, the recommended steps are:

- Bring the `nodejs` container up:
```
> docker-compose up -d nodejs
```

- Execute the install and build commands:
```
> docker-compose exec nodejs sh -c "npm install"" #this will take alittle while
> docker-compose exec nodejs sh -c "npm run build"
```

The new static files should be available the the **./build**
directory.

# Testing strategy

- Some Q/A and integration tests could be performed/implemented and
  automated through some tool like `Selenium` or `Cypress`;
- Some unit tests could be implemented for the react componentes;
