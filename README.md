# express-library-opac

Library System With Online Public Access Catalog written in in Node/Express.

---

This web application creates an online catalog for a small local library, where admin can manage authors, categories, books and students information.And also admin will need authenticated to use above accesses.

![A diagram showing the relation of database entities in this example repository](https://raw.githubusercontent.com/sawronyhlakhine/library-opac/main/public/images/LibrarySystemERD.png)

You can view published database diagram [here(dbdiagram.io)](https://dbdocs.io/sawronyhlakhine/Library-System-With-OPAC) with password  ```RHe7gxQFt84NpBzA```.


## Quick Start

To get this project up and running locally on your computer:

1. Set up a [Node.js](https://wiki.developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment) development environment.
2. Once you have node setup install the project in the root of your clone of this repo:

   ```bash
   npm install
   ```
3. Run the server, using the appropriate command line shell for your environment:

   ```bash
   # Linux terminal
   cp .env.example .env
   DEBUG=library-opac:* npm start
   
   # Windows Powershell
   copy .env.example .env
   $ENV:DEBUG = "library-opac:*"; npm start
   ```
4. Open a browser to <http://localhost:4000/> to open the library site.

> **Note:** The library uses a default MongoDB database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). If you want to use local MongoDB then modify ENV file in the project.

## API Documentation
To get collection, import postman collection in the project or you can direct view published [postman collection](https://documenter.getpostman.com/view/2162172/2s9YsDkFDC).




