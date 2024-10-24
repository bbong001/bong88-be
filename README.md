# bong88-be

## Generating an RSA Key Pair for JWT Authentication with OpenSSL

1. Generate a private key:

   ```sh
   openssl genrsa -out private_key.pem 2048
   ```

2. Extract the public key from the private key:

   ```sh
    openssl rsa -in private_key.pem -outform PEM -pubout -out public_key.pem
   ```

   This will create two files in the current directory: private_key.pem (the private key) and public_key.pem (the corresponding public key).

   Note: The key size (2048 bits in this example) can be adjusted to suit your security requirements.

3. Encode the public key in base64 encoding:

   ```sh
   openssl base64 -A -in public_key.pem -out public_key_base64.txt
   ```

   Copy the contents of the public_key_base64.txt file and paste it into the public_key_base64.txt file in .env JWT_PUBLIC_KEY variable.

4. Encode the private key in base64 encoding:

   ```sh
   openssl base64 -A -in private_key.pem -out private_key_base64.txt
   ```

   Copy the contents of the private_key_base64.txt file and paste it into the private_key_base64.txt file in .env JWT_PRIVATE_KEY variable.

5. Remove the public_key.pem, private_key.pem, public_key_base64.txt, private_key_base64.txt files.

   ```sh
   rm private_key.pem public_key.pem private_key_base64.txt public_key_base64.txt
   ```
