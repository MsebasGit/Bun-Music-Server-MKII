curl -X POST \
   http://localhost:3000/api/v1/albums \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc2NTc1MTYxMywiaWF0IjoxNzY1MTQ2ODEzfQ.v7bYxMDTFSkAkSEdVc5MJn1J6egcaKYappjsGCHbz-0" \
   -H "Content-Type: multipart/form-data" \
   -F "name=Test Album 1" \
   -F "cover_image=@/home/bass/Pictures/Covers/OIP4.png" \