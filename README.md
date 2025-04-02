# Task Manager - Full Stack Kanban Board

![Task Manager Screenshot]('./screenshot 1.png')
![Task Manager Screenshot]('./screenshot 2.png')
![Task Manager Screenshot]('./screenshot 3.png')

A complete Kanban-style task management application built with a **Laravel (GraphQL API)** backend and a **Vue.js** frontend, dockerized for easy development and deployment.

---

## 🚀 Features

- 🗂️ **Task Management**: Create, update, and delete tasks with drag-and-drop functionality
- 📊 **Multiple Columns**: Organize tasks in customizable columns
- 🔍 **GraphQL API**: Efficient data fetching with Lighthouse PHP
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔐 **User Authentication**: Secure login and registration system
- 🐳 **Dockerized**: Ready-to-run development environment

---

## 🛠️ Technology Stack

### **Frontend**
- Vue.js (Composition API)
- Pinia (State management)
- Apollo Client (GraphQL)
- Custom CSS and Tailwind CSS (Styling)
- Vue3-toastify (Notifications)

### **Backend**
- Laravel
- Lighthouse (GraphQL implementation)
- MySQL (Database)

---

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/) (For frontend development)
- [PHP 8.2+](https://www.php.net/)
- [Composer](https://getcomposer.org/) (PHP dependency manager)

---

## 🏗️ Getting Started

### **With Docker (Recommended)**

1. **Clone the repository**
   ```sh
   git clone https://github.com/ThatBoyProgrammer/taskmanager.git
   cd taskmanager
   ```

2. **Set up environment files**
   ```sh
   cp .env.example .env
   cp api/.env.example api/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Build and start containers**
   ```sh
   docker-compose up -d --build
   ```

4. **Install dependencies**
   ```sh
   docker-compose exec backend composer install
   docker-compose exec backend php artisan key:generate
   ```

5. **Run migrations**
   ```sh
   docker-compose exec backend php artisan migrate
   ```

6. **Access the application**
   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **GraphQL Playground**: [http://localhost:8000/graphql-playground](http://localhost:8000/graphql-playground)
   - **PHPMyAdmin**: [http://localhost:8081](http://localhost:8081) *(username: root, password: secret)*

---

### **Without Docker**

#### **Backend Setup**

1. **Navigate to the API directory**
   ```sh
   cd api
   ```
2. **Install dependencies**
   ```sh
   composer install
   ```
3. **Configure environment**
   ```sh
   cp .env.example .env
   php artisan key:generate
   ```
4. **Set up database**
   ```sh
   php artisan migrate
   ```
5. **Start the server**
   ```sh
   php artisan serve
   ```

#### **Frontend Setup**

1. **Navigate to the frontend directory**
   ```sh
   cd frontend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the development server**
   ```sh
   npm run dev
   ```

---

## 📂 Project Structure

```
taskmanager/
├── api/                  # Laravel backend
│   ├── app/              # Application code
│   ├── config/           # Configuration files
│   ├── database/         # Migrations and seeds
│   └── routes/           # API routes
│
├── frontend/             # Vue.js frontend
│   ├── public/           # Static assets
│   ├── src/              # Application source
│   │   ├── assets/       # Styles, images
│   │   ├── components/   # Vue components
│   │   ├── stores/       # Pinia stores
│   │   └── views/        # Page components
│   └── vite.config.js    # Vite configuration
│
├── docker-compose.yml    # Docker configuration
└── README.md             # This file
```

---

## ⚙️ Environment Variables

### **Backend (`api/.env`)**
```env
APP_NAME=TaskManager
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=taskmanager
DB_USERNAME=root
DB_PASSWORD=secret

GRAPHQL_ENDPOINT=/graphql
```

### **Frontend (`frontend/.env`)**
```env
VITE_APP_NAME=Task Manager
VITE_APP_API_URL=http://localhost:8000/graphql
```

---

## 📜 Available Commands

### **Backend (run inside `api` directory)**
```sh
php artisan migrate          # Run database migrations
php artisan lighthouse:ide   # Generate GraphQL IDE helper
php artisan optimize         # Cache configuration
```

### **Frontend (run inside `frontend` directory)**
```sh
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Lint and fix files
```

---

## 🚀 GraphQL API Examples

### **Create a Task**
```graphql
mutation {
  createTask(input: {
    title: "New Task",
    description: "Task description",
    status: "Todo",
    user_id: 1
  }) {
    id
    title
    status
  }
}
```

### **Get All Tasks**
```graphql
query {
  tasks(user_id: 1) {
    id
    title
    status
    dueDate
  }
}
```

---

## 📌 Project Link
[GitHub Repository](https://github.com/ThatBoyProgrammer/taskmanager)