from flask import Flask, request, jsonify, render_template, send_file
import os
import threading
import time
from PyPDF2 import PdfWriter, PdfReader

app = Flask(__name__, static_folder="static", template_folder="templates")

encrypted_pdf_path = None
max_views = 0
view_count = 0
delete_timer_active = False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt_pdf():
    global encrypted_pdf_path, max_views, view_count, delete_timer_active
    file = request.files['pdfFile']
    save_path = request.form['savePath']
    password = request.form['password']
    max_views = int(request.form['maxViews']) - 1  # Display maxViews -1 but store the real value
    delete_delay = int(request.form['deleteDelay'])
    view_count = 0

    encrypted_pdf_path = os.path.join("uploads", save_path + ".pdf")
    input_pdf_path = os.path.join("uploads", "input_" + file.filename)
    file.save(input_pdf_path)

    try:
        pdf_writer = PdfWriter()
        pdf_reader = PdfReader(input_pdf_path)

        for page in pdf_reader.pages:
            pdf_writer.add_page(page)

        pdf_writer.encrypt(user_password=password, owner_password=password, use_128bit=True)

        with open(encrypted_pdf_path, 'wb') as out_file:
            pdf_writer.write(out_file)

        os.remove(input_pdf_path)

        if not delete_timer_active:
            delete_timer_active = True
            threading.Thread(target=delete_after_delay, args=(delete_delay,)).start()

        return jsonify({"message": "PDF encrypted successfully!"})

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

def delete_after_delay(seconds):
    global encrypted_pdf_path, delete_timer_active, view_count, max_views
    time.sleep(seconds)

    if encrypted_pdf_path and os.path.exists(encrypted_pdf_path):
        os.remove(encrypted_pdf_path)
        encrypted_pdf_path = None
        delete_timer_active = False
        view_count = 0
        max_views = 0
        print("PDF auto-deleted due to timeout.")

@app.route('/open', methods=['GET'])
def open_pdf():
    global view_count, max_views, encrypted_pdf_path

    if encrypted_pdf_path and os.path.exists(encrypted_pdf_path):
        if view_count >= max_views:
            os.remove(encrypted_pdf_path)
            encrypted_pdf_path = None
            return jsonify({"message": "Max views reached. PDF auto-deleted."}), 403

        view_count += 1
        return send_file(encrypted_pdf_path, as_attachment=True)

    return jsonify({"message": "PDF not found or already deleted."}), 404

@app.route('/delete', methods=['DELETE'])
def delete_pdf():
    global encrypted_pdf_path, view_count, max_views

    if encrypted_pdf_path and os.path.exists(encrypted_pdf_path):
        os.remove(encrypted_pdf_path)
        encrypted_pdf_path = None
        view_count = 0
        max_views = 0
        return jsonify({"message": "PDF deleted successfully"})

    return jsonify({"message": "No encrypted PDF to delete"}), 404

if __name__ == '__main__':
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    app.run(debug=True)  

@app.route('/view', methods=['GET'])
def view_pdf():
    global view_count, max_views, encrypted_pdf_path

    if encrypted_pdf_path and os.path.exists(encrypted_pdf_path):
        if view_count >= max_views:
            os.remove(encrypted_pdf_path)  # Auto-delete after max views
            encrypted_pdf_path = None
            return jsonify({"message": "Max views reached. PDF auto-deleted."}), 403

        view_count += 1
        
        # PDF view in browser (inline)
        return send_file(encrypted_pdf_path, as_attachment=False)

    return jsonify({"message": "PDF not found or already deleted."}), 404
