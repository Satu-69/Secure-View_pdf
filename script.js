let remainingViews;
let countdownTimer;
let timeLeft;
let pdfWindow = null; // Track the PDF tab
let countdownRunning = false; // ✅ Track if the countdown is running

// SweetAlert Custom Theme
const swalConfig = {
    background: "rgba(0, 0, 0, 0.5)", // 🔥 Transparent glass effect
    color: "#fff", // White text for visibility
    confirmButtonColor: "#1db954", // Green confirm button
    backdrop: "rgba(0, 0, 0, 0.3)", // Slight dim effect for contrast
};

// Update slider label dynamically
function updateViewCount() {
    let slider = document.getElementById("maxViews");
    let label = document.getElementById("viewCountLabel");
    label.innerText = slider.value + " Views";
}

// ✅ Live Password Strength Bar
function checkPasswordStrength() {
    let password = document.getElementById("password").value;
    let strengthBar = document.getElementById("passwordStrength");
    let strengthText = document.getElementById("passwordStrengthText");

    let strength = 0;
    if (password.length >= 6) strength++; // Length check
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++; // Upper & Lowercase check
    if (password.match(/[0-9]/)) strength++; // Number check
    if (password.match(/[$@#&!%^*]/)) strength++; // Special character check

    // Apply styles based on strength
    if (strength === 0) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "gray";
        strengthText.innerText = "";
    } else if (strength === 1) {
        strengthBar.style.width = "33%";
        strengthBar.style.backgroundColor = "red";
        strengthText.innerText = "Weak";
    } else if (strength === 2 || strength === 3) {
        strengthBar.style.width = "66%";
        strengthBar.style.backgroundColor = "orange";
        strengthText.innerText = "Medium";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "green";
        strengthText.innerText = "Strong";
    }
}

// ✅ Start countdown timer and stop if views reach 0
function startTimer() {
    let countdownDisplay = document.getElementById("countdownTimer");
    timeLeft = parseInt(document.getElementById("deleteDelay").value);
    countdownRunning = true;

    function updateCountdown() {
        if (timeLeft > 0 && countdownRunning) {
            timeLeft--;
            countdownDisplay.innerText = timeLeft + "s";
            setTimeout(updateCountdown, 1000);
        } else if (timeLeft === 0) {
            Swal.fire({
                ...swalConfig,
                icon: "warning",
                title: "⏳ Timeout Reached!",
                text: "PDF auto-deleted due to timeout.",
            });
            deletePDF();
        }
    }
    updateCountdown();
}

// ✅ Stop timer when views reach 0
function stopTimer() {
    countdownRunning = false;
    document.getElementById("countdownTimer").innerText = "0s"; // Reset timer UI
}

// Encrypt PDF
function encryptPDF() {
    let fileInput = document.getElementById('pdfFile').files[0];
    let savePath = document.getElementById('savePath').value.trim();
    let password = document.getElementById('password').value.trim();
    let maxViews = parseInt(document.getElementById('maxViews').value);
    let deleteDelay = document.getElementById('deleteDelay').value;

    if (!fileInput || !savePath || !password) {
        Swal.fire({
            ...swalConfig,
            icon: "error",
            title: "⚠️ Missing Fields!",
            text: "Please fill in all fields.",
        });
        return;
    }

    let formData = new FormData();
    formData.append('pdfFile', fileInput);
    formData.append('savePath', savePath);
    formData.append('password', password);
    formData.append('maxViews', maxViews);
    formData.append('deleteDelay', deleteDelay);

    fetch('/encrypt', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                ...swalConfig,
                icon: "success",
                title: "🔐 PDF Encrypted!",
                text: data.message,
            });
            remainingViews = maxViews;
            document.getElementById("remainingViews").innerText = remainingViews;
            startTimer();
        })
        .catch(error => Swal.fire({ ...swalConfig, icon: "error", title: "❌ Error!", text: error }));
}

// ✅ Stop countdown if views reach 0 and delete PDF
function openPDF() {
    if (remainingViews < 0) {
        Swal.fire({
            ...swalConfig,
            icon: "error",
            title: "🚫 Access Denied!",
            text: "Max views reached. PDF auto-deleted.",
        });
        return;
    }

    if (!pdfWindow || pdfWindow.closed) {
        fetch('/open', { method: 'GET' })
            .then(response => {
                if (response.status === 403) {
                    throw new Error("Max views reached. PDF auto-deleted.");
                }
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Failed to open PDF.");
                    });
                }
                return response.blob();
            })
            .then(blob => {
                let url = URL.createObjectURL(blob);
                pdfWindow = window.open(url);
                localStorage.setItem("pdf_opened", "true");

                remainingViews--;
                document.getElementById("remainingViews").innerText = remainingViews;

                if (remainingViews < 0) {
                    stopTimer();
                    setTimeout(() => {
                        Swal.fire({
                            ...swalConfig,
                            icon: "info",
                            title: "🔒 Max Views Reached!",
                            text: "PDF auto-deleted.",
                        });
                        deletePDF();
                    }, 3000);
                }
            })
            .catch(error => Swal.fire({ ...swalConfig, icon: "error", title: "❌ Error!", text: error.message }));
    } else {
        Swal.fire({
            ...swalConfig,
            icon: "warning",
            title: "📂 Already Open!",
            text: "PDF is already open in another tab. Close it first before opening again.",
        });
    }
}

// Delete PDF
function deletePDF() {
    fetch('/delete', { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                ...swalConfig,
                icon: "info",
                title: "🗑️ PDF Deleted!",
                text: data.message,
            });
            remainingViews = 0;
            document.getElementById("remainingViews").innerText = "0";
            document.getElementById("countdownTimer").innerText = "0s"; // ✅ Stop timer UI
            countdownRunning = false;
            pdfWindow = null;
            localStorage.removeItem("pdf_opened");
        })
        .catch(error => Swal.fire({ ...swalConfig, icon: "error", title: "❌ Error!", text: error }));
}

// ✅ Delete PDF when refreshing or closing tab
window.addEventListener("beforeunload", function () {
    if (localStorage.getItem("pdf_opened") === "true") {
        navigator.sendBeacon('/delete');
    }
});

function checkPasswordStrength() {
    let password = document.getElementById("password").value;
    let strengthBar = document.getElementById("passwordStrength");
    let strengthText = document.getElementById("passwordStrengthText");

    let strength = 0;

    if (password.length >= 8) strength++; // Length >= 8
    if (/[A-Z]/.test(password)) strength++; // Uppercase letter
    if (/[a-z]/.test(password)) strength++; // Lowercase letter
    if (/[0-9]/.test(password)) strength++; // Number
    if (/[\W]/.test(password)) strength++; // Special character

    switch (strength) {
        case 0:
        case 1:
            strengthBar.style.width = "20%";
            strengthBar.style.backgroundColor = "red";
            strengthText.innerText = "Weak ❌";
            break;
        case 2:
        case 3:
            strengthBar.style.width = "50%";
            strengthBar.style.backgroundColor = "orange";
            strengthText.innerText = "Medium ⚠️";
            break;
        case 4:
        case 5:
            strengthBar.style.width = "100%";
            strengthBar.style.backgroundColor = "green";
            strengthText.innerText = "Strong ✅";
            break;
    }
}
