curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2VhNTlhNWVjYmFiNzIwMTEyNWNiYzciLCJpYXQiOjE3NDM2MDg4NzZ9.oPmfXPlILgeIHpSFvfcplOUVrFjbZa4jZinDa_qgjNg" \
-H "Content-Type: application/json" \
-d '{"text": "Este es un texto de prueba para el paso",
    "note": "esto es una nota para el paso",
    "unit": "ml",
    "image": "https://danzadefogones.com/wp-content/uploads/2018/01/Tofu-picante-estilo-coreano.jpg"}' http://localhost:8080/recipes/67ea945619ca1fadc87e88d3/steps -v