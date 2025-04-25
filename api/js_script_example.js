//example for haveibeenpwned in javascript 

async function checkEmail() {
            const email = document.getElementById('email').value;
            const resultDiv = document.getElementById('result');
            const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`;

            if (response.status === 200) {
               resultDiv.innerHTML = `Email ${email} has been pwned`;
            } else if (response.status === 404) {
                    resultDiv.innerHTML = `Email ${email} hasn't been pwned`;
            } else {
                resultDiv.innerHTML = `Error: ${response.status}`; //if anything else comes out
            }
 }