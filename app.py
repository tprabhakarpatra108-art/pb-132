from flask import Flask, request, jsonify, send_from_directory
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='.')

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Resume Content for Context (Ideally load from data.js or JSON, but hardcoding for simplicity/robustness here)
RESUME_CONTEXT = """
My name is T Prabhakar Patra. I am a Data Analytics & Python Programmer.
Email: tprabhakarpatra108@gmail.com
Phone: +91 9776009411
Location: Brahmapur, Odisha, India
LinkedIn: https://in.linkedin.com/in/t-prabhakar-patra-7081953ab

Summary:
Dedicated Data Analytics and Python Programmer with internship experience. Proficient in Python for data manipulation, analysis, and automation. Skilled in libraries like Pandas, NumPy, Matplotlib, Seaborn, and Scikit-learn. Committed to leveraging data analytics and AI for impactful decision-making.

Experience:
1. Data Analytics Intern at Engineering College, Kalahandi: Cleaned and analyzed customer datasets using SQL queries and Python scripts. Reduced data processing time by 25% through optimized ETL pipelines. Developed ML prototypes for customer segmentation (85% accuracy). Conducted A/B testing aimed at boosting ROI by 10-20%.
2. Project Lead (Academic) for QR Code Scanner App: Spearheading a mobile-friendly application using Python (OpenCV, Pyzbar) and Flask. Features real-time scanning, data extraction, and an analytics dashboard. Implemented CI/CD practices.

Education:
B.Tech in Computer Science from Vignan Institute of Technology and Management, Berhampur, Odisha (09/2023 - Present)

Skills:
Technical: Python, SQL (MySQL, PostgreSQL), Data Analytics, Machine Learning, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Tableau, Plotly, Flask, OpenCV, Git/GitHub.
Soft: Communication, Team Leadership, Time Management, Problem-Solving.

Projects:
- QR Code Scanner App: Real-time scanning, data extraction, and analytics dashboard using Python, OpenCV, Flask, Tkinter.
- Customer Behavior Analysis: Identified patterns resulting in a 15% improvement in retention strategies using Python, Scikit-learn.

Certifications:
- Microsoft: Getting started with PowerPoint
- IBM & Adobe: Excel and Analytics Foundations
- IOT under Enterpreneurship Devlopment programme scheme(EDSP)
"""

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful assistant for T Prabhakar Patra's portfolio. You answer questions about his professional background based ONLY on the following resume context. Be concise, professional, and friendly. Context: {RESUME_CONTEXT}"
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.5,
            max_tokens=200,
            top_p=1,
            stream=False,
            stop=None,
        )

        bot_reply = completion.choices[0].message.content
        return jsonify({"reply": bot_reply})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to get response from AI"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
