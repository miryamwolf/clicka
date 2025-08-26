# 🧾 Swagger Documentation Guidelines

This guide explains how to properly document your controllers in the `swagger.yaml` file using the OpenAPI 3.0+ standard.

## 📌 General Structure

Each controller you create should be documented under the appropriate `path` with clear and concise metadata.

Example:
```yaml
paths:
  /api/users: #need to write here the path
    get: #need to write here the method
      tags: #all the function in same controller need to be in same tag
        - Users
      summary: Get all users #short description
      responses: #need to write here the options of status that can be returned
        '200':
          description: A list of all users
```

---

## 🧩 Required Fields for Each Endpoint

For each route you document, please include the following:

### 1. `summary`
A short description of what the endpoint does.

### 2. `tags`
Use the name of the controller or module, e.g., `Auth`, `Users`, `Admin`.

### 3. `parameters` (optional)
Include if the endpoint uses query, path, or cookie parameters.

Example for cookie parameters:
```yaml
parameters:
  - name: session
    in: cookie
    required: true
    schema:
      type: string
    description: JWT session token
```

### 4. `requestBody` (for POST/PUT)
Describe the expected request body format and example.

Example:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object # or your type name, depending on your schema eg. User
        properties: 
          email:
            type: string
          password:
            type: string
```

### 5. `responses`
Always include at least:
- `200` (Success)
- `400` (Bad Request)
- `401` (Unauthorized, if needed)
- `500` (Internal Server Error)

Example:
```yaml
responses:
  '200':
    description: Successfully logged in
  '401':
    description: Invalid credentials
```

---

## 🔐 Security Schemes

If your controller requires cookies or authentication, make sure the appropriate `security` is set.

Example:
```yaml
security:
  - SessionCookie: []
```

---

## 🏗️ Defining Schemas (components > schemas)

You can define reusable object schemas under `components.schemas`.
These schemas can be referenced across your paths, request bodies, and responses.

### ✅ Example: `User` Schema
```yaml
components:
  schemas:
    User:
      type: object 
      properties:
        id:
          type: type name
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        role:
          type: string
          enum: [ADMIN, MANAGER, USER]
        googleId:
          type: string
        lastLogin:
          type: string
          format: date-time
        active:
          type: boolean
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

### 🔁 How to Use the Schema

You can reference this schema in your responses or request bodies using `$ref`:

```yaml
responses:
  '200':
    description: Returns a user object
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
```

This keeps your documentation DRY and consistent.
---

## ✍️ Using Schemas in Request Body

When your endpoint expects a JSON body, you can define the structure using an existing schema.

### ✅ Example: Using `User` Schema for Request Body

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/User'
```

You can also define a partial or custom schema directly if it's not exactly the full `User` schema.

### ✨ Example: Login Body
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          email:
            type: string
          password:
            type: string
        required: [email, password]
```

Use `$ref` whenever possible to avoid repeating the same structure in multiple places.
---

## 📁 Where to Add Your Docs

Add your route documentation under the correct path inside `swagger.yaml`.

If you're unsure where to place it:
- Follow the existing structure.
- Ask the team lead for clarification.

---

## ✅ Tips

- Use consistent naming for tags (e.g., `Users`, not `UserController`).
- Keep descriptions short but informative.
- You can use ChatGPT , but you have to check it because he have a lot of mistakes
- If you need example, you can see in the `swagger.yaml` file
---

## 📞 Questions?

If you have any questions, you can reach Lea Livshitz or refer to existing examples in the `swagger.yaml` file.