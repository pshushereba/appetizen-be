curl --location --request POST 'https://appetizen-be.herokuapp.com/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "patrick",
	"password": "password",
	"first_name": "Patrick",
    "last_name": "Shushereba",
	"email": "patrick@test.com",
    "role": "user",
    "avatar_img": null
}'