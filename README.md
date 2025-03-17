## Task Manager - Full Stack CRUD Application

### Overview :

This is a **full-stack CRUD (Create, Read, Update, Delete)** application built using **Next.js 14**, **MongoDB**, and **Tailwind CSS**. The application allows users to manage tasks with features like adding, editing, marking as complete, and deleting tasks. It is designed to be **secure**, **user-friendly**, and **responsive**.

---


>**Go Live**: [CLICK HERE]()


### Features :

- **CRUD Operations**:

  - **Create**: Add new tasks with a title, description and due date.
  - **Read**: View a list of tasks sorted by due date.
  - **Update**: Edit task details or mark tasks as complete.
  - **Delete**: Remove tasks from the list.

  ##_Note: User can not edit or delete static fallback data for security. User can only edit or delete his own tasks._##


- **User Interface**:

  - Clean and intuitive design using **Tailwind CSS**.
  - Responsive layout for seamless use on all types of devices.
  - Animations and transitions for a smooth user experience.

- **Backend**:

  - Built with **Next.js 14** (App Router).
  - Uses **MongoDB** for data storage.
  - Server-side actions for secure and efficient data handling.

- **Real-World Considerations**:

  - **Error Handling**: Graceful handling of database connection errors.
  - **Security**: Input validation and sanitization to prevent vulnerabilities.
  - **Performance**: Optimized for fast rendering and efficient data fetching.

---

### Technology Stack :

- **Frontend**:

  - Next.js 14 
  - React.js
  - Tailwind CSS
  - TypeScript

- **Backend**:

  - Next.js API Routes 
  - MongoDB 

- **Deployment**:

  - Vercel 

---

## Getting Started :

### Installation

1. **Clone the Repository**:

    ```bash

      git clone https://github.com/your-username/task-manager.git

      cd task-manager

2. **Install Dependencies**:

    ```bash
     npm install or npm install --force
      
     
3. **Set Up Environment Variables**:

 - Create a .env file in the root directory.

 - Add MONGODB_URI:your_db_connection


4. Run the Application:
  
   ```bash
    npm run dev
     # or
    npm start(for production)


### Deployment :

  The application is deployed on [Vercel]().
