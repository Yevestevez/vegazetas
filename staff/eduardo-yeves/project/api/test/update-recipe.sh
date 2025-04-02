curl -X PATCH -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MTE0ODh9.Mh6Ced7GwQABgzLRvYy1NmLZT-bcjKyZ-KCVRy5lgMk" \
-H "Content-Type: application/json" \
-d '{
  "title": "Tofu dulce",
  "description": "Descripción de la receta",
  "time": 35,
  "difficulty": "medium"
  }' http://localhost:8080/recipes/67ea59a5ecbab7201125cbde -v