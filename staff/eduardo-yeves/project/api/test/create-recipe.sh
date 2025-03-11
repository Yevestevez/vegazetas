curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2QwMzJiNTkxNmJkNTY1OTdjYjZlYWQiLCJpYXQiOjE3NDE2OTc3NDJ9.e-EMt2OuT7PUHvGH1xj5abKUbxHXYa6C0G6QNrnZoiE" \
-H "Content-Type: application/json" \
-d '{
  "title": "Tofu coreano8",
  "images": [
    "https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg",
    "https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano-4.jpg"
  ],
  "description": "Descripción de la receta",
  "time": 35,
  "difficulty": "easy",
  "tags": ["tofu", "coreano", "arroz", "picante"],
  "ingredients": ["tofu", "arroz", "cebolla", "salsa de soja"],
  "steps": [
    {
      "text": "sofríe la cebolla con un poco de aceite"
    }
  ]
}' http://localhost:8080/recipes -v