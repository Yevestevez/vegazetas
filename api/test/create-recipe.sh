curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MTA3NjZ9.7wYKLfmptukNmTDNI8A0PGIqmR9DDqHlaMAP9h8C8LQ" \
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