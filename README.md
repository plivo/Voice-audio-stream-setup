# To set up Audio Stream for Voice Bot please follow the below steps

## Buy Phone Numbers from Plivo and Attach the Application: 

Phone numbers can be bought from the “Phone numbers” Tab of Plivo Console
<img width="1425" alt="Screenshot 2024-10-21 at 6 37 41 PM" src="https://github.com/user-attachments/assets/fe6b4c29-6573-44b1-b518-1f5c39d3c223">

Create a new XML Application from Voice Tab. Add “Primary answer URL” and “Hangup URL”
<img width="1425" alt="Screenshot 2024-10-21 at 6 38 45 PM" src="https://github.com/user-attachments/assets/42a01f8f-696b-4295-a965-ab9d90692b7a">

Attach this XML application with the Phone number and Update the number
<img width="1425" alt="Screenshot 2024-10-21 at 6 39 13 PM" src="https://github.com/user-attachments/assets/62b8e09b-a4df-434f-99b1-30d2b72fee50">

## Use Ngrok to expose the local server to the internet:
Install ngrok and run
```
ngrok http 8080
```

## The above steps can be achieved through APIs as well:

1. Search for Available Numbers (if you don't already know which one to buy):  Replace {AUTH_ID} with your Plivo Auth ID, {AUTH_TOKEN} with your Plivo Auth Token

```
curl -i -X GET "https://api.plivo.com/v1/Account/{AUTH_ID}/PhoneNumber/?country_iso=US&type=local" \
-u {AUTH_ID}:{AUTH_TOKEN}
```

2. Create XML application: Replace {AUTH_ID} with your Plivo Auth ID, {AUTH_TOKEN} with your Plivo Auth Token and update “answer_url” and “hangup_url”

```
curl -i -X POST https://api.plivo.com/v1/Account/{AUTH_ID}/Application/ \
-u {AUTH_ID}:{AUTH_TOKEN} \
-H "Content-Type: application/json" \
-d '{ "app_name": "Voice-Bot", "answer_url": "https://4964-49-37-240-174.ngrok-free.app/answer_xml", "answer_method": "GET", "hangup_url": "https://4964-49-37-240-174.ngrok-free.app/hangup", "hangup_method": "POST" }'

Response:
{
  "api_id": "9d55ab63-ccf1-498e-89f3-6deb4b9a3c85",
  "app_id": "16525344707489756",
  "message": "created"
}
```

3. Buy a Phone Number: Replace {AUTH_ID} with your Plivo Auth ID, {AUTH_TOKEN} with your Plivo Auth Token, and {phone_number} with the number you want to purchase {APP_ID} from previous response

```
curl -i -X POST "https://api.plivo.com/v1/Account/{AUTH_ID}/PhoneNumber/{phone_number}/" \
-u {AUTH_ID}:{AUTH_TOKEN} \
-H "Content-Type: application/json" \
-d '{"app_id": "{APP_ID}"}'
```



## Sample XML format for Plivo Audio stream:
The following XML creates a bidirectional audio stream and records the call: Store the XML file as stream.xml, which can be later used on the server.
```
<Response>
        <Record action="https://4964-49-37-240-174.ngrok-free.app/get_recording/" redirect="false" recordSession="true" maxLength="3600" />
        <Stream bidirectional="true" streamTimeout="120" contentType="audio/x-mulaw;rate=8000" keepCallAlive="true" statusCallbackUrl="https://4964-49-37-240-174.ngrok-free.app/ss">wss://5c53-2600-1f18-2653-ce05-21d3-2211-6985-5f50.ngrok-free.app/ws</Stream>
</Response>
```

## Inbound Call:

   Dial to the phone number purchased in the Plivo, It gets connected to the Audio stream, you will hear your audio back.


## Outbound Call:

   To Make the outbound call, Use the phone number purchased in the Plivo as the caller-ID or FROM  number and dial to your number in one of the following ways.


Make outbound call using curl: Replace {AUTH_ID} with your Plivo Auth ID, {AUTH_TOKEN} with your Plivo Auth Token, and {PLIVO_NUMBER} with the number purchased from Plivo {DIAL_NUMBER} to number you want to dial

```
curl -i -X POST https://api.plivo.com/v1/Account/{AUTH_ID}/Call/ \
-u {AUTH_ID}:{AUTH_TOKEN} \
    -H "Content-Type: application/json" \
    -d '{"to": "{DIAL_NUMBER}","from": "{PLIVO_NUMBER}", "answer_url": "https://4964-49-37-240-174.ngrok-free.app/xml", "answer_method": "GET"}'	
```


