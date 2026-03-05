let login=""
let domain="1secmail.com"

let lastCount=0

function random(){
return Math.random().toString(36).substring(2,10)
}

function generateEmail(){

login=random()

domain=document.getElementById("domain").value

let email=login+"@"+domain

document.getElementById("email").innerText=email

loadInbox()

}

function copyEmail(){

let email=document.getElementById("email").innerText

navigator.clipboard.writeText(email)

alert("Email copied")

}

function toggleTheme(){

document.body.classList.toggle("light")

}

async function loadInbox(){

domain=document.getElementById("domain").value

let res=await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)

let data=await res.json()

if(data.length>lastCount){

alert("📩 Email baru masuk")

}

lastCount=data.length

let html=""

let search=document.getElementById("search").value.toLowerCase()

data.forEach(mail=>{

if(mail.subject.toLowerCase().includes(search) || mail.from.toLowerCase().includes(search)){

html+=`

<tr>

<td>${mail.from}</td>

<td>${mail.subject}</td>

<td>${mail.date}</td>

<td><button onclick="readMail(${mail.id})">Open</button></td>

</tr>

`

}

})

document.getElementById("inbox").innerHTML=html

}

async function readMail(id){

let res=await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`)

let data=await res.json()

let body=data.body

let otpMatch=body.match(/\d{4,8}/)

let html=`<h3>${data.subject}</h3>

<p><b>From:</b> ${data.from}</p>

<hr>

<div>${body}</div>`

if(otpMatch){

html+=`<div class="otp">OTP: ${otpMatch[0]}</div>
<button onclick="copyOTP('${otpMatch[0]}')">Copy OTP</button>`

}

if(data.attachments.length>0){

html+="<h4>Attachments</h4>"

data.attachments.forEach(att=>{

html+=`<a href="https://www.1secmail.com/api/v1/?action=download&login=${login}&domain=${domain}&id=${id}&file=${att.filename}">${att.filename}</a><br>`

})

}

let viewer=document.getElementById("viewer")

viewer.innerHTML=html

viewer.style.display="block"

}

function copyOTP(code){

navigator.clipboard.writeText(code)

alert("OTP copied")

}

setInterval(loadInbox,5000)

generateEmail()