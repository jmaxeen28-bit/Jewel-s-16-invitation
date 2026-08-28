const envelopeWrapper = document.getElementById("openEnvelope");
const envelopeScreen = document.getElementById("envelope-screen");
const invitation = document.getElementById("invitation");
const bgMusic = document.getElementById("bgMusic");  

envelopeWrapper.addEventListener("click", function () {
    
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Audio play blocked or failed:", error);
        });
    }

    envelopeWrapper.classList.add("open");

    setTimeout(() => {
        envelopeScreen.style.opacity = "0";
    }, 1000);

    setTimeout(() => {
        envelopeScreen.style.display = "none";
        invitation.classList.add("show");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 1800);
});

const celebrationDate = new Date("October 24, 2026 15:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = celebrationDate - now;

    if (difference <= 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpOptions = document.querySelectorAll(".rsvp-option");
const submitButton = document.getElementById("submitRSVP");
const guestName = document.getElementById("guestName");
const responseBox = document.getElementById("rsvpResponse");
const responseTitle = document.getElementById("responseTitle");
const responseText = document.getElementById("responseText");

let selectedAnswer = "";

rsvpOptions.forEach(option => {
    option.addEventListener("click", function () {
        rsvpOptions.forEach(item => item.classList.remove("selected"));
        this.classList.add("selected");
        selectedAnswer = this.dataset.answer;
    });
});

const RSVP_URL = "https://script.google.com/macros/s/AKfycbwrTzcq_sCi3jp7BurQ-QT-Q4LF5z7s9eijRAOIPVJCtwh3NjFvyM1DQFOynlduyv6b/exec";

submitButton.addEventListener("click", function () {
    const name = guestName.value.trim();

    if (!name) {
        guestName.focus();
        guestName.classList.add("input-error");
        setTimeout(() => guestName.classList.remove("input-error"), 1000);
        return;
    }

    if (!selectedAnswer) {
        alert("Please choose your response first ♡");
        return;
    }

    if (!RSVP_URL) {
        alert("RSVP system is not connected yet.");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerText = "SENDING YOUR RESPONSE...";

    let iframe = document.getElementById("rsvpFrame");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "rsvpFrame";
        iframe.name = "rsvpFrame";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = RSVP_URL;
    form.target = "rsvpFrame";
    form.style.display = "none";

    const nameInput = document.createElement("input");
    nameInput.type = "hidden";
    nameInput.name = "name";
    nameInput.value = name;
    form.appendChild(nameInput);

    const responseInput = document.createElement("input");
    responseInput.type = "hidden";
    responseInput.name = "response";
    responseInput.value = selectedAnswer;
    form.appendChild(responseInput);

    const dateInput = document.createElement("input");
    dateInput.type = "hidden";
    dateInput.name = "date";
    dateInput.value = "October 24, 2026";
    form.appendChild(dateInput);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => form.remove(), 2000);

    setTimeout(() => {
        responseTitle.innerText = `Thank you, ${name}! ♡`;

        if (selectedAnswer === "Yes, I'll be there!") {
            responseText.innerText = "Yay! I'm so happy you're coming. We'll keep you updated about the meeting place and call time. ✨";
        } else if (selectedAnswer === "Maybe") {
            responseText.innerText = "No worries! Just let me know once you're sure. I'll keep you updated with the details. ✧";
        } else {
            responseText.innerText = "Aww, I'll miss you! Thank you for letting me know. ♡";
        }

        responseBox.classList.add("show");
        submitButton.innerText = "RESPONSE SENT ♡";

        guestName.disabled = true;
        rsvpOptions.forEach(option => {
            option.style.pointerEvents = "none";
        });
    }, 1200);
});
