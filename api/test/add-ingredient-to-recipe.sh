curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MDg4NzZ9.oPmfXPlILgeIHpSFvfcplOUVrFjbZa4jZinDa_qgjNg" \
-H "Content-Type: application/json" \
-d '{"name": "Limón",
    "quantity": 50,
    "unit": "ml",
    "annotation": "Ácido",
    "main": true}' http://localhost:8080/recipes/67ea945619ca1fadc87e88d3/ingredients -v