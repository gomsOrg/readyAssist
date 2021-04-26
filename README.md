# Ready Assist Parking Lot

# cURL commands to test the API's

Add vehicle to the slot and get the token/parking slot ID: (EX: A1 - 4 means Parking Lot A, 1st floor and slot number 4)
curl --location --request PUT 'http://localhost:3000/add' \
--header 'Content-Type: application/json' \
--data-raw '{
    "status": "full",
    "slot": "4",
    "storey": "B2",
    "vehicle": "bus",
    "userData": {
        "name": "Mal",
        "mobile": "7412369850",
        "vehicleNumber": "74123",
        "intime": "2021-04-25 08:05:25",
        "info": "parked"
    }
}'

Search slot for bike:
curl --location --request GET 'http://localhost:3000/searchSlot?type=bike&status=free'

Search slot for car:
curl --location --request GET 'http://localhost:3000/searchSlot?type=car&status=free'

Search slot for bus:
curl --location --request GET 'http://localhost:3000/searchSlot?type=bus&status=free'

Exit parking slot:
curl --location --request PUT 'http://localhost:3000/exit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "slot": "2",
    "storey": "A1"
}'
Exit parking slot for bus:
curl --location --request PUT 'http://localhost:3000/exit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "slot": "2",
    "storey": "A1",
    "vehicle": "bus"
}'

# Sample data to import and test the API's from MongoDB
parkinglot.json has the sample data for testing. It can be used to import data into the Mongo DB collection called slotDatas (as per the modal name). 

# The sample data format is done based on the below consideration for the prototype server
1. 2 parking lots - A and B
2. Each lot has 3 floors - A1, A2, A3 and B1, B2, B3