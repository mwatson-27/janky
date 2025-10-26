from flask import Flask, render_template, request, jsonify, flash, redirect, url_for #https://www.geeksforgeeks.org/python/pass-javascript-variables-to-python-in-flask/
import sqlite3
import json
import os
from werkzeug.utils import secure_filename
from datetime import datetime

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/', methods=['GET', 'POST'])
def home():
  # EDSTEM SOURCE MATERIAL FROM PRIOR ASSESSMENT THEFT
  return render_template('index.html')

@app.route("/total_reset")
def total_reset():
  # EDSTEM SOURCE MATERIAL FROM PRIOR ASSESSMENT THEFT
  conn = sqlite3.connect('database.db')
  conn.execute("DROP TABLE IF EXISTS decks;")
  conn.execute('CREATE TABLE decks(deck_id INTEGER PRIMARY KEY AUTOINCREMENT, deck_name TEXT NOT NULL, length REAL NOT NULL, date REAL NOT NULL, deck_content TEXT NOT NULL, user TEXT NOT NULL);')

  return render_template('index.html')

@app.route("/newdeckrender")
def newdeckrender():
  # EDSTEM SOURCE MATERIAL FROM PRIOR ASSESSMENT THEFT
  
  return render_template('newdeckrender.html')

@app.route("/save_deck", methods=["POST"])
def save_deck():
  if request.method == "POST":
    msg1 = ""
    
    

    try:
      free_loot = request.get_json()
      deck_title = free_loot.get("deck_title")
      cards = free_loot.get("flashcards")
      date = free_loot.get("creation_date")
      deck_length = free_loot.get("length")

      with open("testing.txt", "w") as testfile:
        testfile.write(deck_title + "\n" + str(cards) + "\n" + str(date) + "\n" + str(deck_length))
      
      # https://www.w3schools.com/python/python_json.asp
      #EDSTEM SOURCE MATERIAL THEFT AGAIN
      conn = sqlite3.connect("database.db")
      cur = conn.cursor()
      cur.execute("""INSERT INTO decks (deck_name, length, date, deck_content, user) VALUES (?,?,?,?,?)""",(deck_title, deck_length, date, json.dumps(cards), "usernames coming soon"))

      conn.commit()
      msg1 = "probably worked"
    except:
      conn.rollback()
      conn.close()
      msg1 = "did not work"
    finally:
      return render_template("test.html", msg=msg1)

@app.route("/list")
def get_list():
  conn = sqlite3.connect('database.db')
  conn.row_factory = sqlite3.Row
  select = "SELECT deck_name, length, date, deck_content, user FROM decks"
  rows1 = conn.execute(select).fetchall()
  rows2 = []
  for deck_name, length, date, deck_content, user in rows1:
    rows2.append({
      "deck_name":deck_name,
      "length":length,
      "date":datetime.fromtimestamp(date/1000),
      "deck_content":deck_content,
      "user":user})

  return render_template("list.html", rows = rows2)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == "json"

#MY CODE FROM THE OTHER ASSESSMENT
@app.route('/upload_deck', methods=['GET', 'POST'])
def upload_deck():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('no file part')
            return redirect(request.url)
        file = request.files['file']
        # no file?
        if file.filename == '':
            flash('no selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('study_deck', file=filename))
    return render_template("upload.html")

@app.route("/study", methods=['GET', 'POST'])
def study_deck():
  filename = request.args.get('file')
  if not filename:
      
      return redirect(url_for('upload_deck'))
  path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

  with open(path, "r") as f:
    deck = json.load(f)
  
  if filename: #stolen from myself
      filename = secure_filename(filename)
      file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
      if os.path.exists(file_path):
          os.remove(file_path)

  return render_template("study.html", filename=filename, deck=deck)



if __name__ == '__main__':
  # EDSTEM SOURCE MATERIAL FROM PRIOR ASSESSMENT THEFT
  app.run(debug = True, host = '0.0.0.0')


