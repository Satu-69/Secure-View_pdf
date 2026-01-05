# Secure-View_pdf
A Python-based secure PDF handling tool that allows users to encrypt PDFs, restrict access using view limits, and automatically delete files after a defined time or view count. This project is ideal for sharing sensitive documents securely with controlled access.
# 🔐 Secure PDF Encryption Tool

A **Python-based secure PDF handling tool** that allows users to encrypt PDFs, restrict access using **view limits**, and automatically **delete files after a defined time or view count**. This project is ideal for sharing sensitive documents securely with controlled access.

---

## 📸 Application Preview
<img width="1686" height="1017" alt="Screenshot 2026-01-02 191340" src="https://github.com/user-attachments/assets/eacb5205-d8b8-4131-b564-c1b50239775f" />

<img width="575" height="913" alt="Screenshot 2026-01-02 191411" src="https://github.com/user-attachments/assets/5c793e97-d7b1-4384-9ebe-5606b9a7f6b8" />


---

## 🚀 Features

✅ **PDF Encryption** using a secure password
✅ **View Limit Control** (self-destruct after X views)
✅ **Automatic Deletion Timer** (time-based expiry)
✅ **One-time or limited access PDFs**
✅ **User-friendly Web UI**
✅ **Built using Python + Flask**
✅ **Uses PyPDF2 for PDF handling**

---

## 🧠 How It Works

1. Upload a PDF file.
2. Set:

   * Password
   * Maximum number of views
   * Deletion timer (in seconds)
3. The PDF is encrypted and saved securely.
4. Each access decreases the remaining view count.
5. When views reach **0** or time expires — the file is **automatically deleted**.

This ensures **controlled document access** and **prevents unauthorized sharing**.

---

## 🧰 Tech Stack

| Component     | Technology                |
| ------------- | ------------------------- |
| Backend       | Python                    |
| Web Framework | Flask                     |
| PDF Handling  | PyPDF2                    |
| Frontend      | HTML, CSS, JavaScript     |
| Security      | Password-based encryption |

---

## 📂 Project Structure

<img width="372" height="152" alt="Screenshot 2026-01-02 193848" src="https://github.com/user-attachments/assets/420726cd-fc14-4d24-b56d-83a6348c1a10" />

  ------------------------------------------------------------------------------------------------------------------------
<img width="377" height="422" alt="image" src="https://github.com/user-attachments/assets/e99cff1e-f61d-4ad2-a862-b8787a87522a" />


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/secure-pdf-tool.git
cd secure-pdf-tool
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run the Application

```bash
python app.py
```

### 4️⃣ Open in Browser

```
http://127.0.0.1:5000
```

---

## 🔐 Security Features

* AES-based PDF encryption
* Password-protected access
* Auto deletion after defined time
* Max-view enforcement
* Prevents unauthorized reuse

---

## 🧪 Example Use Cases

* Sharing **certificates** securely
* Sending **confidential reports**
* One-time access documents
* Secure academic or legal document transfer

---

## 🧩 Future Enhancements

* Email-based secure link sharing
* OTP-based PDF access
* Cloud storage support (AWS / Firebase)
* Admin dashboard
* Logging & access analytics

---

## 🧑‍💻 Developed By

**Satvik Trivedi**



---

## ⭐ Support

If you like this project, don’t forget to ⭐ star the repository and share it with others!

---

> *"Security is not a product, but a process."*
